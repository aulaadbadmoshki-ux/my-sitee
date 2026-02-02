// Elements
const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const result = document.getElementById("result");
const audio = document.getElementById("audio");
const songSelect = document.getElementById("songSelect");
const slideshow = document.getElementById("slideshow");
const title = document.getElementById("title");
const btnWrap = document.getElementById("btnWrap");
const hint = document.getElementById("hint");

// --- Music selector
songSelect.addEventListener("change", () => {
  audio.src = songSelect.value;
  audio.play().catch(()=>{ /* autoplay may be blocked */ });
});
// set initial
audio.src = songSelect.value;

// --- Simple slideshow (fade)
const slides = Array.from(slideshow.querySelectorAll("img"));
let cur = 0;
if (slides.length) {
  slides[cur].classList.add("show");
  setInterval(() => {
    slides[cur].classList.remove("show");
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add("show");
  }, 3200);
}

// --- NO button behavior: runs away on hover / can't be clicked
function randomPositionWithin(container, elem) {
  const cRect = container.getBoundingClientRect();
  const eRect = elem.getBoundingClientRect();
  const pad = 8; // keep inside padding
  const maxX = Math.max(0, cRect.width - eRect.width - pad);
  const maxY = Math.max(0, cRect.height - eRect.height - pad);
  const x = Math.floor(Math.random() * maxX) + pad;
  const y = Math.floor(Math.random() * maxY) + pad;
  return {x, y};
}

function moveNo() {
  const {x, y} = randomPositionWithin(btnWrap, noBtn);
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

// initial small offset so it doesn't overlap
setTimeout(() => {
  moveNo();
}, 200);

// on mouseenter it jumps away
noBtn.addEventListener("mouseenter", () => {
  moveNo();
});

// prevent click — if user somehow clicks, move again
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNo();
});

// also move when window resizes so it stays visible
window.addEventListener("resize", () => {
  // keep yes centered-ish and push no away if out of bounds
  const wrapRect = btnWrap.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  yesBtn.style.left = Math.max(8, (wrapRect.width/2) - yesRect.width - 10) + "px";
  moveNo();
});

// --- YES button behavior
yesBtn.addEventListener("click", () => {
  // Stop any running audio reposition trickiness
  result.innerHTML = `
    <strong>💗 Good choice, babu.</strong><br><br>
    You’re stuck with me now.<br>
    And yeah… we’re going out.<br>
    No labels. No cringe.<br>
    Just us — that day 😉
  `;
  // gentle visual cue on YES
  yesBtn.animate([
    { transform: "scale(1)" },
    { transform: "scale(1.06)" },
    { transform: "scale(1)" }
  ], { duration: 420, easing: "ease-out" });

  // optional short confetti hearts (very lightweight)
  showHearts();
});

// small hearts effect (pure DOM; simple & optional)
function showHearts(){
  const wrap = document.createElement("div");
  wrap.style.position = "absolute";
  wrap.style.inset = "0";
  wrap.style.pointerEvents = "none";
  btnWrap.appendChild(wrap);

  const colors = ["#ff6b85","#ffd1dc","#ff9fb1"];
  for(let i=0;i<16;i++){
    const h = document.createElement("div");
    h.textContent = "❤";
    h.style.position="absolute";
    h.style.left = (50 + (Math.random()-0.5)*160) + "%";
    h.style.top = "20%";
    h.style.opacity = 0.95;
    h.style.fontSize = `${8 + Math.random()*20}px`;
    h.style.transform = `translateY(0) scale(${0.8 + Math.random()*0.6})`;
    h.style.color = colors[Math.floor(Math.random()*colors.length)];
    wrap.appendChild(h);

    // animate
    const dx = (Math.random()-0.5) * 120;
    const dy = -60 - Math.random() * 180;
    h.animate([
      { transform: `translate(0,0) rotate(0deg)`, opacity:1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random()*120-60}deg)`, opacity:0 }
    ], { duration: 900 + Math.random()*600, easing:"cubic-bezier(.2,.8,.2,1)"});
  }

  setTimeout(()=>wrap.remove(), 1400);
}

// --- Hidden hint (subtle & tasteful)
// Double-click the title to toggle a small hint. Also allow pressing 'h'.
let hintVisible = false;
function toggleHint() {
  hintVisible = !hintVisible;
  hint.hidden = !hintVisible;
}
title.addEventListener("dblclick", toggleHint);
window.addEventListener("keydown", (e)=>{
  if (e.key.toLowerCase() === "h") toggleHint();
});

// Accessibility: let keyboard users still try YES/NO
noBtn.addEventListener("focus", () => moveNo());
noBtn.addEventListener("keydown", (e) => {
  // if keyboard user tries to press Enter/Space, move instead
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    moveNo();
  }
});