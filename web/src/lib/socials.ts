export type SocialIconName = "instagram" | "linkedin";

export type SocialLink = {
    label: string;
    href: string;
    icon: SocialIconName;
};

export const PRIMARY_SOCIALS: SocialLink[] = [
    { label: "Instagram", href: "https://www.instagram.com/orionstud.io/", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/104592237", icon: "linkedin" },
];

export const FOOTER_SOCIALS: SocialLink[] = PRIMARY_SOCIALS;

export const CONTACT_EMAIL = "koraykunal85@outlook.com";

const WHATSAPP_RAW = process.env.NEXT_PUBLIC_WHATSAPP ?? "";

export const WHATSAPP_NUMBER = WHATSAPP_RAW.replace(/[^\d]/g, "");

export const WHATSAPP_HREF = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "";

export const PHONE_HREF = WHATSAPP_NUMBER ? `tel:+${WHATSAPP_NUMBER}` : "";

export const WHATSAPP_DISPLAY = WHATSAPP_NUMBER
    ? `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5")}`
    : "";
