import { TextField } from "@mui/material";

export default function GeneratedReply({ value }) {
  return (
    <TextField
      fullWidth
      multiline
      rows={6}
      label="Generated Reply"
      value={value}
      InputProps={{ readOnly: true }}
    />
  );
}
