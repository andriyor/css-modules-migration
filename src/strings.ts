export const addDotModule = (file: string) => {
  return file.replace(/(\.s?css)/, ".module$1");
};

export const trimQuotes = (str: string) => {
  return str.slice(1, -1);
};

export const getBaseExt = (str: string) => {
  const index = str.lastIndexOf(".");
  return [str.slice(0, index), str.slice(index + 1)];
};
