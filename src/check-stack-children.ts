import { RuleModule } from './eslint-types';

export const rules: Record<'no-redundant-stack', RuleModule> = {
  'no-redundant-stack': {
    meta: {
      docs: {
        description:
          'A <Stack> element should contain more than one child element.',
      },
      schema: [],
      messages: {
        oneChild: 'Stack contains only a single <{{ childName }}> element.',
        empty: 'Stack is empty.',
      },
    },
    create: (context) => {
      return {
        JSXElement: (node) => {
          const elementName = node.openingElement.name.name;
          if (elementName !== 'Stack') {
            return;
          }

          // A self closing Stack won't have any children, and is doing nothing
          if (node.openingElement.selfClosing) {
            return context.report({ node, messageId: 'empty' });
          }

          // Filter out the JSXText nodes
          const childElements = node.children.filter(
            (child) =>
              child.type === 'JSXElement' ||
              child.type === 'JSXExpressionContainer',
          );

          // If there's more than one child, the Stack is doing something
          if (childElements.length > 1) {
            return;
          }

          // A non-self-closed but still empty Stack is redundant
          if (childElements.length === 0) {
            return context.report({ node, messageId: 'empty' });
          }

          const [child] = childElements;

          // A single child that's an expression container might be a .map or something
          if (child.type !== 'JSXExpressionContainer') {
            const childName = child.openingElement.name.name;
            return context.report({
              node,
              messageId: 'oneChild',
              data: { childName },
            });
          }
        },
      };
    },
  },
};
