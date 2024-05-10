import globals from "globals";

module.exports = {
    // ...
    plugins: ['@stylistic/js'],
    extends: 'eslint:recommended',
    rules: {
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/linebreak-style': ['error', 'unix'],
        '@stylistic/js/quotes': ['error', 'single'],
        '@stylistic/js/semi': ['error', 'never'],
        eqeqeq: 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', {before: true, after: true}],
        'no-console': 0,
    },
};



export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
];
