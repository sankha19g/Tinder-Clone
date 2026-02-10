// File: ./sidenav/js/messages.js | Purpose: load message list + update badge
document.addEventListener("DOMContentLoaded", function () {
  var listEl = document.getElementById("messagesList");
  var countEl = document.getElementById("messagesCount");
  var modalEl = document.getElementById("chatModal");
  var chatBodyEl = document.getElementById("chatBody");
  var chatUserNameEl = document.getElementById("chatUserName");
  var chatUserAvatarEl = document.getElementById("chatUserAvatar");

  if (!listEl || !countEl || !modalEl) return;

  var activeThread = null;

  // Close chat modal
  function closeModal() {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    chatBodyEl.innerHTML = "";
    activeThread = null;
  }

  // Open chat modal and render thread bubbles
  function openModal(messageItem) {
    activeThread = messageItem;
    chatUserNameEl.textContent = messageItem.name;
    chatUserAvatarEl.src = messageItem.avatar;
    chatUserAvatarEl.alt = messageItem.name;

    chatBodyEl.innerHTML = "";
    messageItem.messages.forEach(function (msg) {
      var bubble = document.createElement("div");
      bubble.className =
        "chat-bubble " + (msg.from === "me" ? "is-me" : "is-them");
      bubble.textContent = msg.text;
      chatBodyEl.appendChild(bubble);
    });

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
  }

  // Close modal on backdrop / button
  modalEl.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-modal")) {
      closeModal();
    }
  });

  // Append a message bubble in the chat view (UI only)
  function appendMessage(text) {
    if (!activeThread) return;
    var trimmed = text.trim();
    if (!trimmed) return;

    var bubble = document.createElement("div");
    bubble.className = "chat-bubble is-me";
    bubble.textContent = trimmed;
    chatBodyEl.appendChild(bubble);
    chatBodyEl.scrollTop = chatBodyEl.scrollHeight;

    activeThread.preview = trimmed;
    var activeRow = listEl.querySelector(
      '[data-thread-id="' + activeThread.id + '"]',
    );
    if (activeRow) {
      var previewEl = activeRow.querySelector(".message-preview");
      if (previewEl) previewEl.textContent = trimmed;
    }
  }

  // Load messages from JSON and build the list
  fetch("data/messages.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    })
    .then(function (data) {
      listEl.innerHTML = "";
      countEl.textContent = data.length;

      var navBadge = document.getElementById("navMessageCount");
      if (navBadge) {
        var totalUnread = data.reduce(function (sum, item) {
          return sum + (item.unread || 0);
        }, 0);
        navBadge.textContent = totalUnread;
        navBadge.style.display = totalUnread > 0 ? "inline-flex" : "none";
      }

      data.forEach(function (item) {
        var row = document.createElement("button");
        row.type = "button";
        row.className = "message-item";
        row.setAttribute("data-thread-id", item.id);
        row.innerHTML =
          '<img class="message-avatar" src="' +
          item.avatar +
          '" alt="' +
          item.name +
          '">' +
          '<div class="message-text">' +
          '<div class="message-name">' +
          item.name +
          "</div>" +
          '<div class="message-preview">' +
          item.preview +
          "</div>" +
          "</div>" +
          '<div class="message-meta">' +
          '<span class="message-time">' +
          item.time +
          "</span>" +
          (item.unread
            ? '<span class="message-badge">' + item.unread + "</span>"
            : "") +
          "</div>";

        row.addEventListener("click", function () {
          openModal(item);
        });

        listEl.appendChild(row);
      });
    })
    .catch(function () {
      listEl.innerHTML =
        '<div class="messages-error">Unable to load messages.</div>';
      countEl.textContent = "0";
    });

  var inputEl = modalEl.querySelector(".chat-input input");
  var sendBtn = modalEl.querySelector(".chat-input button");

  function handleSend() {
    if (!inputEl) return;
    appendMessage(inputEl.value);
    inputEl.value = "";
    inputEl.focus();
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
  }

  if (inputEl) {
    inputEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSend();
      }
    });
  }
});
