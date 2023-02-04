import { Node, Project } from "ts-morph";

import { trimQuotes } from "./strings";

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
      const text = trimQuotes(node.getText());
      const isCSSRule = cssSelectors.includes(text);
      if (isCSSRule) {
        node.replaceWithText(`{styles.${text}}`);
      }
      if (text.includes(`${reKey}.scss`)) {
        node.replaceWithText(`styles from './${reKey}.module.scss'`);
      }
    }
  });
  sourceFile.save();
};