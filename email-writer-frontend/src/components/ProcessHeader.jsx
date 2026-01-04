import { Box, Typography, Stack, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function ProcessHeader() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Typography
        variant="h5"
        fontWeight={800}
        gutterBottom
        sx={{
          color: theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.primary.main,
          userSelect: "text",
        }}
      >
        Write Better Emails in Seconds
      </Typography>


      <Typography
        variant="body1"
        sx={{
          mb: 2,
          color: theme.palette.mode === "dark"
            ? theme.palette.grey[400]
            : theme.palette.text.secondary,
        }}
      >
        Paste your email, detect the tone, and generate a clear professional reply.
      </Typography>


      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
      >
        {[
          "Paste Email",
          "Auto Detect Tone",
          "Generate Reply",
          "Copy & Send",
        ].map((label) => (
          <Chip
            key={label}
            label={label}
            sx={{
              backgroundColor: isDark ? "#1e293b" : undefined,
              color: isDark ? "#e2e8f0" : undefined,
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
