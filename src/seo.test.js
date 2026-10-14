import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

describe("multilingual SEO", () => {
  it("publishes reciprocal Japanese and English alternates", () => {
    for (const html of [read("index.html"), read("en/index.html")]) {
      expect(html).toContain('hreflang="ja" href="https://sundata.tech/"');
      expect(html).toContain(
        'hreflang="en" href="https://sundata.tech/en/"',
      );
      expect(html).toContain('hreflang="x-default"');
    }
  });

  it("uses a unique canonical URL and description for each language", () => {
    const japanese = read("index.html");
    const english = read("en/index.html");

    expect(japanese).toContain('rel="canonical" href="https://sundata.tech/"');
    expect(english).toContain(
      'rel="canonical" href="https://sundata.tech/en/"',
    );
    expect(japanese.match(/name="description"/g)).toHaveLength(1);
    expect(english.match(/name="description"/g)).toHaveLength(1);
  });

  it("lists both localized home pages in the sitemap", () => {
    const sitemap = read("public/sitemap.xml");
    expect(sitemap).toContain("https://sundata.tech/");
    expect(sitemap).toContain("https://sundata.tech/en/");
    expect(sitemap).toContain("xmlns:xhtml=");
  });

  it("publishes substantial localized guide and about pages", () => {
    const sitemap = read("public/sitemap.xml");
    for (const path of [
      "public/guides/index.html",
      "public/en/guides/index.html",
      "public/guides/image-compression.html",
      "public/en/guides/image-compression.html",
      "public/guides/pdf-compression.html",
      "public/en/guides/pdf-compression.html",
      "public/guides/pdf-office-conversion.html",
      "public/en/guides/pdf-office-conversion.html",
      "public/about.html",
      "public/en/about.html",
    ]) {
      const html = read(path);
      expect(html.length).toBeGreaterThan(1_000);
      expect(html).toContain('rel="canonical"');
      const url = html.match(/rel="canonical" href="([^"]+)/)?.[1];
      expect(sitemap).toContain(url);
    }
  });

  it("does not load ads on legal and app-information pages", () => {
    for (const path of [
      "public/privacy.html",
      "public/swimscope-privacy.html",
      "public/privacy-policy.html",
      "public/terms.html",
      "public/apps.html",
      "public/guides/35x45-photo.html",
      "public/guides/japan-passport-photo.html",
      "public/guides/us-passport-photo.html",
    ]) {
      expect(read(path)).not.toContain("adsbygoogle.js");
    }
  });

  it("lists Koyomi with localized copy and privacy disclosure", () => {
    const apps = read("public/apps.html");
    const appCopy = read("public/app-pages-i18n.js");
    const privacy = read("public/privacy.html");

    expect(apps).toContain("id6806793898");
    expect(apps).toContain("assets/apps/koyomi.jpg");
    expect(apps).toContain("9アプリ");
    expect(appCopy).toContain('appCount: "9 款 App"');
    expect(appCopy).toContain('appCount: "9 apps"');
    expect(appCopy).toContain("koyomiDesc");
    expect(privacy).toContain("Koyomi｜気分と習慣の記録");
  });

  it("lists Tedori Biyori with localized copy and privacy disclosure", () => {
    const apps = read("public/apps.html");
    const appCopy = read("public/app-pages-i18n.js");
    const privacy = read("public/privacy.html");

    expect(apps).not.toContain("https://apps.apple.com/app/id6821520963");
    expect(apps).toContain('data-i18n="tedoriStatus">開発中');
    expect(apps).toContain("assets/apps/tedori-biyori.jpg");
    expect(appCopy).toContain("tedoriDesc");
    expect(appCopy).toContain('tedoriStatus: "开发中"');
    expect(privacy).toContain("てどり日和");
  });

  it("lists Kurashi Pass with localized copy and privacy disclosure", () => {
    const apps = read("public/apps.html");
    const appCopy = read("public/app-pages-i18n.js");
    const privacy = read("public/privacy.html");

    expect(apps).not.toContain("https://apps.apple.com/app/id6821526738");
    expect(apps).toContain('data-i18n="kurashiStatus">開発中');
    expect(apps).toContain("assets/apps/kurashi-pass.jpg");
    expect(apps).toContain("kurashipass-privacy.html");
    expect(appCopy).toContain("kurashiDesc");
    expect(appCopy).toContain('kurashiStatus: "开发中"');
    expect(privacy).toContain("くらしパス");
  });
});
