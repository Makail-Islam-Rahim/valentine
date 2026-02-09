// app.js (FULL) — includes: link generate + copy, preview, back/reset,
// NO clickable (wiggle via CSS) + small move after click, YES grows,
// shared link opens question page, and URL is cleaned (no names shown)

const $ = (id) => document.getElementById(id);

const generator = $("generator");
const question = $("question");
const yay = $("yay");

const fromInput = $("fromInput");
const toInput = $("toInput");
const createBtn = $("createBtn");
const previewBtn = $("previewBtn");
const backBtn = $("backBtn");
const againBtn = $("againBtn");

const linkBox = $("linkBox");
const linkOut = $("linkOut");
const copyBtn = $("copyBtn");
const copyToast = $("copyToast");

const namesChip = $("namesChip");
const questionTitle = $("questionTitle");
const loveFrom = $("loveFrom");

const yesBtn = $("yesBtn");
const noBtn = $("noBtn");

let noClicks = 0;

const noMessages = [
  "Please 🥺",
  "Think again 😢",
  "Don’t break my heart 💔",
  "Pretty please 🙏",
  "Okay… YES 😭"
];

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function resetState() {
  noClicks = 0;
  noBtn.textContent = "No 😢";
  yesBtn.style.transform = "scale(1)";

  // reset NO position back to CSS default
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "40px";
  noBtn.style.bottom = "20px";
}

function getParams() {
  const u = new URL(location.href);
  return {
    from: (u.searchParams.get("from") || "").trim(),
    to: (u.searchParams.get("to") || "").trim()
  };
}

function showGenerator() {
  show(generator);
  hide(question);
  hide(yay);
}

function showQuestion(from, to) {
  resetState();
  hide(generator);
  show(question);
  hide(yay);

  const safeFrom = from || "Someone";
  const safeTo = to || "You";

  namesChip.textContent = `${safeFrom} → ${safeTo}`;
  questionTitle.textContent = `${safeTo}, will you be my Valentine?`;
  loveFrom.textContent = `Love from ${safeFrom}`;
}

function showYay(from) {
  hide(generator);
  hide(question);
  show(yay);
  // You can customize this text if you want
  // (Your current yay screen in HTML doesn't show from/to, so we keep it simple)
}

function moveNoButtonSmall() {
  const stage = document.querySelector(".stage");
  const maxX = stage.clientWidth - noBtn.clientWidth;
  const maxY = stage.clientHeight - noBtn.clientHeight;

  // Small, safe movement so it's still clickable
  const x = maxX * 0.55 + Math.random() * 40;
  const y = maxY * 0.55 + Math.random() * 30;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
}

// CREATE LINK
createBtn.onclick = () => {
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  if (!from || !to) return alert("Fill both names");

  const url = new URL(location.href);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  linkOut.value = url.toString();
  linkBox.classList.remove("hidden");
};

// COPY LINK
copyBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(linkOut.value);
    copyToast.classList.remove("hidden");
    setTimeout(() => copyToast.classList.add("hidden"), 1200);
  } catch {
    linkOut.select();
    document.execCommand("copy");
  }
};

// PREVIEW (no URL change)
previewBtn.onclick = () => {
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  if (!from || !to) return alert("Fill both names");
  showQuestion(from, to);
};

// BACK
backBtn.onclick = () => {
  resetState();
  // remove any params if present
  history.pushState({}, "", location.pathname);
  showGenerator();
};

// AGAIN
againBtn.onclick = () => {
  resetState();
  history.pushState({}, "", location.pathname);
  showGenerator();
};

// YES
yesBtn.onclick = () => {
  showYay();
};

// NO (clickable)
noBtn.onclick = () => {
  noClicks++;

  noBtn.textContent = noMessages[Math.min(noClicks - 1, noMessages.length - 1)];
  yesBtn.style.transform = `scale(${1 + noClicks * 0.15})`;

  // move NO a little AFTER click
  moveNoButtonSmall();
};

// AUTO OPEN FROM SHARED LINK + CLEAN URL (no names shown)
(() => {
  const { from, to } = getParams();
  if (from && to) {
    showQuestion(from, to);

    // ✅ remove ?from= &to= from address bar
    history.replaceState({}, "", location.pathname);
  } else {
    showGenerator();
  }
})();
