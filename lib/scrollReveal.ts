export const DEFAULT_REVEAL_THRESHOLD = 0.2;
export const DEFAULT_REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";

/**
 * Pure predicate used inside the IntersectionObserver callback in
 * `useScrollReveal`. Kept separate from the hook so it's unit-testable
 * without a DOM/IntersectionObserver.
 */
export function shouldReveal(
  isIntersecting: boolean,
  intersectionRatio: number,
  threshold: number = DEFAULT_REVEAL_THRESHOLD,
): boolean {
  return isIntersecting && intersectionRatio >= threshold;
}
