System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "2d-polygon-boolean": "npm:2d-polygon-boolean@1.0.1",
    "babel": "npm:babel-core@5.8.35",
    "babel-runtime": "npm:babel-runtime@5.8.35",
    "core-js": "npm:core-js@1.2.6",
    "d3": "npm:d3@3.5.16",
    "lodash": "npm:lodash@4.5.1",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:2d-polygon-boolean@1.0.1": {
      "2d-polygon-area": "npm:2d-polygon-area@1.0.0",
      "point-in-big-polygon": "npm:point-in-big-polygon@1.0.0",
      "segseg": "npm:segseg@0.2.1",
      "signum": "npm:signum@1.0.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.35": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@4.5.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:point-in-big-polygon@1.0.0": {
      "robust-orientation": "npm:robust-orientation@1.1.3",
      "slab-decomposition": "npm:slab-decomposition@1.0.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:robust-orientation@1.1.3": {
      "robust-scale": "npm:robust-scale@1.0.2",
      "robust-subtract": "npm:robust-subtract@1.0.0",
      "robust-sum": "npm:robust-sum@1.0.0",
      "two-product": "npm:two-product@1.0.2"
    },
    "npm:robust-scale@1.0.2": {
      "two-product": "npm:two-product@1.0.2",
      "two-sum": "npm:two-sum@1.0.0"
    },
    "npm:slab-decomposition@1.0.2": {
      "binary-search-bounds": "npm:binary-search-bounds@1.0.0",
      "functional-red-black-tree": "npm:functional-red-black-tree@1.0.1",
      "robust-orientation": "npm:robust-orientation@1.1.3"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
