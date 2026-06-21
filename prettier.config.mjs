/** @type {import('prettier').Config} */

export default {
    trailingComma: 'none',
    useTabs: true,
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    arrowParens: 'avoid',
    importOrderSeparator: true,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: true,
    importOrderParserPlugins: [
        'classProperties', 
        'decorators-legacy',
        'typescript'],
    printWidth: 80,
    tabWidth: 4,
    plugins: ["@trivago/prettier-plugin-sort-imports"]
};