import fs from "fs";

import { getDirectoriesFiles, getDirectoriesRecursive } from "./files";
import { addDotModule } from "./strings";
import { getCssSelectors } from "./css";
import { handleComponent } from "./component";

const argv = require("yargs-parser")(process.argv.slice(2));

const regexStr = "^(?!.*\\.(spec|test|module)\\.(scss|tsx)$).*\\.(scss|tsx)$";

export const getPairs = (destPath: string, isRecursive?: boolean) => {
  const pairs: any = {};
  let dirsMeta = [];

  if (isRecursive) {
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
        pairs[reKey] = dirMeta.pairs[reKey];
      }
    }
  }
  return pairs;
};

export const migrate = (destPath: string, isRecursive?: boolean) => {
  const pairs: any = getPairs(destPath, isRecursive);
  console.log("pairs");
  console.log(pairs);
  for (const pairKey in pairs) {
    const cssFilePath = pairs[pairKey].scss;
    const cssSelectors = getCssSelectors(cssFilePath);
    handleComponent(pairs[pairKey].tsx, cssSelectors, pairKey);
    fs.renameSync(cssFilePath, addDotModule(cssFilePath));
  }
};

const destPath = argv.dir ? argv.dir : "src";
migrate(destPath, argv.r);
