import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("shots", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/tr", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const y = await page.evaluate(() => {
    const el = document.querySelector("#contact");
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY;
});
if (y == null) { console.log("no #contact"); await browser.close(); process.exit(1); }

await page.evaluate((yy) => window.scrollTo(0, yy - 480), y);
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/contact-top.png" });
console.log("contact section top:", y);
await browser.close();
console.log("done");
