import { API_BASE, CLIENT_KEY } from "./utils/constants.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GENERATE") {
    fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CLIENT-KEY": CLIENT_KEY
      },
      body: JSON.stringify(msg.payload)
    })
      .then(res => res.text())
      .then(text => sendResponse({ ok: true, data: text }))
      .catch(err => sendResponse({ ok: false, error: err.message }));

    return true;
  }

  if (msg.type === "DETECT_TONE") {
    fetch(`${API_BASE}/detect-tone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CLIENT-KEY": CLIENT_KEY
      },
      body: JSON.stringify({ emailContent: msg.email })
    })
      .then(res => res.text())
      .then(text => sendResponse({ ok: true, data: text }))
      .catch(err => sendResponse({ ok: false, error: err.message }));

    return true;
  }
});
