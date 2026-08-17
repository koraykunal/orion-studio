"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduced(motion.matches);

        sync();
        motion.addEventListener("change", sync);
        return () => motion.removeEventListener("change", sync);
    }, []);

    return reduced;
}
