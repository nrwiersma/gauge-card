import type { ColorRule, Condition, HomeAssistant } from './types';

const UNAVAILABLE = ['unavailable', 'unknown'];

function readRaw(hass: HomeAssistant, entity: string, attribute?: string): unknown {
  const state = hass.states[entity];
  if (!state) {
    return undefined;
  }
  const raw = attribute ? state.attributes[attribute] : state.state;
  if (raw === null || raw === undefined) {
    return undefined;
  }
  if (typeof raw === 'string' && UNAVAILABLE.includes(raw)) {
    return undefined;
  }
  return raw;
}

// readNumber returns the numeric value of an entity, or undefined if it is missing or not a number.
export function readNumber(hass: HomeAssistant, entity: string, attribute?: string): number | undefined {
  const raw = readRaw(hass, entity, attribute);
  if (raw === undefined) {
    return undefined;
  }
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : undefined;
}

// evaluate reports whether all of the operators in the condition hold.
// The condition applies to the default source unless it names an entity of its own.
export function evaluate(
  cond: Condition,
  hass: HomeAssistant,
  defaultEntity?: string,
  defaultAttribute?: string,
): boolean {
  const entity = cond.entity ?? defaultEntity;
  const attribute = cond.entity ? cond.attribute : (cond.attribute ?? defaultAttribute);
  if (!entity) {
    return false;
  }

  const raw = readRaw(hass, entity, attribute);

  if (cond.unavailable !== undefined && (raw === undefined) !== cond.unavailable) {
    return false;
  }
  if (cond.state !== undefined && (raw === undefined || String(raw) !== cond.state)) {
    return false;
  }
  if (cond.state_not !== undefined && (raw === undefined || String(raw) === cond.state_not)) {
    return false;
  }

  const numeric =
    cond.gt !== undefined ||
    cond.gte !== undefined ||
    cond.lt !== undefined ||
    cond.lte !== undefined ||
    cond.eq !== undefined ||
    cond.between !== undefined ||
    cond.outside !== undefined;
  if (!numeric) {
    return true;
  }

  const n = readNumber(hass, entity, attribute);
  if (n === undefined) return false;
  if (cond.gt !== undefined && !(n > cond.gt)) return false;
  if (cond.gte !== undefined && !(n >= cond.gte)) return false;
  if (cond.lt !== undefined && !(n < cond.lt)) return false;
  if (cond.lte !== undefined && !(n <= cond.lte)) return false;
  if (cond.eq !== undefined && n !== cond.eq) return false;
  if (cond.between && !(n >= cond.between[0] && n <= cond.between[1])) return false;
  if (cond.outside && !(n < cond.outside[0] || n > cond.outside[1])) return false;
  return true;
}

// resolveColor returns the colour of the first matching rule, or the base colour.
export function resolveColor(
  rules: ColorRule[],
  base: string,
  hass: HomeAssistant,
  defaultEntity?: string,
  defaultAttribute?: string,
): string {
  for (const rule of rules) {
    if (evaluate(rule.when, hass, defaultEntity, defaultAttribute)) {
      return rule.color;
    }
  }
  return base;
}
