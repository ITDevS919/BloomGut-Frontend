import { CustomThemeContext } from "./CustomThemeContext";
import providerTheme from "../static/index";

export default function CustomThemeProvider({ children }) {
  return (
    <CustomThemeContext.Provider value={providerTheme}>
      {children}
    </CustomThemeContext.Provider>
  );
}
