// File: ./sidenav/js/settings-menu.js | Purpose: photo edit dropdowns
document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("profileSettingsModal");
  if (!modal) return;

  // Close any open dropdown
  function closeAllMenus() {
    modal.querySelectorAll(".settings-menu.is-open").forEach(function (menu) {
      menu.classList.remove("is-open");
    });
  }

  // Toggle dropdown on pencil click
  modal.addEventListener("click", function (event) {
    var editBtn = event.target.closest(
      ".settings-avatar__edit, .settings-photo__edit",
    );
    if (editBtn) {
      event.stopPropagation();
      var wrapper = editBtn.parentElement;
      var menu = wrapper.querySelector(".settings-menu");
      if (!menu) return;
      var isOpen = menu.classList.contains("is-open");
      closeAllMenus();
      if (!isOpen) {
        menu.classList.add("is-open");
      }
      return;
    }

    if (!event.target.closest(".settings-menu")) {
      closeAllMenus();
    }
  });

  // Close dropdowns when clicking outside the modal
  document.addEventListener("click", function (event) {
    if (!modal.contains(event.target)) {
      closeAllMenus();
    }
  });
});
