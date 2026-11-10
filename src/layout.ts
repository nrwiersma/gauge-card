import { resolveColor, readNumber, evaluate } from './conditions';
import { arcPath, gapCentre, polar, secondaryAxis, trackAxis, valueArc } from './geometry';
import type { Axis, GaugeCardConfig, HomeAssistant } from './types';

export interface ArcLayout {
  path: string;
  start: number;
  sweep: number;
  radius: number;
  width: number;
  color: string;
}

export interface TextRun {
  text: string;
  size: number;
  dy: number;
  color: string;
}

export interface IconLayout {
  icon: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface Layout {
  width: number;
  height: number;
  track: ArcLayout;
  bars: ArcLayout[];
  secondaryTrack?: ArcLayout;
  secondaryBar?: ArcLayout;
  secondaryIcon?: IconLayout;
  secondaryLabel?: { text: string; x: number; y: number; size: number; color: string };
  center: { x: number; y: number; runs: TextRun[] };
  indicators: IconLayout[];
  linecap: string;
}

const AUTO_ICON_RADIUS = 0.78;
const AUTO_INDICATOR_RADIUS = 0.4;
const VIEW_MARGIN = 15;
const BASELINE_FACTOR = 0.36;
const MISSING = '—';

// barRadii returns the radius of each bar, stacking them around the gauge radius with the first outermost.
export function barRadii(config: GaugeCardConfig): number[] {
  const n = config.bars.length;
  return config.bars.map(
    (b, i) => b.radius ?? config.gauge.radius + ((n - 1) / 2 - i) * config.gauge.spacing,
  );
}

export function viewSize(config: GaugeCardConfig): { width: number; height: number } {
  if (config.view) {
    return config.view;
  }
  const g = config.gauge;
  const radii = barRadii(config);
  let extent = g.radius + g.width / 2;
  config.bars.forEach((b, i) => {
    extent = Math.max(extent, radii[i] + b.width / 2);
  });
  if (config.secondary) {
    const s = config.secondary;
    extent = Math.max(extent, (s.radius ?? g.radius) + s.track.width / 2);
  }
  const size = Math.ceil(2 * (extent + VIEW_MARGIN));
  return { width: size, height: size };
}

function formatCenter(config: GaugeCardConfig, value: number): { integer: string; fraction: string } {
  const c = config.center;
  const scaled = Math.abs(value * c.scale);
  const factor = 10 ** c.decimals;
  const n = c.rounding === 'round' ? Math.round(scaled * factor) : Math.floor(scaled * factor + 1e-9);
  const integer = Math.floor(n / factor);
  const fraction = String(n % factor).padStart(c.decimals, '0');
  const sign = value * c.scale < 0 && n !== 0 ? '-' : '';
  return { integer: sign + String(integer), fraction };
}

function centerRuns(config: GaugeCardConfig, hass: HomeAssistant): TextRun[] {
  const c = config.center;
  const first = c.segments[0]?.size ?? 20;
  const entity = c.entity ?? config.bars[0].entity;
  const attribute = c.entity ? c.attribute : (c.attribute ?? config.bars[0].attribute);
  const value = readNumber(hass, entity, attribute);

  if (value === undefined) {
    return [{ text: MISSING, size: first, dy: 0, color: c.color }];
  }

  const parts = formatCenter(config, value);
  const runs: TextRun[] = [];
  let shift = 0;
  for (const seg of c.segments) {
    let text: string;
    switch (seg.type) {
      case 'integer':
        text = parts.integer;
        break;
      case 'fraction':
        text = c.decimals > 0 ? `.${parts.fraction}` : '';
        break;
      case 'unit':
        text = c.unit ?? '';
        break;
      default:
        text = seg.text ?? '';
    }
    if (text === '') {
      continue;
    }
    runs.push({ text, size: seg.size, dy: -(seg.shift - shift), color: seg.color ?? c.color });
    shift = seg.shift;
  }
  return runs;
}

function arc(cx: number, cy: number, radius: number, width: number, color: string, a: Axis): ArcLayout {
  return { path: arcPath(cx, cy, radius, a.start, a.sweep), start: a.start, sweep: a.sweep, radius, width, color };
}

// computeLayout turns the config and the current states into plain drawing instructions.
export function computeLayout(config: GaugeCardConfig, hass: HomeAssistant): Layout {
  const g = config.gauge;
  const { width, height } = viewSize(config);
  const cx = width / 2;
  const cy = height / 2;
  const track = trackAxis(g);
  const gapAngle = gapCentre(track);
  const first = config.bars[0];

  const layout: Layout = {
    width,
    height,
    linecap: g.linecap,
    track: arc(
      cx,
      cy,
      g.radius,
      g.width,
      resolveColor(g.color_rules, g.color, hass, first.entity, first.attribute),
      track,
    ),
    bars: [],
    center: { x: cx, y: cy + (config.center.segments[0]?.size ?? 20) * BASELINE_FACTOR, runs: [] },
    indicators: [],
  };

  const radii = barRadii(config);
  config.bars.forEach((b, i) => {
    const value = readNumber(hass, b.entity, b.attribute);
    const color = resolveColor(b.color_rules, b.color, hass, b.entity, b.attribute);
    const a = value === undefined ? { start: track.start, sweep: 0 } : valueArc(track, b, value);
    layout.bars.push(arc(cx, cy, radii[i], b.width, color, a));
  });

  const s = config.secondary;
  if (s) {
    const axis = secondaryAxis(track, s.padding) as Axis;
    const radius = s.radius ?? g.radius;
    layout.secondaryTrack = arc(
      cx,
      cy,
      radius,
      s.track.width,
      resolveColor(s.track.color_rules, s.track.color, hass, s.entity, s.attribute),
      axis,
    );
    const value = readNumber(hass, s.entity, s.attribute);
    const a = value === undefined ? { start: axis.start, sweep: 0 } : valueArc(axis, s, value);
    layout.secondaryBar = arc(
      cx,
      cy,
      radius,
      s.width,
      resolveColor(s.color_rules, s.color, hass, s.entity, s.attribute),
      a,
    );

    if (s.icon) {
      const p = polar(cx, cy, g.radius * AUTO_ICON_RADIUS, gapAngle);
      layout.secondaryIcon = {
        icon: s.icon.icon,
        x: s.icon.x !== undefined ? cx + s.icon.x : p.x,
        y: s.icon.y !== undefined ? cy + s.icon.y : p.y,
        size: s.icon.size,
        color: s.icon.color,
      };
    }
    if (s.label && value !== undefined) {
      const p = polar(cx, cy, radius, gapAngle);
      const factor = 10 ** s.label.decimals;
      const shown = Math.round(value * factor) / factor;
      layout.secondaryLabel = {
        text: `${shown.toFixed(s.label.decimals)}${s.label.unit ?? ''}`,
        x: s.label.x !== undefined ? cx + s.label.x : p.x,
        y: s.label.y !== undefined ? cy + s.label.y : p.y + s.label.size * BASELINE_FACTOR,
        size: s.label.size,
        color: s.label.color,
      };
    }
  }

  layout.center.runs = centerRuns(config, hass);

  const active = config.indicators.filter((ind) => evaluate(ind.when, hass));
  const base = polar(cx, cy, g.radius * AUTO_INDICATOR_RADIUS, gapAngle);
  active.forEach((ind, i) => {
    const spread = (i - (active.length - 1) / 2) * (ind.size + 4);
    layout.indicators.push({
      icon: ind.icon,
      x: ind.x !== undefined ? cx + ind.x : base.x + spread,
      y: ind.y !== undefined ? cy + ind.y : base.y,
      size: ind.size,
      color: ind.color,
    });
  });

  return layout;
}
