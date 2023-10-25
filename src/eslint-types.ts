import { Rule } from "eslint";
import { BaseNode } from "estree";

/**
 * This is all required because the JSXElement is included in eslint by default
 * (via acorn-jsx) but is not in the typescript definitions.
 */

type JSXElementChildNode = JSXElementNode | JSXExpressionContainerNode;

interface Literal {
  type: "Literal";
  value: string;
}

interface JSXAttribute {
  type: "JSXAttribute";
  name: JSXIdentifierNode;
  value: JSXElementChildNode | Literal | null;
}

interface JSXExpressionContainerNode {
  type: "JSXExpressionContainer";
  expression: JSXElementNode;
}

interface JSXOpeningElementNode {
  type: "JSXOpeningElement";
  attributes: JSXAttribute[];
  name: JSXIdentifierNode;
  selfClosing: boolean;
}

interface JSXClosingElementNode {
  type: "JSXClosingElement";
  name: JSXIdentifierNode;
}

interface JSXIdentifierNode {
  type: "JSXIdentifier";
  name: string;
}

interface JSXElementNode extends BaseNode {
  type: "JSXElement";
  openingElement: JSXOpeningElementNode;
  closingElement: JSXClosingElementNode | null;
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
