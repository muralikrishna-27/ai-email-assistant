import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7, Email } from "@mui/icons-material";

export default function Header({ mode, toggleMode }) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Email sx={{ mr: 1 }} />
        <Typography sx={{ flexGrow: 1, fontWeight: 700 }}>
          Smart Email Assistant
        </Typography>
        <IconButton onClick={toggleMode}>
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
