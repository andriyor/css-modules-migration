import fs from "fs";

import sass from "sass";
import cssTree from "css-tree";

export const getCssSelectors = (fileName: string) => {
  const result = sass.compile(fileName);
  const ast = cssTree.parse(result.css.toString(), {
    parseAtrulePrelude: false,
    parseRulePrelude: false,
    parseValue: false,
  });
  const classes: string[] = [];
  cssTree.walk(ast, function (node) {
    if (node.type === "Rule") {
      // @ts-ignore
      classes.push(node.prelude?.value.replace(".", "").replace("#", ""));
    }
  });
  return classes;
};

export const removeUnusedCssSelector = (
  fileName: string,
  usedSelectorInComponent: string[]
) => {
  const cssFile = fs.readFileSync(fileName, "utf-8");
  const ast = cssTree.parse(cssFile, {
    parseAtrulePrelude: false,
    parseRulePrelude: false,
    parseValue: false,
  });
  const unusedNodes: cssTree.Rule[] = [];
  cssTree.walk(ast, function (node, item, list) {
    if (node.type === "Rule") {
      // @ts-ignore
      // @ts-ignore
      const selector = node.prelude?.value.replace(".", "").replace("#", "");
      if (!usedSelectorInComponent.includes(selector)) {
        unusedNodes.push(node);
        // console.log(cssTree.generate(node));
        // @ts-ignore
        console.log(node.prelude?.value);
        list.remove(item);
      }
    }
  });
  console.log(cssTree.generate(ast));
  const css = cssTree.generate(ast);
  const unusedCssWithComment = [`// from ${fileName}`];
  const unusedCss = unusedNodes.map((node) => cssTree.generate(node));
  unusedCssWithComment.push(...unusedCss);
  const unusedCssInFile = unusedCssWithComment.join(`\n\n`);

  console.log("unusedCss");
  console.log(unusedCss);
  fs.writeFileSync(fileName, css);
  fs.appendFileSync("kek.scss", unusedCssInFile);
};
