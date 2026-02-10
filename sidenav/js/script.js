// File: ./sidenav/js/script.js | Purpose: swipe + match + mini chat + nav state
"use strict";

// --- Core swipe elements ---
var tinderContainer = document.querySelector(".tinder");
var allCards = document.querySelectorAll(".tinder--card");
var nope = document.getElementById("nope");
var love = document.getElementById("love");

// --- Match modal elements ---
var matchModal = document.getElementById("matchModal");
var matchAvatarThem = document.getElementById("matchAvatarThem");
var matchConfetti = document.getElementById("matchConfetti");

// --- Mini chat elements ---
var openMatchChat = document.getElementById("openMatchChat");
var miniChat = document.getElementById("miniChat");
var miniChatInput = miniChat
  ? miniChat.querySelector(".mini-chat__input input")
  : null;
var miniChatSend = miniChat
  ? miniChat.querySelector(".mini-chat__input button")
  : null;
var miniChatBody = miniChat ? miniChat.querySelector(".mini-chat__body") : null;

// --- Nav highlight elements ---
var navLinks = document.querySelectorAll(".navigation a");
var navButton = document.querySelector(".nav-button");

// Stack cards visually on load and after each swipe
function initCards(card, index) {
  var newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add("loaded");
}

initCards();

// --- Match modal helpers ---
function openMatchModal(card) {
  if (!matchModal) return;
  var img = card.querySelector("img");
  if (img && matchAvatarThem) {
    matchAvatarThem.src = img.getAttribute("src") || "";
  }
  matchModal.classList.add("is-open");
  matchModal.setAttribute("aria-hidden", "false");

  if (matchConfetti) {
    matchConfetti.innerHTML = "";
    var colors = ["#ff5864", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"];
    for (var i = 0; i < 40; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = 1 + Math.random() * 0.3 + "s";
      piece.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      matchConfetti.appendChild(piece);
    }
  }
}

function closeMatchModal() {
  if (!matchModal) return;
  matchModal.classList.remove("is-open");
  matchModal.setAttribute("aria-hidden", "true");
}

// Close match modal on backdrop / X button
if (matchModal) {
  matchModal.addEventListener("click", function (event) {
    if (event.target.closest("[data-close-match]")) {
      closeMatchModal();
    }
  });
}

// --- Mini chat helpers ---
function openMiniChat() {
  if (!miniChat) return;
  miniChat.classList.add("is-open");
  miniChat.setAttribute("aria-hidden", "false");
}

function closeMiniChat() {
  if (!miniChat) return;
  miniChat.classList.remove("is-open");
  miniChat.setAttribute("aria-hidden", "true");
}

// Open mini chat from match popup
if (openMatchChat) {
  openMatchChat.addEventListener("click", function () {
    openMiniChat();
  });
}

// Close mini chat on backdrop / X button
if (miniChat) {
  miniChat.addEventListener("click", function (event) {
    if (event.target.closest("[data-close-mini-chat]")) {
      closeMiniChat();
    }
  });
}

// Append a message to the mini chat UI (no backend)
function sendMiniChatMessage() {
  if (!miniChatInput || !miniChatBody) return;
  var text = miniChatInput.value.trim();
  if (!text) return;
  var bubble = document.createElement("div");
  bubble.className = "mini-chat__bubble mini-chat__bubble--me";
  bubble.textContent = text;
  miniChatBody.appendChild(bubble);
  miniChatBody.scrollTop = miniChatBody.scrollHeight;
  miniChatInput.value = "";
  miniChatInput.focus();
}

// Send on button click or Enter key
if (miniChatSend) {
  miniChatSend.addEventListener("click", sendMiniChatMessage);
}

if (miniChatInput) {
  miniChatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMiniChatMessage();
    }
  });
}

// --- Active nav highlighting based on hash ---
function setActiveNav() {
  var hash = window.location.hash || "#swipe";
  navLinks.forEach(function (link) {
    if (link.getAttribute("href") === hash) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
  if (navButton) {
    if (hash === "#second") {
      navButton.classList.add("active");
    } else {
      navButton.classList.remove("active");
    }
  }
}

window.addEventListener("hashchange", setActiveNav);
setActiveNav();

// --- Swipe gesture handlers (Hammer.js) ---
allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on("pan", function (event) {
    el.classList.add("moving");
  });

  hammertime.on("pan", function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
    tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform =
      "translate(" +
      event.deltaX +
      "px, " +
      event.deltaY +
      "px) rotate(" +
      rotate +
      "deg)";
  });

  hammertime.on("panend", function (event) {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love");
    tinderContainer.classList.remove("tinder_nope");

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle("removed", !keep);

    if (keep) {
      event.target.style.transform = "";
    } else {
      var endX = Math.max(
        Math.abs(event.velocityX) * moveOutWidth,
        moveOutWidth,
      );
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      el.style.transform =
        "translate(" +
        toX +
        "px, " +
        (toY + event.deltaY) +
        "px) rotate(" +
        rotate +
        "deg)";
      if (event.deltaX > 0 && el.getAttribute("data-match") === "true") {
        openMatchModal(el);
      }
      initCards();
    }
  });
});

// --- Swipe button handlers (like/nope) ---
function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll(".tinder--card:not(.removed)");
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add("removed");

    if (love) {
      card.style.transform =
        "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
      if (card.getAttribute("data-match") === "true") {
        openMatchModal(card);
      }
    } else {
      card.style.transform =
        "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
    }

    initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener("click", nopeListener);
love.addEventListener("click", loveListener);
