import type { Axis } from './types';

export const MIN_SECONDARY_SWEEP = 5;

export interface Point {
  x: number;
  y: number;
}

const round = (n: number): number => Math.round(n * 1000) / 1000;

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const a = toRadians(deg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// Angles follow the SVG convention: 0 is 3 o'clock, positive is clockwise, 90 is the bottom.

// trackAxis returns the arc of the main track. The opening is centred on the
// bottom and rotated clockwise by rotation, unless an explicit arc is given.
export function trackAxis(g: { gap: number; rotation: number; arc?: Axis }): Axis {
  if (g.arc) {
    return g.arc;
  }
  return { start: 90 + g.gap / 2 + g.rotation, sweep: 360 - g.gap };
}

// gapCentre returns the angle pointing into the middle of the track opening.
export function gapCentre(track: Axis): number {
  const dir = Math.sign(track.sweep) || 1;
  const remaining = 360 - Math.abs(track.sweep);
  return track.start - dir * (remaining / 2);
}

// secondaryAxis returns the arc that fills the track opening, minus padding on each side.
// The axis starts next to the track start and runs away from the track.
// It returns null when the opening is too small to hold the arc.
export function secondaryAxis(track: Axis, padding: number): Axis | null {
  const dir = Math.sign(track.sweep) || 1;
  const usable = 360 - Math.abs(track.sweep) - 2 * padding;
  if (usable < MIN_SECONDARY_SWEEP) {
    return null;
  }
  return { start: track.start - dir * padding, sweep: -dir * usable };
}

export function fraction(value: number, min: number, max: number, clamp: boolean): number {
  const f = (value - min) / (max - min);
  if (!clamp) {
    return f;
  }
  return Math.min(1, Math.max(0, f));
}

export function angleAt(axis: Axis, f: number, reverse: boolean): number {
  const t = reverse ? 1 - f : f;
  return axis.start + axis.sweep * t;
}

export function originFraction(origin: 'min' | 'centre' | number, min: number, max: number): number {
  if (origin === 'min') {
    return 0;
  }
  if (origin === 'centre') {
    return 0.5;
  }
  return fraction(origin, min, max, true);
}

export interface ValueSpec {
  min: number;
  max: number;
  origin: 'min' | 'centre' | number;
  reverse: boolean;
  clamp: boolean;
}

// valueArc returns the arc that is drawn for the value: from the origin to the value.
export function valueArc(axis: Axis, spec: ValueSpec, value: number): Axis {
  const a0 = angleAt(axis, originFraction(spec.origin, spec.min, spec.max), spec.reverse);
  const a1 = angleAt(axis, fraction(value, spec.min, spec.max, spec.clamp), spec.reverse);
  const sweep = Math.max(-360, Math.min(360, a1 - a0));
  return { start: a0, sweep };
}

// arcPath returns the SVG path data for an arc, or an empty string if there is nothing to draw.
export function arcPath(cx: number, cy: number, r: number, start: number, sweep: number): string {
  if (Math.abs(sweep) < 0.01) {
    return '';
  }
  const flag = sweep > 0 ? 1 : 0;
  const p0 = polar(cx, cy, r, start);

  if (Math.abs(sweep) >= 359.99) {
    const mid = polar(cx, cy, r, start + sweep / 2);
    const end = polar(cx, cy, r, start + sweep);
    return `M ${round(p0.x)} ${round(p0.y)} A ${r} ${r} 0 1 ${flag} ${round(mid.x)} ${round(mid.y)} A ${r} ${r} 0 1 ${flag} ${round(end.x)} ${round(end.y)}`;
  }

  const p1 = polar(cx, cy, r, start + sweep);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  return `M ${round(p0.x)} ${round(p0.y)} A ${r} ${r} 0 ${large} ${flag} ${round(p1.x)} ${round(p1.y)}`;
}
