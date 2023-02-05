import { Node, Project } from "ts-morph";
import { partition } from "lodash";

import { trimQuotes } from "./strings";

const BACKTICK = "`";
const DOLLAR_SIGN = "$";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

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
            node.replaceWithText(`{styles.${text}}`);
          }
        } else {
          const [elementRules, global] = partition(rules, (rule) =>
            cssSelectors.includes(rule)
          );
          const globalRules = global.join(" ");
          const modulesRules = elementRules
            .map((rule) => `${DOLLAR_SIGN}{styles.${rule}}`)
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
          node.replaceWithText(`styles.${text}`);
        }
      }
    }
  });
  sourceFile.save();
};
