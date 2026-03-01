"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";
import Lenis from "lenis";

export function useScrollReset(lenis?: Lenis | null) {
    const pathname = usePathname();

    useEffect(() => {
        if (!lenis) return;
        lenis.scrollTo(0, {immediate: true});
    }, [pathname, lenis]);
}
