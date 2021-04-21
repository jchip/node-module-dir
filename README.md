# node-module-dir

Find the top dir of a package in `node_modules` by looking for the first dir
that contains `package.json` file. The search stops when it reaches the dir
`node_modules`.

Normally this is just `Path.dirname(require.resolve(name + "/package.json"))`, but
new node.js and `package.json` ES module export blocks requiring `package.json`.

```js
const { findNodeModuleDir } = require("node-module-dir");

const dir = findNodeModuleDir("package-name");
```

# License

Licensed under the [Apache License, Version 2.0]

[apache license, version 2.0]: https://www.apache.org/licenses/LICENSE-2.0
