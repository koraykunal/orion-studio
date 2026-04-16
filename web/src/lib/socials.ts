export type SocialLink = {
    label: string;
    href: string;
};

export const PRIMARY_SOCIALS: SocialLink[] = [
    { label: "Instagram", href: "https://www.instagram.com/orionstud.io/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/104592237" },
];

export const FOOTER_SOCIALS: SocialLink[] = [
    ...PRIMARY_SOCIALS,
    { label: "X", href: "https://x.com/orionstudio" },
    { label: "Dribbble", href: "https://dribbble.com/orionstudio" },
];

export const CONTACT_EMAIL = "koraykunal85@outlook.com";
