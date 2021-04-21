"use strict";

const { findNodeModuleDir } = require("..");
const assert = require("assert");

function testFyn(skipSimple = false) {
  const x = findNodeModuleDir("fyn");
  assert(x);
  const pkg = require(`${x}/package.json`);
  assert(pkg.name === "fyn");
}

testFyn();
testFyn(true);

try {
  findNodeModuleDir("blah");
} catch (err) {
  assert(err.code === "MODULE_NOT_FOUND");
}

const x2 = findNodeModuleDir("blah", { throwNotFound: false });
assert(x2 === null);

console.log("test OK");
