export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  [key: string]: unknown;
}

export interface Condition {
  entity?: string;
  attribute?: string;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  eq?: number;
  between?: [number, number];
  outside?: [number, number];
  state?: string;
  state_not?: string;
  unavailable?: boolean;
}

export interface ColorRule {
  when: Condition;
  color: string;
}

export type Linecap = 'butt' | 'round' | 'square';
export type Origin = 'min' | 'centre' | number;

export interface Axis {
  start: number;
  sweep: number;
}

export interface GaugeSettings {
  radius: number;
  width: number;
  gap: number;
  rotation: number;
  arc?: Axis;
  color: string;
  color_rules: ColorRule[];
  spacing: number;
  linecap: Linecap;
}

export interface ValueSource {
  entity: string;
  attribute?: string;
  min: number;
  max: number;
  origin: Origin;
  reverse: boolean;
  clamp: boolean;
  color: string;
  color_rules: ColorRule[];
}

export interface BarConfig extends ValueSource {
  radius?: number;
  width: number;
}

export interface IconConfig {
  icon: string;
  x?: number;
  y?: number;
  size: number;
  color: string;
}

export interface LabelConfig {
  x?: number;
  y?: number;
  size: number;
  color: string;
  decimals: number;
  unit?: string;
}

export interface TrackConfig {
  width: number;
  color: string;
  color_rules: ColorRule[];
}

export interface SecondaryConfig extends ValueSource {
  padding: number;
  radius?: number;
  width: number;
  track: TrackConfig;
  icon?: IconConfig;
  label?: LabelConfig;
}

export type SegmentType = 'integer' | 'fraction' | 'unit' | 'text';

export interface SegmentConfig {
  type: SegmentType;
  text?: string;
  size: number;
  shift: number;
  color?: string;
}

export interface CenterConfig {
  entity?: string;
  attribute?: string;
  scale: number;
  decimals: number;
  rounding: 'floor' | 'round';
  unit?: string;
  color: string;
  segments: SegmentConfig[];
}

export interface IndicatorConfig extends IconConfig {
  when: Condition;
}

export interface ActionConfig {
  action: string;
  [key: string]: unknown;
}

export interface GaugeCardConfig {
  type?: string;
  view?: { width: number; height: number };
  gauge: GaugeSettings;
  bars: BarConfig[];
  secondary?: SecondaryConfig;
  center: CenterConfig;
  indicators: IndicatorConfig[];
  tap_action?: ActionConfig;
}
