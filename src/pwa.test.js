import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const manifest = JSON.parse(
  readFileSync(
    new URL("../public/manifest.webmanifest", import.meta.url),
    "utf8",
  ),
);
describe("PWA manifest", () => {
  it("uses the current brand and has an install icon", () => {
    expect(manifest.name).toBe("SunData Tools");
    expect(manifest.icons.some((icon) => icon.src && icon.sizes)).toBe(true);
  });
  it("has an app identity and navigation scope", () => {
    expect(manifest.id).toBe("/");
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.scope).toBeTruthy();
  });
});
