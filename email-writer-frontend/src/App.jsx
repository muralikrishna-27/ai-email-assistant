import { Box, Container, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import Header from "./components/Header";
import EmailInput from "./components/EmailInput";
import ToneSelector from "./components/ToneSelector";
import ActionButton from "./components/ActionButton";
import GeneratedReply from "./components/GeneratedReply";
import AutoDetectToneButton from "./components/AutoDetectToneButton";
import ProcessHeader from "./components/ProcessHeader";


import { useEmailGenerator } from "./hooks/useEmailGenerator";
import { getTheme } from "./theme/theme";

export default function App() {
  const [mode, setMode] = useState("light");
  const [emailContent, setEmailContent] = useState("");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const {
    loading,
    detecting,
    generatedReply,
    error,
    tone,
    detectedTone,
    setTone,
    autoDetectTone,
    generate,
  } = useEmailGenerator();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh" }}>
        <Header
          mode={mode}
          toggleMode={() => setMode(mode === "light" ? "dark" : "light")}
        />

        <Container maxWidth="md" sx={{ py: 5 }}>
          <ProcessHeader />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
              <EmailInput value={emailContent} onChange={setEmailContent} />


              <AutoDetectToneButton
                disabled={!emailContent || detecting}
                loading={detecting}          
                detectedTone={detectedTone}
                onDetect={() => autoDetectTone(emailContent)}
              />


              <ToneSelector value={tone} onChange={setTone} />

              <ActionButton
                loading={loading}
                disabled={!emailContent}
                hasResult={!!generatedReply}
                onClick={() => generate(emailContent)}
              />

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              {generatedReply && <GeneratedReply value={generatedReply} />}
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
