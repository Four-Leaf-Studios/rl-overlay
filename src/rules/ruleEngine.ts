import { useState, useCallback, useRef, useEffect } from "react";
import type {
  OverlayRule,
  OverlayComponentConfig,
  OverlayDataContext,
  ComponentRuntimeState,
  RuleAction,
} from "../types";
import { evaluateConditions } from "./evaluateCondition";
import { resolvePath } from "../binding/bindingResolver";

export type RuntimeStateMap = Record<string, ComponentRuntimeState>;

function patchState(
  prev: RuntimeStateMap,
  componentId: string,
  patch: Partial<ComponentRuntimeState>,
): RuntimeStateMap {
  return {
    ...prev,
    [componentId]: { ...(prev[componentId] ?? {}), ...patch },
  };
}

function applyActionToState(
  action: RuleAction,
  prev: RuntimeStateMap,
): RuntimeStateMap {
  switch (action.type) {
    case "show":
      return patchState(prev, action.componentId, { visible: true });
    case "hide":
      return patchState(prev, action.componentId, { visible: false });
    case "setState":
      return patchState(prev, action.componentId, {
        activeState: action.state,
      });
    case "setStyle": {
      const ex = prev[action.componentId] ?? {};
      return {
        ...prev,
        [action.componentId]: {
          ...ex,
          stylePatches: { ...(ex.stylePatches ?? {}), ...action.style },
        },
      };
    }
    case "setProp": {
      const ex = prev[action.componentId] ?? {};
      return {
        ...prev,
        [action.componentId]: {
          ...ex,
          propsPatches: {
            ...(ex.propsPatches ?? {}),
            [action.prop]: action.value,
          },
        },
      };
    }
    case "addClass": {
      const ex = prev[action.componentId] ?? {};
      const classes = ex.classNames ?? [];
      if (classes.includes(action.className)) return prev;
      return {
        ...prev,
        [action.componentId]: {
          ...ex,
          classNames: [...classes, action.className],
        },
      };
    }
    case "removeClass": {
      const ex = prev[action.componentId] ?? {};
      return {
        ...prev,
        [action.componentId]: {
          ...ex,
          classNames: (ex.classNames ?? []).filter(
            (c) => c !== action.className,
          ),
        },
      };
    }
    case "animate":
      return patchState(prev, action.componentId, {
        animation: action.animation,
      });
    default:
      return prev;
  }
}

export function useRuleEngine(
  rules: OverlayRule[],
  _components: OverlayComponentConfig[],
  context: OverlayDataContext,
) {
  const [runtimeState, setRuntimeState] = useState<RuntimeStateMap>({});
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const lastEventTimestamp = useRef<number | null>(null);

  const scheduleTimer = useCallback(
    (key: string, ms: number, fn: () => void) => {
      const existing = timerRefs.current.get(key);
      if (existing !== undefined) clearTimeout(existing);
      const id = setTimeout(fn, ms);
      timerRefs.current.set(key, id);
    },
    [],
  );

  const fireActions = useCallback(
    (actions: RuleAction[]) => {
      setRuntimeState((prev) => {
        let next = prev;
        for (const action of actions) {
          const run = (s: RuntimeStateMap) => {
            const updated = applyActionToState(action, s);
            if (action.type === "show" && action.durationMs) {
              const durMs = action.durationMs;
              const cid = action.componentId;
              scheduleTimer(`${cid}:hide:duration`, durMs, () => {
                setRuntimeState((st) =>
                  patchState(st, cid, { visible: false }),
                );
              });
            }
            return updated;
          };

          if (action.delayMs) {
            const delayMs = action.delayMs;
            const key = `${action.componentId}:${action.type}:delay`;
            scheduleTimer(key, delayMs, () => {
              setRuntimeState((s) => run(s));
            });
          } else {
            next = run(next);
          }
        }
        return next;
      });
    },
    [scheduleTimer],
  );

  // Fire event-triggered rules when a new SOS event arrives
  useEffect(() => {
    const lastEvent = context.event.last;
    if (!lastEvent) return;
    if (lastEvent.receivedAt === lastEventTimestamp.current) return;
    lastEventTimestamp.current = lastEvent.receivedAt;

    const ctxObj = context as unknown as Record<string, unknown>;
    const enabledRules = rules.filter((r) => r.enabled !== false);

    for (const rule of enabledRules) {
      if (rule.trigger.type !== "event") continue;
      if (rule.trigger.event !== lastEvent.name) continue;
      const conditions = rule.conditions ?? [];
      if (!evaluateConditions(conditions, ctxObj)) continue;
      fireActions(rule.actions);
    }
  }, [context.event.last, rules, fireActions]);

  // Fire data-triggered rules whenever context changes
  useEffect(() => {
    const ctxObj = context as unknown as Record<string, unknown>;
    const enabledRules = rules.filter((r) => r.enabled !== false);

    for (const rule of enabledRules) {
      if (rule.trigger.type !== "data") continue;
      const trigger = rule.trigger;
      const triggerMet = evaluateConditions(
        [
          {
            path: trigger.path,
            operator: trigger.operator,
            value: trigger.value,
          },
        ],
        ctxObj,
      );
      if (!triggerMet) continue;
      const conditions = rule.conditions ?? [];
      if (!evaluateConditions(conditions, ctxObj)) continue;
      fireActions(rule.actions);
    }
    // We intentionally do not include fireActions in deps to avoid infinite loops.
    // fireActions is stable (useCallback with stable deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, rules]);

  // Clean up timers on unmount
  useEffect(() => {
    const timers = timerRefs.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  /**
   * Manually fire a named SOS event (for editor preview / mock mode).
   */
  const fireEvent = useCallback(
    (eventName: string, payload: unknown = {}) => {
      const ctxObj = {
        ...(context as unknown as Record<string, unknown>),
        event: {
          ...(context.event as Record<string, unknown>),
          last: { name: eventName, payload, receivedAt: Date.now() },
        },
      };
      const enabledRules = rules.filter((r) => r.enabled !== false);
      for (const rule of enabledRules) {
        if (rule.trigger.type !== "event") continue;
        if (rule.trigger.event !== eventName) continue;
        const conditions = rule.conditions ?? [];
        if (!evaluateConditions(conditions, ctxObj)) continue;
        fireActions(rule.actions);
      }
    },
    [context, rules, fireActions],
  );

  return { runtimeState, fireEvent };
}
