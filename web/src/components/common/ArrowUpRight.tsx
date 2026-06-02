type ArrowUpRightProps = {
    size?: number;
    className?: string;
    strokeWidth?: number;
};

export function ArrowUpRight({ size = 12, className, strokeWidth = 1.2 }: ArrowUpRightProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M1 11L11 1M11 1H3M11 1V9"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
