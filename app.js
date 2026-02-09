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

// ---------------- HELPERS ----------------
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function resetState() {
  noClicks = 0;
  noBtn.textContent = "No 😢";
  yesBtn.style.transform = "scale(1)";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "40px";
  noBtn.style.bottom = "20px";
}

function getParams() {
  const u = new URL(window.location.href);
  return {
    from: (u.searchParams.get("from") || "").trim(),
    to: (u.searchParams.get("to") || "").trim()
  };
}

function moveNoButtonSmall() {
  const stage = document.querySelector(".stage");
  const maxX = stage.clientWidth - noBtn.clientWidth;
  const maxY = stage.clientHeight - noBtn.clientHeight;

  const x = maxX * 0.55 + Math.random() * 40;
  const y = maxY * 0.55 + Math.random() * 30;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
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

  namesChip.textContent = `${from} → ${to}`;
  questionTitle.textContent = `${to}, will you be my Valentine?`;
  loveFrom.textContent = `Love from ${from}`;
}

// ---------------- BUTTON ACTIONS ----------------

// CREATE LINK
createBtn.onclick = () => {
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  if (!from || !to) return alert("Fill both names");

  const url = new URL(window.location.href);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  linkOut.value = url.toString();
  linkBox.classList.remove("hidden");
};

// COPY LINK
copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(linkOut.value);
  copyToast.classList.remove("hidden");
  setTimeout(() => copyToast.classList.add("hidden"), 1200);
};

// PREVIEW
previewBtn.onclick = () => {
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  if (!from || !to) return alert("Fill both names");
  showQuestion(from, to);
};

// BACK
backBtn.onclick = () => {
  resetState();
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
  hide(question);
  show(yay);
};

// NO (CLICKABLE)
noBtn.onclick = () => {
  noClicks++;
  noBtn.textContent =
    noMessages[Math.min(noClicks - 1, noMessages.length - 1)];
  yesBtn.style.transform = `scale(${1 + noClicks * 0.15})`;
  moveNoButtonSmall();
};

// ---------------- AUTO OPEN FROM LINK ----------------
(() => {
  const { from, to } = getParams();

  if (from && to) {
    showQuestion(from, to);

    // ✅ THIS LINE HIDES ?from= &to= FROM URL
    history.replaceState({}, "", location.pathname);
  } else {
    showGenerator();
  }
})();
