import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#3949ab" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#EFF3FF" : "#0B1220",
      },
    },
  });
