import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function sources(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sources(file) : /\.(js|mjs)$/.test(file) ? [file] : [];
  });
}

test("app modules stay within 500 lines and relative imports resolve", () => {
  for (const file of ["App.js", ...sources("src")]) {
    const source = fs.readFileSync(file, "utf8");
    assert.ok(source.split(/\r?\n/).length <= 500, `${file} exceeds 500 lines`);
    for (const match of source.matchAll(/(?:from\s*|import\s*\()\s*["'](\.[^"']+)["']/g)) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert.ok([target, `${target}.js`, `${target}.mjs`, path.join(target, "index.js")].some((candidate) => fs.existsSync(candidate)), `${file}: missing ${match[1]}`);
    }
  }
});
