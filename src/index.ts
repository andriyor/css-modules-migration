import fs from "fs";

import { getDirectoriesFiles, getDirectoriesRecursive } from "./files";
import { addDotModule } from "./strings";
import { getCssSelectors, removeUnusedCssSelector } from "./css";
import { handleComponent, getAllJSXAttrString } from "./component";

const argv = require("yargs-parser")(process.argv.slice(2));

const regexStr = "^(?!.*\\.(spec|test|module)\\.(scss|tsx)$).*\\.(scss|tsx)$";

let dirsMeta = [];

const destPath = argv.dir ? argv.dir : "src";

if (argv.r) {
  dirsMeta = getDirectoriesRecursive(destPath, regexStr);
} else {
  dirsMeta = [getDirectoriesFiles(destPath, regexStr)];
}

for (const dirMeta of dirsMeta) {
  for (const reKey in dirMeta.pairs) {
    if (
      dirMeta.pairs[reKey].hasOwnProperty("scss") &&
      dirMeta.pairs[reKey].hasOwnProperty("tsx")
    ) {
      const allJSXAttrString = getAllJSXAttrString(dirMeta.pairs[reKey].tsx);
      console.log(allJSXAttrString);
      removeUnusedCssSelector(dirMeta.pairs[reKey].scss, allJSXAttrString)
      // const cssFilePath = dirMeta.pairs[reKey].scss;
      // const cssSelectors = getCssSelectors(cssFilePath);
      // handleComponent(dirMeta.pairs[reKey].tsx, cssSelectors, reKey);
      // fs.renameSync(cssFilePath, addDotModule(cssFilePath));
    }
  }
}
