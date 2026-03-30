"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES } from "@/lib/animations/config";
import { OrionMark } from "@/components/effects/OrionMark";
import type { DeviceShowcaseData, DeviceItem } from "@/lib/project-types";

function IPhone({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-full" style={{ aspectRatio: "393/852" }}>
            <div className="absolute inset-0 bg-[#1a1a1c] shadow-[0_0_0_1.5px_#3a3a3e,0_0_0_2.5px_rgba(255,255,255,0.08),0_8px_30px_-4px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.4)]" style={{ borderRadius: "13.5% / 6.2%" }}>
                <div className="absolute overflow-hidden bg-black" style={{ top: "1.8%", left: "3%", right: "3%", bottom: "1.8%", borderRadius: "11.2% / 4.9%" }}>
                    {src ? (
                        <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 60vw, (max-width: 1024px) 35vw, 25vw" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14]" />
                    )}
                    <div className="absolute top-[1%] left-1/2 -translate-x-1/2 h-[3.2%] bg-black z-10" style={{ width: "28%", borderRadius: "9999px" }} />
                </div>
                <div className="absolute bottom-[1%] left-1/2 -translate-x-1/2 w-[34%] h-[0.45%] bg-white/15 rounded-full z-20" />
                <div className="absolute top-[18%] -right-[0.4%] w-[0.6%] h-[6%] bg-[#2a2a2e] rounded-l-sm" />
                <div className="absolute top-[14%] -left-[0.4%] w-[0.6%] h-[3%] bg-[#2a2a2e] rounded-r-sm" />
                <div className="absolute top-[20%] -left-[0.4%] w-[0.6%] h-[5.5%] bg-[#2a2a2e] rounded-r-sm" />
                <div className="absolute top-[27%] -left-[0.4%] w-[0.6%] h-[5.5%] bg-[#2a2a2e] rounded-r-sm" />
            </div>
        </div>
    );
}

function IPad({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-full" style={{ aspectRatio: "820/1180" }}>
            <div className="absolute inset-0 bg-[#1a1a1c] shadow-[0_0_0_2px_#2a2a2e,0_0_0_3px_rgba(255,255,255,0.06),0_8px_30px_-4px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.4)]" style={{ borderRadius: "3.5%" }}>
                <div className="absolute overflow-hidden bg-black" style={{ top: "1.5%", left: "2.5%", right: "2.5%", bottom: "1.5%", borderRadius: "2.5%" }}>
                    {src ? (
                        <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 30vw" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14]" />
                    )}
                </div>
                <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-[1.2%] aspect-square min-w-[3px] rounded-full bg-[#08080c] ring-1 ring-white/[0.04]" />
            </div>
        </div>
    );
}

function MacBook({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-full">
            <div className="relative w-full" style={{ aspectRatio: "1440/900" }}>
                <div className="absolute inset-0 rounded-t-[12px] max-[640px]:rounded-t-[6px] bg-[#1a1a1c] shadow-[0_0_0_2px_#2a2a2e,0_0_0_3px_rgba(255,255,255,0.06),0_8px_30px_-4px_rgba(0,0,0,0.7)]">
                    <div className="absolute top-[2.8%] left-[2.5%] right-[2.5%] bottom-0 rounded-t-[4px] overflow-hidden bg-black">
                        {src ? (
                            <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14]" />
                        )}
                    </div>
                    <div className="absolute top-[0.8%] left-1/2 -translate-x-1/2 w-[0.8%] aspect-square min-w-[4px] rounded-full bg-[#0a0a0e] ring-1 ring-white/[0.04]" />
                </div>
            </div>
            <div className="relative w-[106%] -ml-[3%]">
                <div className="h-[5px] max-[640px]:h-[3px] bg-[#2a2a2e] rounded-b-[4px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.5)]" />
                <div className="h-[3px] max-[640px]:h-[2px] bg-[#222225] mx-[24%] rounded-b-md" />
            </div>
        </div>
    );
}

function DesktopMonitor({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-full">
            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 rounded-[8px] max-[640px]:rounded-[4px] bg-[#1a1a1c] shadow-[0_0_0_2px_#2a2a2e,0_0_0_3px_rgba(255,255,255,0.06),0_8px_30px_-4px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-[2%] left-[1.5%] right-[1.5%] bottom-[4%] rounded-[3px] overflow-hidden bg-black">
                        {src ? (
                            <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14]" />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-[5%] h-[clamp(12px,2vw,28px)] bg-[#1a1a1c] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
                <div className="w-[18%] h-[clamp(4px,0.5vw,6px)] bg-[#1a1a1c] rounded-sm shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
            </div>
        </div>
    );
}

function Device({ device }: { device: DeviceItem }) {
    const p = { src: device.image, alt: device.alt };
    switch (device.type) {
        case "phone": return <IPhone {...p} />;
        case "tablet": return <IPad {...p} />;
        case "laptop": return <MacBook {...p} />;
        case "desktop": return <DesktopMonitor {...p} />;
    }
}

function FullShowcaseLayout({ devices }: { devices: DeviceItem[] }) {
    const phone = devices.find((d) => d.type === "phone");
    const tablet = devices.find((d) => d.type === "tablet");
    const desktop = devices.find((d) => d.type === "desktop");
    const laptop = devices.find((d) => d.type === "laptop");

    return (
        <div className="relative mx-auto flex items-end" style={{ maxWidth: "1200px" }}>
            {phone && (
                <div
                    className="dv-wrap relative shrink-0"
                    style={{
                        width: "clamp(52px,8vw,100px)",
                        zIndex: 30,
                        marginRight: "clamp(-6px,-1vw,-12px)",
                        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.6))",
                    }}
                >
                    <Device device={phone} />
                </div>
            )}
            {tablet && (
                <div
                    className="dv-wrap relative shrink-0"
                    style={{
                        width: "clamp(80px,14vw,175px)",
                        zIndex: 20,
                        marginRight: "clamp(-16px,-3vw,-36px)",
                        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
                    }}
                >
                    <Device device={tablet} />
                </div>
            )}
            {desktop && (
                <div
                    className="dv-wrap relative flex-1 min-w-0"
                    style={{
                        zIndex: 10,
                        maxWidth: "620px",
                    }}
                >
                    <Device device={desktop} />
                </div>
            )}
            {laptop && (
                <div
                    className="dv-wrap relative shrink-0"
                    style={{
                        width: "clamp(180px,32vw,390px)",
                        zIndex: 20,
                        marginLeft: "clamp(-24px,-4.5vw,-56px)",
                        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
                    }}
                >
                    <Device device={laptop} />
                </div>
            )}
        </div>
    );
}

function MobileShowcaseLayout({ devices }: { devices: DeviceItem[] }) {
    const phone = devices.find((d) => d.type === "phone");
    const tablet = devices.find((d) => d.type === "tablet");
    const desktop = devices.find((d) => d.type === "desktop");
    const laptop = devices.find((d) => d.type === "laptop");

    return (
        <div className="flex flex-col items-center gap-6">
            {desktop && (
                <div className="dv-wrap w-[85vw] max-w-[400px]">
                    <Device device={desktop} />
                </div>
            )}
            {laptop && (
                <div className="dv-wrap w-[80vw] max-w-[380px]">
                    <Device device={laptop} />
                </div>
            )}
            <div className="flex items-end justify-center gap-4">
                {tablet && (
                    <div className="dv-wrap" style={{ width: "clamp(110px,32vw,170px)" }}>
                        <Device device={tablet} />
                    </div>
                )}
                {phone && (
                    <div className="dv-wrap" style={{ width: "clamp(65px,18vw,100px)" }}>
                        <Device device={phone} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function DeviceShowcaseSection({ data }: { data: DeviceShowcaseData }) {
    const ref = useRef<HTMLDivElement>(null);
    const devices = data.devices.filter((d) => d.image || true);

    useGSAP(() => {
        if (!ref.current) return;

        const els = ref.current.querySelectorAll(".dv-wrap");
        els.forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 60,
                scale: 0.92,
                duration: 1.4,
                delay: i * 0.15,
                ease: EASES.brand,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 78%",
                    toggleActions: "play none none none",
                },
            });
        });
    }, { scope: ref });

    if (!devices.length) return null;

    const large = devices.filter((d) => d.type === "laptop" || d.type === "desktop");
    const small = devices.filter((d) => d.type === "phone" || d.type === "tablet");
    const count = devices.length;
    const hasAllFour =
        devices.some((d) => d.type === "phone") &&
        devices.some((d) => d.type === "tablet") &&
        devices.some((d) => d.type === "desktop") &&
        devices.some((d) => d.type === "laptop");
    const hasLarge = large.length > 0;
    const hasSmall = small.length > 0;
    const isMixed = hasLarge && hasSmall;

    return (
        <div className="relative overflow-visible -mx-[clamp(1.5rem,5vw,5rem)]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[60%] h-[80%]">
                    <OrionMark variant="minimal" lineOpacity={0.03} globalOpacity={0.15} rotate={12} bgStarCount={15} />
                </div>
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full" style={{ background: "radial-gradient(ellipse 60% 50%, oklch(0.72 0.15 295 / 0.06) 0%, transparent 70%)" }} />
                <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 100%)" }} />
            </div>

            <div ref={ref} className="relative z-10 px-[clamp(1.5rem,5vw,5rem)] py-[clamp(2rem,5vw,5rem)]">
                {hasAllFour ? (
                    <>
                        <div className="hidden sm:block">
                            <FullShowcaseLayout devices={devices} />
                        </div>
                        <div className="block sm:hidden">
                            <MobileShowcaseLayout devices={devices} />
                        </div>
                    </>
                ) : isMixed && count === 2 ? (
                    <div className="relative mx-auto" style={{ maxWidth: "1000px" }}>
                        <div className="dv-wrap w-[75%]">
                            <Device device={large[0]} />
                        </div>
                        <div className="dv-wrap absolute right-0 bottom-[-8%] w-[30%] max-[640px]:relative max-[640px]:w-[45%] max-[640px]:mx-auto max-[640px]:mt-8 max-[640px]:bottom-auto" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}>
                            <Device device={small[0]} />
                        </div>
                    </div>
                ) : isMixed && count > 2 ? (
                    <div className="relative mx-auto flex items-end justify-center" style={{ maxWidth: "1100px" }}>
                        {[...small, ...large].map((d, i) => (
                            <div
                                key={i}
                                className="dv-wrap relative"
                                style={{
                                    width: d.type === "phone" ? "clamp(52px,8vw,100px)"
                                        : d.type === "tablet" ? "clamp(80px,14vw,175px)"
                                        : d.type === "laptop" ? "clamp(180px,32vw,390px)"
                                        : undefined,
                                    flex: d.type === "desktop" ? "1 1 0" : undefined,
                                    maxWidth: d.type === "desktop" ? "620px" : undefined,
                                    zIndex: d.type === "desktop" ? 10 : 20,
                                    marginLeft: i > 0 ? "clamp(-12px,-2vw,-24px)" : undefined,
                                    filter: d.type !== "desktop" ? "drop-shadow(0 12px 32px rgba(0,0,0,0.55))" : undefined,
                                }}
                            >
                                <Device device={d} />
                            </div>
                        ))}
                    </div>
                ) : count === 1 ? (
                    <div className="dv-wrap mx-auto" style={{ width: devices[0].type === "phone" ? "clamp(180px,30vw,280px)" : devices[0].type === "tablet" ? "clamp(260px,40vw,420px)" : "clamp(320px,70vw,780px)" }}>
                        <Device device={devices[0]} />
                    </div>
                ) : (
                    <div className="flex items-end justify-center gap-[clamp(1rem,3vw,3rem)]">
                        {devices.map((d, i) => (
                            <div key={i} className="dv-wrap" style={{ width: d.type === "phone" ? "clamp(140px,22vw,240px)" : d.type === "tablet" ? "clamp(200px,30vw,360px)" : "clamp(320px,50vw,620px)" }}>
                                <Device device={d} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
