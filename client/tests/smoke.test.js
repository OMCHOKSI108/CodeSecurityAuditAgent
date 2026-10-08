const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

test("Client health route file exists", () => {
  const routePath = path.join(__dirname, "../src/app/health/route.ts");
  assert.strictEqual(fs.existsSync(routePath), true);
});

test("Client version route file exists", () => {
  const routePath = path.join(__dirname, "../src/app/version/route.ts");
  assert.strictEqual(fs.existsSync(routePath), true);
});
