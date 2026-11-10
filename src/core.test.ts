import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { evaluate, resolveColor } from './conditions';
import { collectEntities, ConfigError, normalizeConfig } from './config';
import { angleAt, arcPath, fraction, gapCentre, secondaryAxis, trackAxis, valueArc } from './geometry';
import { computeLayout } from './layout';
import type { HomeAssistant } from './types';

function hassOf(states: Record<string, string | { state: string; attributes: Record<string, unknown> }>): HomeAssistant {
  const out: HomeAssistant['states'] = {};
  for (const [k, v] of Object.entries(states)) {
    out[k] = typeof v === 'string' ? { state: v, attributes: {} } : v;
  }
  return { states: out };
}

const example = (name: string) => normalizeConfig(parse(readFileSync(`examples/${name}.yaml`, 'utf8')));

describe('geometry', () => {
  it('derives the track from gap and rotation', () => {
    expect(trackAxis({ gap: 80, rotation: 0 })).toEqual({ start: 130, sweep: 280 });
    expect(trackAxis({ gap: 80, rotation: 10 })).toEqual({ start: 140, sweep: 280 });
    expect(gapCentre({ start: 130, sweep: 280 })).toBeCloseTo(90);
  });

  it('fits the secondary axis in the gap', () => {
    expect(secondaryAxis({ start: 130, sweep: 280 }, 10)).toEqual({ start: 120, sweep: -60 });
    expect(secondaryAxis({ start: 130, sweep: 280 }, 40)).toBeNull();
  });

  it('computes fractions and angles', () => {
    expect(fraction(150, 0, 100, true)).toBe(1);
    expect(fraction(150, 0, 100, false)).toBe(1.5);
    expect(angleAt({ start: 0, sweep: 100 }, 0.25, true)).toBe(75);
  });

  it('draws from the origin to the value', () => {
    const spec = { min: -100, max: 100, origin: 0 as const, reverse: false, clamp: true };
    expect(valueArc({ start: 0, sweep: 200 }, spec, 50)).toEqual({ start: 100, sweep: 50 });
    expect(valueArc({ start: 0, sweep: 200 }, spec, -50)).toEqual({ start: 100, sweep: -50 });
  });

  it('builds arc paths', () => {
    expect(arcPath(0, 0, 10, 0, 0)).toBe('');
    expect(arcPath(0, 0, 10, 0, 90)).toBe('M 10 0 A 10 10 0 0 1 0 10');
    expect(arcPath(0, 0, 10, 0, -270)).toContain('A 10 10 0 1 0');
    expect(arcPath(0, 0, 10, 0, 360).match(/A /g)).toHaveLength(2);
  });
});

describe('conditions', () => {
  const hass = hassOf({
    'sensor.a': '40',
    'sensor.u': 'unavailable',
    'switch.s': 'on',
    'sensor.attr': { state: '1', attributes: { level: 7 } },
  });

  it('compares numerically and inclusively', () => {
    expect(evaluate({ lte: 40 }, hass, 'sensor.a')).toBe(true);
    expect(evaluate({ lt: 40 }, hass, 'sensor.a')).toBe(false);
    expect(evaluate({ gt: 10, lt: 50 }, hass, 'sensor.a')).toBe(true);
    expect(evaluate({ between: [40, 50] }, hass, 'sensor.a')).toBe(true);
    expect(evaluate({ outside: [0, 50] }, hass, 'sensor.a')).toBe(false);
  });

  it('handles states, attributes and unavailable', () => {
    expect(evaluate({ entity: 'switch.s', state: 'on' }, hass, 'sensor.a')).toBe(true);
    expect(evaluate({ entity: 'switch.s', state_not: 'on' }, hass)).toBe(false);
    expect(evaluate({ attribute: 'level', gte: 7 }, hass, 'sensor.attr')).toBe(true);
    expect(evaluate({ unavailable: true }, hass, 'sensor.u')).toBe(true);
    expect(evaluate({ unavailable: true }, hass, 'sensor.missing')).toBe(true);
    expect(evaluate({ lte: 100 }, hass, 'sensor.u')).toBe(false);
  });

  it('uses the first matching rule', () => {
    const rules = [
      { when: { lte: 30 }, color: 'red' },
      { when: { lte: 50 }, color: 'orange' },
    ];
    expect(resolveColor(rules, 'blue', hass, 'sensor.a')).toBe('orange');
    expect(resolveColor(rules, 'blue', hassOf({ 'sensor.a': '90' }), 'sensor.a')).toBe('blue');
  });
});

describe('config', () => {
  it('rejects invalid config', () => {
    expect(() => normalizeConfig({})).toThrow(ConfigError);
    expect(() => normalizeConfig({ bars: [{ entity: 'a', min: 1, max: 1 }] })).toThrow(/differ/);
    expect(() => normalizeConfig({ gauge: { gap: 400 }, bars: [{ entity: 'a' }] })).toThrow(/gap/);
    expect(() =>
      normalizeConfig({ bars: [{ entity: 'a' }], secondary: { entity: 'b', padding: 40 } }),
    ).toThrow(/fit/);
  });

  it('collects every entity', () => {
    expect(collectEntities(example('water')).sort()).toEqual([
      'binary_sensor.geyser_heating',
      'binary_sensor.water_connected',
      'sensor.geyser_percent',
      'sensor.tank_percent',
    ]);
  });
});

describe('water golden', () => {
  const config = example('water');
  const states = { 'binary_sensor.geyser_heating': 'off', 'binary_sensor.water_connected': 'on', 'sensor.tank_percent': '80' };

  it('sizes the view like the original', () => {
    const l = computeLayout(config, hassOf({ ...states, 'sensor.geyser_percent': '70' }));
    expect(l.width).toBe(250);
  });

  it('draws the geyser bar and rules', () => {
    const at = (p: string, heating = 'off') =>
      computeLayout(config, hassOf({ ...states, 'binary_sensor.geyser_heating': heating, 'sensor.geyser_percent': p }));
    const l = at('50');
    expect(Math.abs(l.track.start - 129)).toBeLessThan(1.5);
    expect(l.bars[0].sweep).toBeCloseTo(140, 0);
    expect(l.bars[0].color).toBe('#ff9830');
    expect(at('80').bars[0].color).toBe('#5794f2');
    expect(at('20').bars[0].color).toBe('#f2495c');
    expect(at('80', 'on').bars[0].color).toBe('#ff9830');
    expect(at('80', 'on').track.color).toBe('#3d2d1d');
  });

  it('draws the tank growing counter-clockwise', () => {
    const l = computeLayout(config, hassOf({ ...states, 'sensor.geyser_percent': '70' }));
    expect(l.secondaryBar?.start).toBeCloseTo(115, 0);
    expect(l.secondaryBar?.sweep).toBeCloseTo(-40, 0);
    expect(l.secondaryBar?.color).toBe('#37c7ff');
  });

  it('shows the warning only when disconnected', () => {
    const at = (c: string) =>
      computeLayout(config, hassOf({ ...states, 'binary_sensor.water_connected': c, 'sensor.geyser_percent': '70' }));
    expect(at('on').indicators).toHaveLength(0);
    expect(at('off').indicators).toHaveLength(1);
  });

  it('formats the centre', () => {
    const l = computeLayout(config, hassOf({ ...states, 'sensor.geyser_percent': '69.9' }));
    expect(l.center.runs.map((r) => r.text)).toEqual(['69', '%']);
    expect(l.center.runs[1].dy).toBe(-33);
  });
});

describe('solar golden', () => {
  const config = example('solar');
  const states = {
    'sensor.load_power': '3000',
    'sensor.pv_power': '1500',
    'sensor.battery_power': '-3000',
    'sensor.grid_power': '0',
    'sensor.battery_soc': '50',
    'sensor.grid_frequency': '50',
  };

  it('stacks the bars from the outside in', () => {
    const l = computeLayout(config, hassOf(states));
    expect(l.bars.map((b) => b.radius)).toEqual([140, 130, 120, 110]);
  });

  it('starts at the top with positive counter-clockwise', () => {
    const l = computeLayout(config, hassOf(states));
    expect(l.bars[0].start).toBeCloseTo(270);
    expect(l.bars[0].sweep).toBeCloseTo(-67.5, 0);
    expect(l.bars[2].sweep).toBeCloseTo(67.5, 0);
    expect(l.bars[3].path).toBe('');
  });

  it('formats kW by truncating', () => {
    const l = computeLayout(config, hassOf({ ...states, 'sensor.load_power': '1239' }));
    expect(l.center.runs.map((r) => r.text)).toEqual(['1', '.23', 'kW']);
  });

  it('colours the state of charge', () => {
    const colour = (s: string) => computeLayout(config, hassOf({ ...states, 'sensor.battery_soc': s })).secondaryBar?.color;
    expect(colour('10')).toBe('#f2495c');
    expect(colour('30')).toBe('#ff9830');
    expect(colour('90')).toBe('#37c7ff');
  });

  it('warns when the grid is down', () => {
    const l = computeLayout(config, hassOf({ ...states, 'sensor.grid_frequency': '0' }));
    expect(l.indicators).toHaveLength(1);
  });
});
