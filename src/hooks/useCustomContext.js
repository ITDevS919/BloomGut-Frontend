import { CustomThemeContext } from "@/context/CustomThemeContext";
import { useContext } from "react";

export default function useCustomThemeContext() {
  const context = useContext(CustomThemeContext);

  if (!context) {
    throw new Error("useCustomThemeContext must be used inside CustomThemeProvider");
  }

  return context;
}
