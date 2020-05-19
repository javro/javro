module.exports = {
  extends: 'erb/typescript',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off'
  },
   overrides: [
     {
       files: ['*.ts', '*.tsx', '*.js'],
       excludedFiles: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
       extends: 'erb/typescript',
       rules: {
         // A temporary hack related to IDE not resolving correct package.json
         'import/no-extraneous-dependencies': 'off'
       }
     },
     {
       files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
       extends: 'plugin:testcafe/recommended',
       env: {
         'jest/globals': true
       },
       plugins: ['jest', 'testcafe'],
       rules: {
         'jest/no-disabled-tests': 'warn',
         'jest/no-focused-tests': 'error',
         'jest/no-identical-title': 'error',
         'no-console': 'off'
       }
     }
   ],
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    }
  }
};
