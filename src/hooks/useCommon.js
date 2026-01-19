import useCustomThemeContext from "./useCustomContext";

export const useCommon = () => {
  const theme = useCustomThemeContext()

  return {
    theme,
  };
};
