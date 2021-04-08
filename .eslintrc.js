module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "standard"
  ],
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-floating-promises": ["error"],
    "no-unused-vars": 0,
    "linebreak-style": [
      2,
      "unix"
    ],
    "no-unused-expressions": 0,
    "no-useless-constructor": 0
  }
}