import { LitElement, css, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

type Cfg = Record<string, any>;
type Schema = Record<string, unknown>[];

const entity = (name: string) => ({ name, selector: { entity: {} } });
const number = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  selector: { number: { mode: 'box', step: 'any', ...extra } },
});
const color = (name: string) => ({ name, selector: { text: { type: 'color' } } });
const text = (name: string) => ({ name, selector: { text: {} } });

const GAUGE: Schema = [
  {
    type: 'grid',
    name: '',
    schema: [number('radius'), number('width'), number('gap', { min: 0, max: 359 }), number('rotation'), number('spacing'), color('color')],
  },
];

const BAR: Schema = [
  entity('entity'),
  text('attribute'),
  {
    type: 'grid',
    name: '',
    schema: [
      number('min'),
      number('max'),
      { name: 'origin_mode', selector: { select: { mode: 'dropdown', options: [
        { value: 'min', label: 'Minimum' },
        { value: 'centre', label: 'Centre' },
        { value: 'value', label: 'Value' },
      ] } } },
      number('origin_value'),
      { name: 'reverse', selector: { boolean: {} } },
      number('width'),
      color('color'),
    ],
  },
];

const SECONDARY: Schema = [
  entity('entity'),
  text('attribute'),
  {
    type: 'grid',
    name: '',
    schema: [number('min'), number('max'), number('padding'), number('width'), color('color'), { name: 'reverse', selector: { boolean: {} } }],
  },
];

const CENTER: Schema = [
  entity('entity'),
  text('attribute'),
  {
    type: 'grid',
    name: '',
    schema: [number('scale'), number('decimals', { min: 0, max: 6, step: 1 }), text('unit'), color('color')],
  },
];

const LABELS: Record<string, string> = {
  entity: 'Entity',
  attribute: 'Attribute',
  radius: 'Radius',
  width: 'Width',
  gap: 'Gap (degrees)',
  rotation: 'Rotation (degrees)',
  spacing: 'Bar spacing',
  color: 'Colour',
  min: 'Minimum',
  max: 'Maximum',
  origin_mode: 'Origin',
  origin_value: 'Origin value',
  reverse: 'Reverse',
  padding: 'Padding (degrees)',
  scale: 'Scale',
  decimals: 'Decimals',
  unit: 'Unit',
};

function barToForm(bar: Cfg): Cfg {
  const o = bar.origin;
  const form = { ...bar };
  delete form.origin;
  if (typeof o === 'number') {
    form.origin_mode = 'value';
    form.origin_value = o;
  } else {
    form.origin_mode = o === 'centre' || o === 'center' ? 'centre' : 'min';
  }
  return form;
}

function formToBar(form: Cfg): Cfg {
  const bar = { ...form };
  const mode = bar.origin_mode;
  delete bar.origin_mode;
  delete bar.origin_value;
  if (mode === 'value') {
    bar.origin = form.origin_value ?? 0;
  } else if (mode === 'centre') {
    bar.origin = 'centre';
  }
  return bar;
}

export class GaugeCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: unknown;
  _config: Cfg = {};

  setConfig(config: Cfg): void {
    this._config = config;
  }

  private _fire(config: Cfg): void {
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
  }

  private _label = (s: { name: string }): string => LABELS[s.name] ?? s.name;

  private _section(key: string, schema: Schema, title: string, data = this._config[key] ?? {}): TemplateResult {
    return html`
      <ha-expansion-panel outlined .header=${title}>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._label}
          @value-changed=${(e: CustomEvent) => this._fire({ ...this._config, [key]: this._prune(e.detail.value) })}
        ></ha-form>
      </ha-expansion-panel>
    `;
  }

  private _prune(v: Cfg): Cfg {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined && x !== ''));
  }

  private _setBar(i: number, form: Cfg): void {
    const bars = [...(this._config.bars ?? [])];
    bars[i] = this._prune(formToBar(form));
    this._fire({ ...this._config, bars });
  }

  private _removeBar(i: number): void {
    const bars = (this._config.bars ?? []).filter((_: Cfg, idx: number) => idx !== i);
    this._fire({ ...this._config, bars });
  }

  private _moveBar(i: number, d: number): void {
    const bars = [...(this._config.bars ?? [])];
    const j = i + d;
    if (j < 0 || j >= bars.length) {
      return;
    }
    [bars[i], bars[j]] = [bars[j], bars[i]];
    this._fire({ ...this._config, bars });
  }

  private _addBar(): void {
    this._fire({ ...this._config, bars: [...(this._config.bars ?? []), { entity: '', min: 0, max: 100 }] });
  }

  private _toggleSecondary(e: CustomEvent): void {
    const next = { ...this._config };
    if (e.detail.value) {
      next.secondary = { entity: '', min: 0, max: 100, padding: 10 };
    } else {
      delete next.secondary;
    }
    this._fire(next);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }
    const bars: Cfg[] = this._config.bars ?? [];
    return html`
      ${this._section('gauge', GAUGE, 'Gauge')}
      <ha-expansion-panel outlined .header=${'Bars'}>
        ${bars.map(
          (bar, i) => html`
            <div class="bar">
              <div class="bar-header">
                <span>Bar ${i + 1}</span>
                <span>
                  <ha-icon-button .label=${'Move up'} @click=${() => this._moveBar(i, -1)}>
                    <ha-icon icon="mdi:arrow-up"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${'Move down'} @click=${() => this._moveBar(i, 1)}>
                    <ha-icon icon="mdi:arrow-down"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button .label=${'Remove'} @click=${() => this._removeBar(i)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </ha-icon-button>
                </span>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${barToForm(bar)}
                .schema=${BAR}
                .computeLabel=${this._label}
                @value-changed=${(e: CustomEvent) => this._setBar(i, e.detail.value)}
              ></ha-form>
            </div>
          `,
        )}
        <mwc-button @click=${this._addBar}>Add bar</mwc-button>
      </ha-expansion-panel>
      <ha-formfield .label=${'Secondary bar'}>
        <ha-switch .checked=${this._config.secondary !== undefined} @change=${(e: Event) =>
          this._toggleSecondary(new CustomEvent('x', { detail: { value: (e.target as HTMLInputElement).checked } }))}></ha-switch>
      </ha-formfield>
      ${this._config.secondary ? this._section('secondary', SECONDARY, 'Secondary bar') : nothing}
      ${this._section('center', CENTER, 'Centre display')}
      <p class="hint">
        Colour rules, indicators, the secondary icon and label, and centre segments are edited in the code editor.
      </p>
    `;
  }

  static styles = css`
    ha-expansion-panel {
      display: block;
      margin-bottom: 8px;
    }
    .bar {
      border-bottom: 1px solid var(--divider-color);
      padding: 8px 0;
    }
    .bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
}

if (!customElements.get('gauge-card-editor')) {
  customElements.define('gauge-card-editor', GaugeCardEditor);
}
