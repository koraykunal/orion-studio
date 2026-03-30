import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcryptjs.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@orion-studio.net" },
    update: {},
    create: {
      email: "admin@orion-studio.net",
      name: "Admin",
      password: hashedPassword,
    },
  });

  console.log("Seeded admin user:", admin.email);

  const blogContentHtml = `<h2>Why Build From Scratch?</h2>
<p>Most agency sites use templates or page builders. We built ours from the ground up because this site <em>is</em> our portfolio — it should demonstrate exactly what we can do for clients.</p>
<h2>The Stack</h2>
<p>We chose a modern stack that prioritizes performance and developer experience:</p>
<ul>
<li><strong>Next.js 16</strong> with App Router for server components and static generation</li>
<li><strong>React 19</strong> for the latest concurrent features</li>
<li><strong>Tailwind CSS 4</strong> with OKLCh color space for perceptually uniform colors</li>
<li><strong>GSAP 3.14</strong> for scroll-driven animations and complex timelines</li>
</ul>
<h2>Design System</h2>
<p>Every color, spacing value, and typography scale is defined as CSS custom properties using OKLCh — a color space that produces perceptually uniform lightness steps. This means our grays look consistently gray, and our accent colors maintain their vibrancy across different lightness levels.</p>
<h2>Animation Architecture</h2>
<p>We built a custom animation system on top of GSAP:</p>
<ul>
<li><strong>ScrollTrigger</strong> drives all scroll-based animations</li>
<li><strong>DrawSVG</strong> handles line reveal effects</li>
<li><strong>SplitText</strong> powers character-by-character text animations</li>
<li><strong>Custom easing curves</strong> (branded "orion.inOut" and "orion.out") give everything a consistent feel</li>
</ul>
<p>The constellation effect in the hero is a canvas-based particle system with parallax layers, twinkling stars, and diffraction spikes.</p>
<h2>View Transitions</h2>
<p>Page transitions use the CSS View Transitions API with a custom star-shaped mask — a subtle nod to our Orion branding that most visitors won't consciously notice but contributes to the polished feel.</p>
<h2>Performance</h2>
<p>Despite the heavy animation work, the site scores well on Core Web Vitals thanks to:</p>
<ul>
<li>Lazy-loaded images with Next.js Image optimization</li>
<li>Code splitting per route</li>
<li>Animations only triggering when elements enter viewport</li>
<li>Lenis for 60fps smooth scrolling without layout thrash</li>
</ul>
<h2>What We Learned</h2>
<p>Building your own site is the hardest project because you're both the client and the agency. We went through more iterations than any client project — but the result is a site that genuinely represents what we deliver.</p>`;

  const blogPost = await prisma.post.upsert({
    where: { slug: "building-orion-studio" },
    update: {
      title: "Building Orion Studio: Behind the Scenes",
      description:
        "How we designed and built our own agency site — from design system to scroll-driven animations.",
      contentHtml: blogContentHtml,
      tags: ["Engineering", "Design", "Case Study"],
      status: "published",
      publishedAt: new Date("2025-03-29"),
    },
    create: {
      title: "Building Orion Studio: Behind the Scenes",
      slug: "building-orion-studio",
      description:
        "How we designed and built our own agency site — from design system to scroll-driven animations.",
      contentHtml: blogContentHtml,
      tags: ["Engineering", "Design", "Case Study"],
      status: "published",
      publishedAt: new Date("2025-03-29"),
      authorId: admin.id,
    },
  });

  console.log("Seeded blog post:", blogPost.slug);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
