import fs from "fs";
import path from "path";

import { getBaseExt } from "./strings";

type Pairs = Record<string, Record<string, string>>;

type DirInfo = {
  currentDir: string;
  dirs: string[];
  files: string[];
  pairs: Pairs;
};

export const getDirectoriesFiles = (dirPath: string, regexStr: string) => {
  return fs.readdirSync(dirPath).reduce(
    (prev, cur) => {
      prev.currentDir = dirPath;
      const relativePath = path.join(dirPath, cur);

      if (fs.statSync(relativePath).isDirectory()) {
        prev.dirs.push(relativePath);
      }

      const regex = new RegExp(regexStr);
      if (regex.test(relativePath)) {
        prev.files.push(relativePath);

        const [base, ext] = getBaseExt(path.basename(relativePath));
        if (prev.pairs[base]) {
          prev.pairs[base][ext] = relativePath;
        } else {
          prev.pairs[base] = {
            [ext]: relativePath,
          };
        }
      }
      return prev;
    },
    { currentDir: "", dirs: [], files: [], pairs: {} } as DirInfo
  );
};

export const getDirectoriesRecursive = (
  dirPath: string,
  regexStr: string
): DirInfo[] => {
  const dirFiles = getDirectoriesFiles(dirPath, regexStr);
  return [
    dirFiles,
    ...dirFiles.dirs
      .map((dir) => getDirectoriesRecursive(dir, regexStr))
      .flat(),
  ];
};
