import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, company, services, budget, timeline, brief, referral } = body;

        if (!name || !email || !brief) {
            return NextResponse.json(
                { error: "Name, email and project brief are required." },
                { status: 400 },
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-mail.outlook.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const servicesText = services?.length ? services.join(", ") : "Not specified";

        const htmlBody = `
<h2>New Project Inquiry</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px;">
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${company || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Services</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${servicesText}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Budget</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${budget || "Not specified"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Timeline</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${timeline || "Not specified"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Referral</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${referral || "—"}</td></tr>
</table>
<h3 style="margin-top:24px;">Project Brief</h3>
<p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px;">${brief}</p>
`;

        await transporter.sendMail({
            from: `"Orion Studio" <${process.env.SMTP_USER}>`,
            to: "koraykunal85@outlook.com",
            replyTo: email,
            subject: `New Inquiry from ${name}${company ? ` — ${company}` : ""}`,
            html: htmlBody,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again." },
            { status: 500 },
        );
    }
}
