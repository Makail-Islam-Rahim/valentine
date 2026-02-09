const $ = id => document.getElementById(id);

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

function show(el){el.classList.remove("hidden")}
function hide(el){el.classList.add("hidden")}

function resetState(){
  noClicks = 0;
  noBtn.textContent = "No 😢";
  yesBtn.style.transform = "scale(1)";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "40px";
  noBtn.style.bottom = "20px";
}

function moveNoButton(){
  const stage = document.querySelector(".stage");
  const maxX = stage.clientWidth - noBtn.clientWidth;
  const maxY = stage.clientHeight - noBtn.clientHeight;

  // small, safe movement (always clickable)
  const x = maxX * 0.55 + Math.random() * 40;
  const y = maxY * 0.55 + Math.random() * 30;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
}

function getParams(){
  const u = new URL(location.href);
  return {
    from: u.searchParams.get("from"),
    to: u.searchParams.get("to")
  };
}

// CREATE LINK
createBtn.onclick = () => {
  if(!fromInput.value || !toInput.value)
    return alert("Fill both names");

  const url = new URL(location.href);
  url.searchParams.set("from", fromInput.value);
  url.searchParams.set("to", toInput.value);

  linkOut.value = url.toString();
  linkBox.classList.remove("hidden");
};

// COPY
copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(linkOut.value);
  copyToast.classList.remove("hidden");
  setTimeout(()=>copyToast.classList.add("hidden"),1200);
};

// PREVIEW
previewBtn.onclick = () => {
  if(!fromInput.value || !toInput.value) return;
  resetState();
  hide(generator);
  show(question);
  namesChip.textContent = `${fromInput.value} → ${toInput.value}`;
  questionTitle.textContent = `${toInput.value}, will you be my Valentine?`;
  loveFrom.textContent = `Love from ${fromInput.value}`;
};

// BACK
backBtn.onclick = () => {
  resetState();
  history.pushState({}, "", location.pathname);
  hide(question);
  hide(yay);
  show(generator);
};

// YES
yesBtn.onclick = () => {
  hide(question);
  show(yay);
};

// AGAIN
againBtn.onclick = () => {
  resetState();
  hide(yay);
  show(generator);
};

// NO
noBtn.onclick = () => {
  noClicks++;
  noBtn.textContent =
    noMessages[Math.min(noClicks - 1, noMessages.length - 1)];
  yesBtn.style.transform = `scale(${1 + noClicks * 0.15})`;
  moveNoButton();
};

// AUTO OPEN FROM SHARED LINK
(() => {
  const {from, to} = getParams();
  if(from && to){
    hide(generator);
    show(question);
    namesChip.textContent = `${from} → ${to}`;
    questionTitle.textContent = `${to}, will you be my Valentine?`;
    loveFrom.textContent = `Love from ${from}`;
  }
})();
