const { terser } = require("rollup-plugin-terser");

export default {
  input: "GameEngine.js",
  output: {
    file: "./dist/game-engine.min.js",
    format: "umd",
    name: "GameEngine",
  },
  plugins: [terser()],
};
