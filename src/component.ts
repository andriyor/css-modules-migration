import { Node, Project } from "ts-morph";
import { partition } from "lodash";

import { trimQuotes } from "./strings";

const BACKTICK = "`";
const DOLLAR_SIGN = "$";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const stylesAccess = (rule: string) => {
  if (rule.includes("-")) {
    return `styles["${rule}"]`;
  }
  return `styles.${rule}`;
};

export const handleComponent = (
  filePath: string,
  cssSelectors: string[],
  reKey: string
) => {
  const sourceFile = project.addSourceFileAtPath(filePath);
  sourceFile.forEachDescendant((node) => {
    if (Node.isStringLiteral(node)) {
      const parent = node.getParent();
      const text = trimQuotes(node.getText());

      if (Node.isImportDeclaration(parent)) {
        if (text.includes(`${reKey}.scss`)) {
          node.replaceWithText(`styles from './${reKey}.module.scss'`);
        }
      }

      if (Node.isJsxAttribute(parent)) {
        const rules = text.split(" ");

        if (rules.length === 1) {
          const isCSSRule = cssSelectors.includes(text);
          if (isCSSRule) {
            node.replaceWithText(`{${stylesAccess(text)}}`);
          }
        } else {
          const [elementRules, global] = partition(rules, (rule) =>
            cssSelectors.includes(rule)
          );
          const globalRules = global.join(" ");
          const modulesRules = elementRules
            .map((rule) => `${DOLLAR_SIGN}{${stylesAccess(rule)}}`)
            .join(" ");
          const rulSet = `{${BACKTICK}${globalRules}${
            globalRules ? " " : ""
          }${modulesRules}${BACKTICK}}`;
          node.replaceWithText(rulSet);
        }
      }

      if (Node.isArrayLiteralExpression(parent)) {
        const isCSSRule = cssSelectors.includes(text);
        if (isCSSRule) {
          node.replaceWithText(stylesAccess(text));
        }
      }
    }
  });
  sourceFile.save().then();
};

export const getAllJSXAttrString = (filePath: string) => {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const allJSXAttrString: string[] = [];
  sourceFile.forEachDescendant((node) => {
    if (Node.isStringLiteral(node)) {
      const parent = node.getParent();
      const text = trimQuotes(node.getText());

      if (Node.isJsxAttribute(parent)) {
        parent.forEachChild(node => {
          if(Node.isIdentifier(node)) {
            console.log(node.getText());
          }
        })
        const rules = text.split(" ");

        if (rules.length === 1) {
          allJSXAttrString.push(text);
        } else {
          allJSXAttrString.push(...rules);
        }
      }

      if (Node.isArrayLiteralExpression(parent)) {
        allJSXAttrString.push(text);
      }
    }
  });
  return allJSXAttrString;
};
