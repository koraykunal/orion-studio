import { createContext } from "react";
import type Lenis from "lenis";

/**
 * The Lenis instance is published so a component can drive the scroll
 * programmatically, for example to jump to an anchor after a navigation.
 *
 * `useLenis` was removed: it had no callers, and DESIGN-SYSTEM.md documented
 * it as "unused but retained intentionally", which is a way of keeping dead
 * code alive by writing it down. Consumers that need it should ask for it
 * rather than have it pre-declared.
 */
export const LenisContext = createContext<Lenis | null>(null);
