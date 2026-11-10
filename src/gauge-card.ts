import { LitElement, css, html, nothing, svg } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import './editor';
import { ConfigError, collectEntities, normalizeConfig } from './config';
import { computeLayout, viewSize } from './layout';
import type { ArcLayout, IconLayout, Layout } from './layout';
import type { GaugeCardConfig, HomeAssistant } from './types';

const ROW_HEIGHT = 56;

export class GaugeCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _error: { state: true },
  };

  hass?: HomeAssistant;
  _config?: GaugeCardConfig;
  _error?: string;
  private _entities: string[] = [];

  static getStubConfig(): Record<string, unknown> {
    return {
      gauge: { radius: 100, width: 20 },
      bars: [{ entity: '', min: 0, max: 100 }],
    };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('gauge-card-editor');
  }

  setConfig(config: unknown): void {
    try {
      this._config = normalizeConfig(config);
      this._entities = collectEntities(this._config);
      this._error = undefined;
    } catch (e) {
      if (e instanceof ConfigError) {
        throw new Error(e.message);
      }
      throw e;
    }
  }

  getCardSize(): number {
    return this._config ? Math.ceil(this._viewHeight() / 50) : 4;
  }

  getGridOptions() {
    const rows = Math.max(2, Math.round(this._viewHeight() / ROW_HEIGHT));
    return { columns: 6, rows, min_columns: 3, min_rows: 2 };
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }
    if (changed.has('_config') || changed.has('_error')) {
      return true;
    }
    const old = changed.get('hass') as HomeAssistant | undefined;
    if (!old || !this.hass) {
      return true;
    }
    return this._entities.some((id) => old.states[id] !== this.hass!.states[id]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) {
      return nothing;
    }
    const l = computeLayout(this._config, this.hass);
    return html`
      <ha-card @click=${this._tap}>
        <svg viewBox="0 0 ${l.width} ${l.height}" role="img" aria-label=${this._ariaLabel(l)}>
          ${this._arc(l.track, l.linecap, 'track')} ${l.secondaryTrack ? this._arc(l.secondaryTrack, l.linecap) : nothing}
          ${l.secondaryBar ? this._arc(l.secondaryBar, l.linecap) : nothing}
          ${l.bars.map((b) => this._arc(b, l.linecap))} ${this._center(l)}
          ${l.secondaryIcon ? this._icon(l.secondaryIcon) : nothing} ${l.indicators.map((i) => this._icon(i))}
          ${l.secondaryLabel
            ? svg`<text x=${l.secondaryLabel.x} y=${l.secondaryLabel.y} font-size=${l.secondaryLabel.size}
                fill=${l.secondaryLabel.color} text-anchor="middle">${l.secondaryLabel.text}</text>`
            : nothing}
        </svg>
      </ha-card>
    `;
  }

  private _viewHeight(): number {
    return this._config ? viewSize(this._config).height : 250;
  }

  private _ariaLabel(l: Layout): string {
    return l.center.runs.map((r) => r.text).join('');
  }

  private _arc(a: ArcLayout, linecap: string, cls = ''): TemplateResult | typeof nothing {
    if (a.path === '') {
      return nothing;
    }
    return svg`<path class=${cls} d=${a.path} fill="none" stroke=${a.color} stroke-width=${a.width}
      stroke-linecap=${linecap} />`;
  }

  private _center(l: Layout): TemplateResult {
    return svg`<text x=${l.center.x} y=${l.center.y} text-anchor="middle">
      ${l.center.runs.map(
        (r) => svg`<tspan font-size=${r.size} dy=${r.dy} fill=${r.color}>${r.text}</tspan>`,
      )}
    </text>`;
  }

  private _icon(i: IconLayout): TemplateResult {
    if (i.icon.startsWith('M')) {
      const s = i.size / 24;
      return svg`<path d=${i.icon} fill=${i.color}
        transform="translate(${i.x - i.size / 2} ${i.y - i.size / 2}) scale(${s})" />`;
    }
    return svg`<foreignObject x=${i.x - i.size / 2} y=${i.y - i.size / 2} width=${i.size} height=${i.size}>
      <ha-icon .icon=${i.icon} style="--mdc-icon-size:${i.size}px;color:${i.color};display:flex"></ha-icon>
    </foreignObject>`;
  }

  private _tap = (): void => {
    if (!this._config) {
      return;
    }
    const entity = this._config.center.entity ?? this._config.bars[0].entity;
    const action = this._config.tap_action ?? { action: 'more-info' };
    if (action.action === 'none') {
      return;
    }
    this.dispatchEvent(
      new CustomEvent('hass-action', {
        bubbles: true,
        composed: true,
        detail: { config: { entity, tap_action: action }, action: 'tap' },
      }),
    );
  };

  static styles = css`
    ha-card {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      box-sizing: border-box;
    }
    svg {
      width: 100%;
      height: 100%;
      max-height: 100%;
    }
    text {
      dominant-baseline: alphabetic;
      font-family: var(--ha-card-font-family, inherit);
    }
  `;
}
