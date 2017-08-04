module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
  "extends": [
    "airbnb",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  rules: {
    semi: [2, "never"],
    "no-console": [0],
  }
}
