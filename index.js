"use strict";

const Path = require("path");
const Fs = require("fs");

/**
 * Find the top dir of a package in `node_modules` by looking for the first dir
 * that contains `package.json` file.  The search stops when it reaches the dir
 * `node_modules`.
 *
 * Normally this is just `Path.dirname(require.resolve(name + "/package.json"))`, but
 * new node.js and `package.json` ES module export blocks requiring `package.json`.
 *
 * @param {string} name - name of the package to search for
 * @param {Function} options.resolve - callback to resolve the package's initial dir (default `require.resolve`)
 * @param {boolean} options.throwNotFound - rethrow `MODULE_NOT_FOUND` error
 * @param {boolean} options.skipSimple - skip the simple method and do search only
 * @returns `null` or top dir of a package in `node_modules`
 */
function findNodeModuleDir(
  name,
  { resolve = require.resolve, throwNotFound = true, skipSimple = false } = {}
) {
  if (!skipSimple) {
    try {
      // try simple way
      return Path.dirname(resolve(`${name}/package.json`));
    } catch (err) {
      if (err.code === "MODULE_NOT_FOUND") {
        if (throwNotFound) {
          throw err;
        } else {
          return null;
        }
      }
    }
  }

  let prevDir = Path.dirname(resolve(name));
  let dir = prevDir;
  let n = 0;

  // search 10 levels max
  while (n++ < 10) {
    if (Fs.existsSync(Path.join(dir, "package.json"))) {
      return dir;
    }
    dir = Path.join(dir, "..");
    if (
      dir === prevDir ||
      prevDir.substring(dir.length + 1) === "node_modules"
    ) {
      return null;
    }
    prevDir = dir;
  }

  return null;
}

exports.findNodeModuleDir = findNodeModuleDir;
