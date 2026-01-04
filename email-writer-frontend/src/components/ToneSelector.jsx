import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function ToneSelector({ value, onChange }) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Tone</InputLabel>
      <Select
        value={value}
        label="Tone"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="professional">Professional</MenuItem>
        <MenuItem value="friendly">Friendly</MenuItem>
        <MenuItem value="casual">Casual</MenuItem>
      </Select>
    </FormControl>
  );
}
