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

export type RuleModule = Rule.RuleModule;
