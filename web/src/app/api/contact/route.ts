import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/html-escape";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    const limit = rateLimit({
        key: `contact:${getClientKey(request)}`,
        windowMs: 60_000,
        max: 3,
    });

    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please try again shortly." },
            {
                status: 429,
                headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) },
            },
        );
    }

    try {
        const body = await request.json();
        const { name, email, company, services, budget, timeline, brief, referral } = body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof brief !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !brief.trim()
        ) {
            return NextResponse.json(
                { error: "Name, email and project brief are required." },
                { status: 400 },
            );
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }

        if (name.length > 200 || email.length > 200 || brief.length > 5000) {
            return NextResponse.json({ error: "Input exceeds allowed length." }, { status: 400 });
        }

        const safeServices = Array.isArray(services)
            ? services.filter((s): s is string => typeof s === "string").slice(0, 20)
            : [];

        await prisma.message.create({
            data: {
                name,
                email,
                company: typeof company === "string" ? company : null,
                services: safeServices,
                budget: typeof budget === "string" ? budget : null,
                timeline: typeof timeline === "string" ? timeline : null,
                brief,
                referral: typeof referral === "string" ? referral : null,
            },
        });

        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const servicesText = safeServices.length ? safeServices.join(", ") : "Not specified";

            const htmlBody = `
<h2>New Project Inquiry</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px;">
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(company) || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Services</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(servicesText)}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Budget</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(budget) || "Not specified"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Timeline</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(timeline) || "Not specified"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Referral</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(referral) || "—"}</td></tr>
</table>
<h3 style="margin-top:24px;">Project Brief</h3>
<p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px;">${escapeHtml(brief)}</p>
`;

            await resend.emails.send({
                from: "Orion Studio <onboarding@resend.dev>",
                to: process.env.CONTACT_EMAIL!,
                replyTo: email,
                subject: `New Inquiry from ${name}${company ? ` — ${company}` : ""}`,
                html: htmlBody,
            });
        } catch (emailError) {
            console.error("Email send failed:", emailError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again." },
            { status: 500 },
        );
    }
}
