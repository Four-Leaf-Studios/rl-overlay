// rollup.config.js
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";

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

  // suppress the "use client" warning if you want
  onwarn(warning, handler) {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
    handler(warning);
  },

  plugins: [
    peerDepsExternal(),
    json(),

    // process CSS and inline any url() assets as base64
    postcss({
      extract: false,
      modules: false,
      minimize: true,
      sourceMap: true,
      plugins: [
        postcssUrl({
          url: "inline", // inline every asset as data-URI
          maxSize: Infinity, // no size limit
          fallback: "copy", // if inline fails, copy file to dist
        }),
      ],
    }),

    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};
