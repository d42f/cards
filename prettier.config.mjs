export default {
  arrowParens: 'avoid',
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: 'apps/web/**',
      options: {
        plugins: ['prettier-plugin-tailwindcss'],
        tailwindFunctions: ['cn', 'cva', 'clsx'],
      },
    },
  ],
};
