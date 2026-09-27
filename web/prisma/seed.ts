import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("DATABASE_URL is not set. Prisma 7 reads the connection string from prisma.config.ts, but the seed script constructs its own pool.");
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Admin credentials are read from the environment. There is deliberately no
 * default and no fallback: a hardcoded seed password would give anyone with
 * repository read access full CMS access.
 */
function requireAdminEnv(name: "ADMIN_EMAIL" | "ADMIN_PASSWORD") {
    const value = process.env[name]?.trim();
    if (!value) {
        console.error(`${name} is not set.`);
        console.error("Create the first admin with:");
        console.error('  ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="<strong-password>" npx tsx prisma/seed.ts');
        process.exit(1);
    }
    return value;
}

async function main() {
    const adminEmail = requireAdminEnv("ADMIN_EMAIL").toLowerCase();
    const adminPassword = requireAdminEnv("ADMIN_PASSWORD");

    if (adminPassword.length < 12) {
        console.error("ADMIN_PASSWORD must be at least 12 characters.");
        process.exit(1);
    }

    const hashedPassword = await bcryptjs.hash(adminPassword, 12);

    // update: {} keeps the seed idempotent without ever rotating a password
    // that an operator changed by hand after the first run.
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: process.env.ADMIN_NAME?.trim() || undefined,
            password: hashedPassword,
        },
    });

    console.log(`Seeded admin user: ${admin.email}`);

    const blogContentHtml = `<h2>Why Build From Scratch?</h2>
<p>Most agency sites use templates or page builders. We built ours from the ground up because this site <em>is</em> our portfolio, so it should demonstrate exactly what we can do for clients.</p>
<h2>The Stack</h2>
<p>We chose a modern stack that prioritises performance and developer experience:</p>
<ul>
<li><strong>Next.js 16</strong> with the App Router, so content renders on the server and only the interactive pieces ship as JavaScript</li>
<li><strong>React 19</strong> for the latest concurrent features</li>
<li><strong>Tailwind CSS 4</strong> with OKLCh colour space, for perceptually uniform colours</li>
<li><strong>GSAP 3.14</strong> for scroll-driven animation and complex timelines</li>
</ul>
<h2>Design System</h2>
<p>Every colour, spacing value and typography step is defined as a CSS custom property in OKLCh, a colour space that produces perceptually uniform lightness steps. Our greys read as consistently grey, and our accent colours hold their vibrancy across lightness levels.</p>
<h2>Animation Architecture</h2>
<p>We built a custom animation layer on top of GSAP:</p>
<ul>
<li><strong>ScrollTrigger</strong> drives every scroll-based animation</li>
<li><strong>DrawSVG</strong> handles line reveal effects</li>
<li><strong>SplitText</strong> powers character-by-character text animation</li>
<li><strong>Custom easing curves</strong> (branded "orion.inOut" and "orion.out") give everything a consistent feel</li>
</ul>
<p>The constellation in the hero is a canvas particle system with parallax layers, twinkling stars and diffraction spikes. It pauses when the tab is hidden and when it leaves the viewport.</p>
<h2>View Transitions</h2>
<p>Page transitions use the CSS View Transitions API with a custom star-shaped mask, a subtle nod to our Orion branding that most visitors will not consciously notice but that contributes to the polished feel.</p>
<h2>Performance</h2>
<p>Despite the heavy animation work, the site holds up on Core Web Vitals thanks to:</p>
<ul>
<li>Lazy-loaded images with Next.js image optimisation</li>
<li>Server components for every content route, so only interactive islands hydrate</li>
<li>Animation that only starts when an element enters the viewport</li>
<li>Lenis for smooth scrolling without layout thrash</li>
</ul>
<h2>What We Learned</h2>
<p>Building your own site is the hardest project, because you are both the client and the agency. We went through more iterations than on any client project, but the result is a site that genuinely represents what we deliver.</p>`;

    const title = "Building Orion Studio: Behind the Scenes";
    const description = "How we designed and built our own agency site, from design system to scroll-driven animation.";
    const tags = ["Engineering", "Design", "Case Study"];
    const publishedAt = new Date("2025-03-29");

    // update: {} on purpose. Re-seeding must never silently revert edits an
    // editor made in the CMS. Delete the row explicitly if you want it reset.
    const blogPost = await prisma.post.upsert({
        where: { slug: "building-orion-studio" },
        update: {},
        create: {
            title_en: title,
            slug: "building-orion-studio",
            description,
            contentHtml_en: blogContentHtml,
            tags,
            status: "published",
            publishedAt,
            authorId: admin.id,
        },
    });

    console.log(`Seeded blog post: ${blogPost.slug}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
