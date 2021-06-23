# eslint-plugin-redundant-stack

Designed to work with projects using [braid-design-system](https://github.com/seek-oss/braid-design-system), this plugin detects when a [Stack](https://seek-oss.github.io/braid-design-system/components/Stack) element is redundant.

Braid Stacks are used to manage the vertical spacing between elements. If you have one a single element inside a Stack (or none), there's nothing for it to be spaced from, and so you don't need to include a Stack.

Usually this comes about because you did need a Stack originally, but refactored away the other child elements, not realising there was only one left.

## Usage

```bash
yarn add -D @bjervis/eslint-plugin-redundant-stack
```

Then in your eslint config

```
plugins: ['@bjervis/redundant-stack'],
rules: {
  '@bjervis/redundant-stack/no-redundant-stack': 2,
},
```

If you're using Braid, you're probably also using [sku](https://github.com/seek-oss/sku), so:

```js
// sku.config.js
module.exports = {
  ...,
  dangerouslySetESLintConfig: (skuConfig) => ({
    ...skuConfig,
    plugins: ['@bjervis/redundant-stack'],
    rules: {
      '@bjervis/redundant-stack/no-redundant-stack': 2,
    },
  }),
}
```
