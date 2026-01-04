import { useState } from "react";
import { generateEmail, detectTone } from "../api/emailApi";

export function useEmailGenerator() {
  const [loading, setLoading] = useState(false);        
  const [detecting, setDetecting] = useState(false);   
  const [generatedReply, setGeneratedReply] = useState("");
  const [tone, setTone] = useState("");
  const [detectedTone, setDetectedTone] = useState("");
  const [error, setError] = useState("");

  // ================= AUTO DETECT TONE =================
  const autoDetectTone = async (emailContent) => {
    setError("");
    setDetecting(true);

    try {
      const t = await detectTone(emailContent);
      setTone(t);
      setDetectedTone(t);
    } catch {
      setError("Tone detection failed");
    } finally {
      setDetecting(false);
    }
  };

  // ================= GENERATE / REGENERATE =================
  const generate = async (emailContent) => {
    setLoading(true);
    setError("");

    try {
      const reply = await generateEmail(emailContent, tone);
      setGeneratedReply(reply);
    } catch {
      setError("Couldn’t generate a reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,        
    detecting,      
    generatedReply,
    error,
    tone,
    detectedTone,
    setTone,
    autoDetectTone,
    generate,
  };
}
