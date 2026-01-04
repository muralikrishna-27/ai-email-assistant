import { Button, Stack, Chip, CircularProgress } from "@mui/material";

export default function AutoDetectToneButton({
  onDetect,
  detectedTone,
  disabled,
  loading,
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Button
        variant="contained"
        onClick={onDetect}
        disabled={disabled || loading}
        sx={{ minWidth: 180 }}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Auto Detect Tone"
        )}
      </Button>

      <Chip
        label={
          detectedTone
            ? `Detected Tone: ${detectedTone}`
            : "Detected Tone: —"
        }
      />
    </Stack>
  );
}
