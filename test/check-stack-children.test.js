const rules = require('../lib/check-stack-children').rules;
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

const selfClosedStackCode = `
const Element = () => (
  <Stack space="medium" />
)
`.trim();

const emptyStackCode = `
const Element = () => (
  <Stack space="medium"></Stack>
)
`.trim();

const singleChildStackCode = `
const Element = () => (
  <Stack space="medium">
    <Text>This is some text</Text>
  </Stack>
)
`.trim();

const multiChildStackCode = `
const Element = () => (
  <Stack space="medium">
    <Text>This is some text</Text>
    <Text>This is some more text</Text>
  </Stack>
)
`.trim();

const arrayChildStackCode = `
const Element = () => (
  <Stack space="medium">
    {myList.map(item => <Text>{item}</Text>)}
  </Stack>
)
`.trim();

ruleTester.run('redundant-stack', rules['no-redundant-stack'], {
  valid: [multiChildStackCode, arrayChildStackCode],
  invalid: [
    {
      code: emptyStackCode,
      errors: [{ messageId: 'empty' }],
    },
    {
      code: selfClosedStackCode,
      errors: [{ messageId: 'empty' }],
    },
    {
      code: singleChildStackCode,
      errors: [{ messageId: 'oneChild' }],
    },
  ],
});
