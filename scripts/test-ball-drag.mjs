import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sandbox = {};
createContext(sandbox);
runInContext(readFileSync(resolve(scriptDir, "../src/ball-drag.js"), "utf8"), sandbox);
const { placeBall, dragExceeded } = sandbox.YeyiBallDrag;

const view = { viewportWidth: 800, viewportHeight: 600, size: 44, pad: 8, menuHeight: 220 };

const parked = placeBall({ left: -100, top: -40 }, view);
assert.deepEqual(
  { left: parked.left, top: parked.top, side: parked.side, vside: parked.vside },
  { left: 8, top: 8, side: "left", vside: "below" }
);

const corner = placeBall({ left: 900, top: 900 }, view);
assert.equal(corner.left, 748);
assert.equal(corner.top, 548);
assert.equal(corner.side, "right");
assert.equal(corner.vside, "above");

const midLeft = placeBall({ left: 100, top: 400 }, view);
assert.equal(midLeft.side, "left");
assert.equal(midLeft.vside, "above");

const nearTop = placeBall({ left: 500, top: 40 }, view);
assert.equal(nearTop.side, "right");
assert.equal(nearTop.vside, "below");

const invalid = placeBall({ left: "nope", top: undefined }, view);
assert.equal(invalid.left, 8);
assert.equal(invalid.top, 8);

assert.equal(dragExceeded(0, 0, 3, 4, 5), true);
assert.equal(dragExceeded(10, 10, 13, 13, 5), false);
assert.equal(dragExceeded(0, 0, 4, 0, 5), false);

console.log("ball-drag ok");
