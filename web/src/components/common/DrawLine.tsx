import { forwardRef } from "react";

type DrawLineProps = {
    className?: string;
};

export const DrawLine = forwardRef<SVGLineElement, DrawLineProps>(function DrawLine(
    { className },
    ref
) {
    return (
        <svg
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            aria-hidden="true"
            className={className}
            style={{ width: "100%", height: "1px", display: "block", overflow: "visible" }}
        >
            <line
                ref={ref}
                x1="0"
                y1="1"
                x2="1000"
                y2="1"
                stroke="var(--border)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
});
