import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],

  // filter out the module‐level directive warning
  onwarn(warning, defaultHandler) {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
    defaultHandler(warning);
  },

  plugins: [
    peerDepsExternal(),
    json(),
    postcss({
      extract: false,
      modules: false,
      minimize: true,
      sourceMap: true,
    }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};
