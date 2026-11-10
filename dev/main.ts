import { parse } from 'yaml';
import * as mdi from '@mdi/js';
import '../src/index';
import water from '../examples/water.yaml?raw';
import solar from '../examples/solar.yaml?raw';

if (!customElements.get('ha-card')) {
  customElements.define('ha-card', class extends HTMLElement {});
}

class MockIcon extends HTMLElement {
  private _icon = '';

  set icon(v: string) {
    this._icon = v;
    this.render();
  }

  get icon(): string {
    return this._icon;
  }

  attributeChangedCallback(_n: string, _o: string, v: string): void {
    this.icon = v;
  }

  static observedAttributes = ['icon'];

  private render(): void {
    const name = this._icon.replace(/^mdi:/, '');
    const key = 'mdi' + name.replace(/(^|-)(\w)/g, (_m, _d, c: string) => c.toUpperCase());
    const path = (mdi as Record<string, string>)[key];
    this.style.display = 'inline-flex';
    this.style.width = this.style.height = 'var(--mdc-icon-size, 24px)';
    this.innerHTML = path
      ? `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="${path}"/></svg>`
      : `<span title="unknown icon ${this._icon}">?</span>`;
  }
}

if (!customElements.get('ha-icon')) {
  customElements.define('ha-icon', MockIcon);
}

type States = Record<string, { state: string; attributes: Record<string, unknown> }>;

function mount(yaml: string, sensors: Record<string, [number, number, number]>, toggles: Record<string, [string, string, boolean]>) {
  const wrap = document.createElement('div');
  const card = document.createElement('gauge-card') as any;
  card.setConfig(parse(yaml));
  const values: Record<string, string> = {};
  for (const [id, [on, off, init]] of Object.entries(toggles)) {
    values[id] = init ? on : off;
  }
  for (const [id, [, , v]] of Object.entries(sensors)) {
    values[id] = String(v);
  }
  const push = () => {
    const states: States = {};
    for (const [id, v] of Object.entries(values)) {
      states[id] = { state: v, attributes: {} };
    }
    card.hass = { states };
  };
  wrap.append(card);
  for (const [id, [min, max, v]] of Object.entries(sensors)) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.value = String(v);
    input.oninput = () => {
      values[id] = input.value;
      push();
    };
    label.append(id + ' ', input);
    wrap.append(label);
  }
  for (const [id, [on, off, init]] of Object.entries(toggles)) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = init;
    box.onchange = () => {
      values[id] = box.checked ? on : off;
      push();
    };
    label.append(box, ` ${id} = ${on}`);
    wrap.append(label);
  }
  push();
  document.body.append(wrap);
}

mount(water, { 'sensor.geyser_percent': [0, 100, 70], 'sensor.tank_percent': [0, 100, 80] }, {
  'binary_sensor.geyser_heating': ['on', 'off', false],
  'binary_sensor.water_connected': ['on', 'off', true],
});
mount(
  solar,
  {
    'sensor.load_power': [-6000, 6000, 1800],
    'sensor.pv_power': [-6000, 6000, 3200],
    'sensor.battery_power': [-6000, 6000, -1400],
    'sensor.grid_power': [-6000, 6000, 0],
    'sensor.battery_soc': [0, 100, 55],
  },
  { 'sensor.grid_frequency': ['50', '0', true] },
);
