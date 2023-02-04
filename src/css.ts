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
      classes.push(node.prelude?.value.replace(".", "").replace('#', ''));
    }
  });
  return classes;
};
