const API_BASE = "http://localhost:8080/api/email";

const CLIENT_KEY = "email-extension-dev";

const headers = {
  "Content-Type": "application/json",
  "X-CLIENT-KEY": CLIENT_KEY,
};

export async function generateEmail(emailContent, tone) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ emailContent, tone }),
  });

  if (!res.ok) throw new Error("Generate failed");
  return await res.text();
}

export async function detectTone(emailContent) {
  const res = await fetch(`${API_BASE}/detect-tone`, {
    method: "POST",
    headers,
    body: JSON.stringify({ emailContent }),
  });

  if (!res.ok) throw new Error("Tone detect failed");
  return (await res.text()).trim().toLowerCase();
}
