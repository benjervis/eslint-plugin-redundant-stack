export const rules = {
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

          if (node.openingElement.selfClosing) {
            return context.report({ node, messageId: 'empty' });
          }

          const childElements = node.children.filter(
            (child) =>
              child.type === 'JSXElement' ||
              child.type === 'JSXExpressionContainer',
          );

          if (childElements.length > 1) {
            return;
          }

          if (childElements.length === 0) {
            return context.report({ node, messageId: 'empty' });
          }

          const [child] = childElements;

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
