import { TextField } from "@mui/material";

export default function EmailInput({ value, onChange }) {
  return (
    <TextField
      fullWidth
      multiline
      rows={6}
      label="Original Email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mb: 3 }}
    />
  );
}
