import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceFiles = (folder) =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(join(folder, entry.name))
      : entry.name.endsWith(".js")
        ? [join(folder, entry.name)]
        : [],
  );
const walk = (node, visit) => {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  visit(node);
  Object.values(node).forEach((child) => {
    if (child && typeof child === "object") walk(child, visit);
  });
};

test("shared screens use StyleSheet APIs available on installed React Native", () => {
  // Web exposes some legacy helpers that Android no longer provides.
  const native = parse(
    readFileSync(
      join(
        root,
        "node_modules/react-native/Libraries/StyleSheet/StyleSheetExports.js",
      ),
      "utf8",
    ),
    { sourceType: "module", plugins: ["flow"] },
  );
  const exported = native.program.body.find(
    (node) => node.type === "ExportDefaultDeclaration",
  ).declaration;
  const supported = new Set(
    exported.properties.map((property) => property.key.name),
  );
  for (const file of [
    join(root, "App.js"),
    ...sourceFiles(join(root, "src")),
  ]) {
    const ast = parse(readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["jsx"],
    });
    walk(ast, (node) => {
      if (
        node.type === "MemberExpression" &&
        node.object.name === "StyleSheet" &&
        !node.computed
      ) {
        assert(
          supported.has(node.property.name),
          `${file}: StyleSheet.${node.property.name} is unavailable on native`,
        );
      }
    });
  }
});
