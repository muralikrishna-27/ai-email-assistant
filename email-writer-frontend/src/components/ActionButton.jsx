import { Button, CircularProgress } from "@mui/material";

export default function ActionButton({ loading, disabled, hasResult, onClick }) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      disabled={loading || disabled}
      onClick={onClick}
      sx={{ mb: 3, textTransform: "none" }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : hasResult ? (
        "Regenerate Reply"
      ) : (
        "Generate Reply"
      )}
    </Button>
  );
}
