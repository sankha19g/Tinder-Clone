// File: ./sidenav/js/profile-settings-modal.js | Purpose: settings modal
document.addEventListener("DOMContentLoaded", function () {
  var openBtn = document.getElementById("openProfileSettings");
  var modal = document.getElementById("profileSettingsModal");

  if (!openBtn || !modal) return;

  // Close settings modal
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    openBtn.classList.remove("active");
  }

  // Open settings modal
  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    openBtn.classList.add("active");
  }

  openBtn.addEventListener("click", openModal);

  modal.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-settings")) {
      closeModal();
    }
  });
});
