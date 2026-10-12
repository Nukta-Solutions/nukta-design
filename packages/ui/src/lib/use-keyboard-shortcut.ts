import { useEffect, useRef } from "react";

export interface KeyboardShortcutOptions {
  /** Require ⌘ on macOS or Ctrl elsewhere. Default true. */
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Turn the shortcut off without unmounting. */
  enabled?: boolean;
  /** Fire even while typing in an input, textarea or contenteditable. Default false for plain keys. */
  allowInInputs?: boolean;
}

/**
 * Calls `handler` when `key` is pressed with the given modifiers, e.g. ⌘K / Ctrl+K:
 * `useKeyboardShortcut("k", () => setOpen(true))`.
 */
export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  {
    mod = true,
    shift = false,
    alt = false,
    enabled = true,
    allowInInputs,
  }: KeyboardShortcutOptions = {},
) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (mod !== (event.metaKey || event.ctrlKey)) return;
      if (shift !== event.shiftKey || alt !== event.altKey) return;
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      // Modifier shortcuts work everywhere; plain keys don't fire while the user is typing.
      if (typing && !(allowInInputs ?? mod)) return;
      event.preventDefault();
      handlerRef.current(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, mod, shift, alt, enabled, allowInInputs]);
}
