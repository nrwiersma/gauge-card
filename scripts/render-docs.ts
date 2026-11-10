import { readFileSync, writeFileSync } from 'node:fs';
import * as mdi from '@mdi/js';
import { parse } from 'yaml';
import { normalizeConfig } from '../src/config';
import { computeLayout } from '../src/layout';
import type { ArcLayout, IconLayout } from '../src/layout';
import type { HomeAssistant } from '../src/types';

function hassOf(states: Record<string, string>): HomeAssistant {
  return { states: Object.fromEntries(Object.entries(states).map(([k, v]) => [k, { state: v, attributes: {} }])) };
}

function iconPath(name: string): string {
  const key = 'mdi' + name.replace(/^mdi:/, '').replace(/(^|-)(\w)/g, (_m, _d, c: string) => c.toUpperCase());
  return (mdi as Record<string, string>)[key] ?? '';
}

function arc(a: ArcLayout, linecap: string): string {
  return a.path === ''
    ? ''
    : `<path d="${a.path}" fill="none" stroke="${a.color}" stroke-width="${a.width}" stroke-linecap="${linecap}"/>`;
}

function icon(i: IconLayout): string {
  const s = i.size / 24;
  return `<path d="${iconPath(i.icon)}" fill="${i.color}" transform="translate(${i.x - i.size / 2} ${i.y - i.size / 2}) scale(${s})"/>`;
}

function render(name: string, states: Record<string, string>): void {
  const config = normalizeConfig(parse(readFileSync(`examples/${name}.yaml`, 'utf8')));
  const l = computeLayout(config, hassOf(states));
  const parts = [
    arc(l.track, l.linecap),
    l.secondaryTrack ? arc(l.secondaryTrack, l.linecap) : '',
    l.secondaryBar ? arc(l.secondaryBar, l.linecap) : '',
    ...l.bars.map((b) => arc(b, l.linecap)),
    `<text x="${l.center.x}" y="${l.center.y}" text-anchor="middle">${l.center.runs
      .map((r) => `<tspan font-size="${r.size}" dy="${r.dy}" fill="${r.color}">${r.text}</tspan>`)
      .join('')}</text>`,
    l.secondaryIcon ? icon(l.secondaryIcon) : '',
    ...l.indicators.map(icon),
    l.secondaryLabel
      ? `<text x="${l.secondaryLabel.x}" y="${l.secondaryLabel.y}" font-size="${l.secondaryLabel.size}" fill="${l.secondaryLabel.color}" text-anchor="middle">${l.secondaryLabel.text}</text>`
      : '',
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" font-family="Roboto, Helvetica, Arial, sans-serif">
<rect width="${l.width}" height="${l.height}" rx="12" fill="#1c1c1c"/>
${parts.filter(Boolean).join('\n')}
</svg>
`;
  writeFileSync(`docs/${name}.svg`, svg);
}

render('water', {
  'binary_sensor.geyser_heating': 'off',
  'binary_sensor.water_connected': 'on',
  'sensor.geyser_percent': '72',
  'sensor.tank_percent': '80',
});

render('solar', {
  'sensor.load_power': '1830',
  'sensor.pv_power': '3200',
  'sensor.battery_power': '-1400',
  'sensor.grid_power': '0',
  'sensor.battery_soc': '55',
  'sensor.grid_frequency': '50',
});
