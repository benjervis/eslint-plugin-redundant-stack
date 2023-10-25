import { Rule } from "eslint";
import { BaseNode } from "estree";

/**
 * This is all required because the JSXElement is included in eslint by default
 * (via acorn-jsx) but is not in the typescript definitions.
 */

type JSXElementChildNode = JSXElementNode | JSXExpressionContainerNode;

interface JSXExpressionContainerNode {
  type: "JSXExpressionContainer";
  expression: JSXElementNode;
}

interface JSXOpeningElementNode {
  type: "JSXOpeningElement";
  name: JSXIdentifierNode;
  selfClosing: boolean;
}

interface JSXIdentifierNode {
  type: "JSXIdentifier";
  name: string;
}
interface JSXElementNode extends BaseNode {
  id: string;
  type: "JSXElement";
  openingElement: JSXOpeningElementNode;
  children: JSXElementChildNode[];
}

declare module "eslint" {
  namespace Rule {
    interface NodeListener {
      JSXElement(node: JSXElementNode): void;
    }

    interface RuleModule {
      create(context: RuleContext): NodeListener;
    }
  }
}

declare module "estree" {
  interface NodeMap {
    JSXElement: JSXElementNode;
  }
}

export const rules: Record<"no-redundant-stack", Rule.RuleModule> = {
  "no-redundant-stack": {
    meta: {
      docs: {
        description:
          "A <Stack> element should contain more than one child element.",
      },
      schema: [],
      messages: {
        oneChild: "Stack contains only a single <{{ childName }}> element.",
        empty: "Stack is empty.",
      },
    },
    create: (context) => {
      const listener = {
        JSXElement: (node: JSXElementNode) => {
          const elementName = node.openingElement.name.name;
          if (elementName !== "Stack") {
            return;
          }

          if (node.openingElement.selfClosing) {
            return context.report({ node, messageId: "empty" });
          }

          const childElements = node.children.filter(
            (child) =>
              child.type === "JSXElement" ||
              child.type === "JSXExpressionContainer"
          );

          if (childElements.length > 1) {
            return;
          }

          if (childElements.length === 0) {
            return context.report({ node, messageId: "empty" });
          }

          const [child] = childElements;

          if (child.type !== "JSXExpressionContainer") {
            const childName = child.openingElement.name.name;
            return context.report({
              node,
              messageId: "oneChild",
              data: { childName },
            });
          }
        },
      } satisfies Rule.NodeListener;
      return listener;
    },
  },
};
