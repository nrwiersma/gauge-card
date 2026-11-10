import { GaugeCard } from './gauge-card';

if (!customElements.get('gauge-card')) {
  customElements.define('gauge-card', GaugeCard);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'gauge-card',
  name: 'Gauge Card',
  description: 'Configurable multi-bar arc gauge with a secondary bar, centre display and colour rules.',
  preview: true,
});
