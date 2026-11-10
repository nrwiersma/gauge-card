import { MIN_SECONDARY_SWEEP, secondaryAxis, trackAxis } from './geometry';
import type {
  BarConfig,
  CenterConfig,
  ColorRule,
  Condition,
  GaugeCardConfig,
  GaugeSettings,
  IconConfig,
  IndicatorConfig,
  LabelConfig,
  SecondaryConfig,
  SegmentConfig,
} from './types';

type Raw = Record<string, any>;

export class ConfigError extends Error {}

function obj(v: unknown, what: string): Raw {
  if (v === undefined || v === null) {
    return {};
  }
  if (typeof v !== 'object' || Array.isArray(v)) {
    throw new ConfigError(`${what} must be an object`);
  }
  return v as Raw;
}

function list(v: unknown, what: string): Raw[] {
  if (v === undefined || v === null) {
    return [];
  }
  if (!Array.isArray(v)) {
    throw new ConfigError(`${what} must be a list`);
  }
  return v.map((x, i) => obj(x, `${what}[${i}]`));
}

function num(v: unknown, def: number, what: string): number {
  if (v === undefined || v === null || v === '') {
    return def;
  }
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new ConfigError(`${what} must be a number`);
  }
  return n;
}

function optNum(v: unknown, what: string): number | undefined {
  return v === undefined || v === null || v === '' ? undefined : num(v, 0, what);
}

function str(v: unknown, def: string): string {
  return typeof v === 'string' && v !== '' ? v : def;
}

function rules(v: unknown, what: string): ColorRule[] {
  return list(v, what).map((r, i) => {
    if (typeof r.color !== 'string') {
      throw new ConfigError(`${what}[${i}].color is required`);
    }
    return { when: obj(r.when, `${what}[${i}].when`) as Condition, color: r.color };
  });
}

function origin(v: unknown, what: string): 'min' | 'centre' | number {
  if (v === undefined || v === null || v === 'min') {
    return 'min';
  }
  if (v === 'centre' || v === 'center') {
    return 'centre';
  }
  return num(v, 0, what);
}

function source(r: Raw, what: string, defColor: string) {
  if (typeof r.entity !== 'string' || r.entity === '') {
    throw new ConfigError(`${what}.entity is required`);
  }
  const min = num(r.min, 0, `${what}.min`);
  const max = num(r.max, 100, `${what}.max`);
  if (min === max) {
    throw new ConfigError(`${what}.min and ${what}.max must differ`);
  }
  return {
    entity: r.entity as string,
    attribute: typeof r.attribute === 'string' && r.attribute !== '' ? r.attribute : undefined,
    min,
    max,
    origin: origin(r.origin, `${what}.origin`),
    reverse: r.reverse === true,
    clamp: r.clamp !== false,
    color: str(r.color, defColor),
    color_rules: rules(r.color_rules, `${what}.color_rules`),
  };
}

function icon(v: unknown, what: string): IconConfig | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }
  const r = obj(v, what);
  if (typeof r.icon !== 'string' || r.icon === '') {
    throw new ConfigError(`${what}.icon is required`);
  }
  return {
    icon: r.icon,
    x: optNum(r.x, `${what}.x`),
    y: optNum(r.y, `${what}.y`),
    size: num(r.size, 24, `${what}.size`),
    color: str(r.color, '#ffffff'),
  };
}

function label(v: unknown, what: string): LabelConfig | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }
  const r = obj(v, what);
  return {
    x: optNum(r.x, `${what}.x`),
    y: optNum(r.y, `${what}.y`),
    size: num(r.size, 15, `${what}.size`),
    color: str(r.color, '#ffffff'),
    decimals: num(r.decimals, 0, `${what}.decimals`),
    unit: typeof r.unit === 'string' ? r.unit : undefined,
  };
}

function gauge(v: unknown): GaugeSettings {
  const r = obj(v, 'gauge');
  const gap = num(r.gap, 80, 'gauge.gap');
  if (gap < 0 || gap >= 360) {
    throw new ConfigError('gauge.gap must be in [0, 360)');
  }
  let arc;
  if (r.arc !== undefined && r.arc !== null) {
    const a = obj(r.arc, 'gauge.arc');
    arc = { start: num(a.start, 0, 'gauge.arc.start'), sweep: num(a.sweep, 0, 'gauge.arc.sweep') };
  }
  const linecap = str(r.linecap, 'round');
  if (!['butt', 'round', 'square'].includes(linecap)) {
    throw new ConfigError('gauge.linecap must be butt, round or square');
  }
  return {
    radius: num(r.radius, 100, 'gauge.radius'),
    width: num(r.width, 20, 'gauge.width'),
    gap,
    rotation: num(r.rotation, 0, 'gauge.rotation'),
    arc,
    color: str(r.color, '#282828'),
    color_rules: rules(r.color_rules, 'gauge.color_rules'),
    spacing: num(r.spacing, 10, 'gauge.spacing'),
    linecap: linecap as GaugeSettings['linecap'],
  };
}

function bars(v: unknown): BarConfig[] {
  const items = list(v, 'bars');
  if (items.length === 0) {
    throw new ConfigError('bars must contain at least one bar');
  }
  return items.map((r, i) => ({
    ...source(r, `bars[${i}]`, '#5794f2'),
    radius: optNum(r.radius, `bars[${i}].radius`),
    width: num(r.width, 5, `bars[${i}].width`),
  }));
}

function secondary(v: unknown, g: GaugeSettings): SecondaryConfig | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }
  const r = obj(v, 'secondary');
  const t = obj(r.track, 'secondary.track');
  const padding = num(r.padding, 10, 'secondary.padding');
  if (secondaryAxis(trackAxis(g), padding) === null) {
    throw new ConfigError(
      `secondary does not fit: gauge.gap minus 2 x padding must be at least ${MIN_SECONDARY_SWEEP} degrees`,
    );
  }
  const trackWidth = num(t.width, 15, 'secondary.track.width');
  const inset = num(r.inset, 3, 'secondary.inset');
  return {
    ...source(r, 'secondary', '#37c7ff'),
    padding,
    radius: optNum(r.radius, 'secondary.radius'),
    width: num(r.width, Math.max(1, trackWidth - 2 * inset), 'secondary.width'),
    track: {
      width: trackWidth,
      color: str(t.color, '#1e1e1e'),
      color_rules: rules(t.color_rules, 'secondary.track.color_rules'),
    },
    icon: icon(r.icon, 'secondary.icon'),
    label: label(r.label, 'secondary.label'),
  };
}

function segments(v: unknown, decimals: number, hasUnit: boolean): SegmentConfig[] {
  if (v !== undefined && v !== null) {
    return list(v, 'center.segments').map((r, i) => {
      const type = str(r.type, '');
      if (!['integer', 'fraction', 'unit', 'text'].includes(type)) {
        throw new ConfigError(`center.segments[${i}].type must be integer, fraction, unit or text`);
      }
      return {
        type: type as SegmentConfig['type'],
        text: typeof r.text === 'string' ? r.text : undefined,
        size: num(r.size, 20, `center.segments[${i}].size`),
        shift: num(r.shift, 0, `center.segments[${i}].shift`),
        color: typeof r.color === 'string' ? r.color : undefined,
      };
    });
  }
  const out: SegmentConfig[] = [{ type: 'integer', size: 60, shift: 0 }];
  if (decimals > 0) {
    out.push({ type: 'fraction', size: 30, shift: 0 });
  }
  if (hasUnit) {
    out.push({ type: 'unit', size: 20, shift: 0 });
  }
  return out;
}

function center(v: unknown): CenterConfig {
  const r = obj(v, 'center');
  const decimals = num(r.decimals, 0, 'center.decimals');
  if (decimals < 0 || !Number.isInteger(decimals)) {
    throw new ConfigError('center.decimals must be a non-negative integer');
  }
  const rounding = str(r.rounding, 'floor');
  if (rounding !== 'floor' && rounding !== 'round') {
    throw new ConfigError('center.rounding must be floor or round');
  }
  const unit = typeof r.unit === 'string' && r.unit !== '' ? r.unit : undefined;
  return {
    entity: typeof r.entity === 'string' && r.entity !== '' ? r.entity : undefined,
    attribute: typeof r.attribute === 'string' && r.attribute !== '' ? r.attribute : undefined,
    scale: num(r.scale, 1, 'center.scale'),
    decimals,
    rounding,
    unit,
    color: str(r.color, '#ffffff'),
    segments: segments(r.segments, decimals, unit !== undefined),
  };
}

function indicators(v: unknown): IndicatorConfig[] {
  return list(v, 'indicators').map((r, i) => {
    const ic = icon(r, `indicators[${i}]`) as IconConfig;
    return { ...ic, when: obj(r.when, `indicators[${i}].when`) as Condition };
  });
}

function action(v: unknown): GaugeCardConfig['tap_action'] {
  if (v === undefined || v === null) {
    return undefined;
  }
  const r = obj(v, 'action');
  if (typeof r.action !== 'string') {
    throw new ConfigError('action.action is required');
  }
  return r as GaugeCardConfig['tap_action'];
}

// normalizeConfig validates the user config and fills in the defaults.
export function normalizeConfig(input: unknown): GaugeCardConfig {
  const r = obj(input, 'config');
  const g = gauge(r.gauge);
  let view;
  if (r.view !== undefined && r.view !== null) {
    const vr = obj(r.view, 'view');
    view = { width: num(vr.width, 0, 'view.width'), height: num(vr.height, 0, 'view.height') };
    if (view.width <= 0 || view.height <= 0) {
      throw new ConfigError('view.width and view.height must be positive');
    }
  }
  return {
    type: typeof r.type === 'string' ? r.type : undefined,
    view,
    gauge: g,
    bars: bars(r.bars),
    secondary: secondary(r.secondary, g),
    center: center(r.center),
    indicators: indicators(r.indicators),
    tap_action: action(r.tap_action),
  };
}

// collectEntities returns every entity id the card reads.
export function collectEntities(c: GaugeCardConfig): string[] {
  const set = new Set<string>();
  const addRules = (rs: ColorRule[]) => rs.forEach((r) => r.when.entity && set.add(r.when.entity));

  addRules(c.gauge.color_rules);
  for (const b of c.bars) {
    set.add(b.entity);
    addRules(b.color_rules);
  }
  if (c.secondary) {
    set.add(c.secondary.entity);
    addRules(c.secondary.color_rules);
    addRules(c.secondary.track.color_rules);
  }
  if (c.center.entity) {
    set.add(c.center.entity);
  }
  for (const ind of c.indicators) {
    if (ind.when.entity) {
      set.add(ind.when.entity);
    }
  }
  return [...set];
}
