module.exports = {
  env: {
    node: true,
    commonjs: true,
    mocha: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 13
  },
  rules: {
    semi: ['error', 'always']
    // rules: { 'no-console': 'off' } // warn/ error
    // 'no-unused-vars': 'off',
    // 'no-undef': ['error', 'always']
  }
};
