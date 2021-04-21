"use strict";

const { findNodeModuleDir } = require("..");
const Tap = require("tap");

function testWithTap(skipSimple, test) {
  const x = findNodeModuleDir("tap", { skipSimple });
  test.ok(x);
  const pkg = require(`${x}/package.json`);
  test.equal(pkg.name, "tap");
}

Tap.test("skip simple false", test => {
  testWithTap(false, test);
  test.end();
});

Tap.test("skip simple true", test => {
  testWithTap(true, test);
  test.end();
});

Tap.test("simple throws module not found error", test => {
  try {
    findNodeModuleDir("blah");
  } catch (err) {
    test.equal(err.code, "MODULE_NOT_FOUND");
  }
  test.end();
});

Tap.test("search stops at node_modules", test => {
  const x = findNodeModuleDir("blah", {
    resolve: () => `${process.cwd()}/node_modules/blah/foo/index.js`,
    skipSimple: true
  });
  test.equal(x, null);
  test.end();
});

Tap.test("simple not throw not found", test => {
  const x = findNodeModuleDir("blah", {
    resolve: () => require.resolve("blah"),
    skipSimple: true,
    throwNotFound: false
  });
  test.equal(x, null);
  test.end();
});

Tap.test("simple throw errors other than not found", test => {
  let error;
  try {
    findNodeModuleDir("blah", {
      resolve: () => {
        throw new Error("test");
      }
    });
  } catch (err) {
    error = err;
  }
  test.ok(error);
  test.end();
});

Tap.test("search throw not found error", test => {
  let error;
  try {
    findNodeModuleDir("blah", {
      resolve: () => {
        require.resolve("blah");
      },
      skipSimple: true
    });
  } catch (err) {
    error = err;
  }
  test.ok(error);
  test.end();
});

Tap.test("simple not throw not found error", test => {
  const x2 = findNodeModuleDir("blah", { throwNotFound: false });
  Tap.equal(x2, null);
  test.end();
});

Tap.test("search stops after 10 levels", test => {
  const x2 = findNodeModuleDir("blah", {
    skipSimple: true,
    resolve: () => "/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x"
  });
  test.equal(x2, null);
  test.end();
});
