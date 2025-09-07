

export const decodeURLParam = (param: string | null): string => {
  if (!param) return "";
  return decodeURIComponent(param.replace(/\+/g, " "));
};
