console.log("AI Gmail Assistant loaded");

// ================= STATE =================
let popupVisible = false;
let lastEmailHash = null;
let lastReplyBox = null;

// ================= HELPERS =================
function getEmailContent() {
  const selectors = [".a3s.aiL", ".h7", ".gmail_quote", '[role="presentation"]'];
  for (const s of selectors) {
    const el = document.querySelector(s);
    if (el && el.innerText.trim()) return el.innerText.trim();
  }
  return "";
}

function getReplyBox() {
  return (
    document.querySelector('[role="textbox"][g_editable="true"]') ||
    document.querySelector('div[aria-label="Message Body"]')
  );
}

function resetGenerateButtonUI() {
  const btn = document.getElementById("generateBtn");
  if (btn) {
    btn.innerText = "Generate Reply";
  }
}


function getComposeToolbar() {
  const box = getReplyBox();
  if (!box) return null;

  // 1️⃣ Inline reply toolbar
  const inlineToolbar = document.querySelector(".btC");
  if (inlineToolbar) return inlineToolbar;

  // 2️⃣ Pop-out / floating compose toolbar
  const dialog = box.closest("div[role='dialog']");
  if (dialog) {
    const toolbar = dialog.querySelector("div[role='toolbar']");
    if (toolbar) return toolbar;
  }

  return null;
}


function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// ================= POPUP =================
function createPopup() {
  const popup = document.createElement("div");
  popup.className = "ai-popup";

  popup.innerHTML = `
    <div class="ai-header">
      <span>✨ AI Email Assistant</span>
      <span class="ai-close">✖</span>
    </div>

    <div class="ai-detect-box">
      <button id="detectToneBtn" class="ai-detect-btn">Auto Detect Tone</button>
      <span id="detectedTone" class="ai-tone-chip">Detected Tone: —</span>
    </div>

    <label class="ai-label">Reply Tone</label>
    <select id="toneSelect" class="ai-select">
      <option value="professional">Professional</option>
      <option value="friendly">Friendly</option>
      <option value="casual">Casual</option>
    </select>

    <div id="aiStatus" class="ai-status">Ready</div>
    <button id="generateBtn" class="ai-btn">Generate Reply</button>
  `;

  document.body.appendChild(popup);

  popup.querySelector(".ai-close").onclick = () => togglePopup(false);
  popup.querySelector("#generateBtn").onclick = handleGenerate;
  popup.querySelector("#detectToneBtn").onclick = detectTone;

  popup.style.display = "none";
  return popup;
}

function togglePopup(force) {
  let popup = document.querySelector(".ai-popup");
  if (!popup) popup = createPopup();

  popupVisible = typeof force === "boolean" ? force : !popupVisible;
  popup.style.display = popupVisible ? "block" : "none";
}

// ================= TYPEWRITER =================
function typewriterInsert(box, text) {
  box.focus();
  document.execCommand("selectAll", false);
  document.execCommand("delete", false);

  text.split(/\n\s*\n/).forEach((p, i) => {
    setTimeout(() => {
      document.execCommand("insertText", false, (i ? "\n\n" : "") + p);
    }, i * 120);
  });
}

// ================= BACKGROUND =================
function bg(type, payload) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type, ...payload }, resolve);
  });
}

// ================= ACTIONS =================
async function detectTone() {
  const popup = document.querySelector(".ai-popup");
  if (!popup) return;

  const status = popup.querySelector("#aiStatus");
  const select = popup.querySelector("#toneSelect");
  const chip = popup.querySelector("#detectedTone");

  status.innerText = "Detecting…";

  const res = await bg("DETECT_TONE", { email: getEmailContent() });

  if (res?.ok) {
    const tone = res.data.trim().toLowerCase();
    select.value = tone;
    chip.innerText = `Detected Tone: ${tone}`;
    status.innerText = "Tone detected ✔";
  } else {
    status.innerText = "Tone failed";
  }
}

async function handleGenerate() {
  const box = getReplyBox();
  if (!box) return;

  const payload = {
    emailContent: getEmailContent(),
    tone: document.getElementById("toneSelect").value
  };

  const res = await bg("GENERATE", { payload });
  if (res?.ok) {
    typewriterInsert(box, res.data);
    document.getElementById("generateBtn").innerText = "🔁 Regenerate";
  }
}

// ================= AI BUTTON =================
function injectButton() {
  if (document.querySelector(".ai-reply-button")) return;

  // 🚫 DO NOT show in fresh compose
  const emailContent = getEmailContent();
  if (!emailContent || emailContent.length < 20) return;

  const toolbar = getComposeToolbar();
  if (!toolbar) return;

  const btn = document.createElement("div");
  btn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
  btn.setAttribute("role", "button");
  btn.setAttribute("aria-label", "AI Reply (Alt + A)");
  btn.setAttribute("data-tooltip", "AI Reply (Alt + A)");
  btn.setAttribute("data-tooltip-delay", "800");
  btn.innerText = "AI Reply";
  btn.onclick = togglePopup;

  toolbar.insertBefore(btn, toolbar.firstChild);
}


// ================= SAFE SMART REPLY HIDE =================
function hideSmartReplySafe() {
  const main = document.querySelector('[role="main"]');
  if (!main) return;

  main.querySelectorAll('[role="region"]').forEach(region => {
    const text = region.innerText?.toLowerCase();
    if (text && text.includes("suggested reply")) {
      region.style.display = "none";
    }
  });
}

// ================= SHORTCUT TEXT =================
function replaceHelpMeWriteShortcut() {
  document.querySelectorAll('[aria-label="Help me write"]').forEach(btn => {
    btn.setAttribute("aria-label", "Help me write (Alt + A)");
  });

  document.querySelectorAll("span").forEach(span => {
    if (span.innerText?.trim() === "Alt + H") {
      span.innerText = "Alt + A";
    }
  });
}

function hideHelpMeWriteInCompose() {
  const isCompose = !getEmailContent();

  if (!isCompose) return;

  document.querySelectorAll('[aria-label="Help me write"]').forEach(el => {
    el.style.display = "none";
  });

  // Also hide the Alt+A chip text
  document.querySelectorAll("span").forEach(span => {
    if (span.innerText?.trim() === "Alt + A") {
      span.style.display = "none";
    }
  });
}

// ================= OBSERVER =================
const observer = new MutationObserver(() => {
  hideHelpMeWriteInCompose();   
  hideSmartReplySafe();
  replaceHelpMeWriteShortcut();

  const replyBox = getReplyBox();

  // 🔥 RESET UI WHEN A NEW REPLY BOX APPEARS
  if (replyBox && replyBox !== lastReplyBox) {
    lastReplyBox = replyBox;
    resetGenerateButtonUI();
  }

  if (replyBox) {
    injectButton();
  }
});


observer.observe(document.body, { childList: true, subtree: true });

// ================= HOTKEY =================
document.addEventListener("keydown", e => {
  if (e.altKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    togglePopup();
  }
});
