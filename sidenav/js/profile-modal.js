// File: ./sidenav/js/profile-modal.js | Purpose: profile modal + photos
document.addEventListener("DOMContentLoaded", function () {
  var modalEl = document.getElementById("profileModal");
  var nameEl = document.getElementById("profileName");
  var metaEl = document.getElementById("profileMeta");
  var bioEl = document.getElementById("profileBio");
  var passionsEl = document.getElementById("profilePassions");
  var photosEl = document.getElementById("profilePhotos");
  var photosLoadingEl = document.getElementById("profilePhotosLoading");
  var avatarEl = document.getElementById("profileAvatar");
  var profileMap = {};

  if (!modalEl) return;

  // Close profile modal
  function closeProfile() {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
  }

  // Open profile modal and render data
  function openProfile(profile, avatarSrc) {
    nameEl.textContent = profile.name || "Profile";

    var metaParts = [];
    if (profile.age) metaParts.push(profile.age);
    if (profile.job) metaParts.push(profile.job);
    metaEl.textContent = metaParts.join(" • ");

    bioEl.textContent = profile.bio || "";
    passionsEl.textContent = profile.passions || "";

    if (avatarEl) {
      avatarEl.src = avatarSrc || "";
      avatarEl.alt = profile.name || "Profile photo";
    }

    photosEl.innerHTML = "";
    if (photosLoadingEl) {
      photosLoadingEl.style.display = "block";
    }

    var photos = profile.photos || [];
    var remaining = photos.length;

    if (!remaining && photosLoadingEl) {
      photosLoadingEl.textContent = "No photos yet.";
      return;
    }

    function markLoaded() {
      remaining -= 1;
      if (remaining <= 0 && photosLoadingEl) {
        photosLoadingEl.style.display = "none";
      }
    }

    photos.forEach(function (src) {
      var item = document.createElement("div");
      item.className = "profile-photo-item";

      var img = document.createElement("img");
      img.src = src;
      img.alt = profile.name || "Profile photo";

      var label = document.createElement("div");
      label.className = "profile-photo-loading";
      label.textContent = "Loading photo...";

      img.onload = function () {
        item.classList.add("is-loaded");
        markLoaded();
      };
      img.onerror = function () {
        label.textContent = "Failed to load";
        markLoaded();
      };

      item.appendChild(img);
      item.appendChild(label);
      photosEl.appendChild(item);
    });

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
  }

  // Close modal on backdrop / button
  modalEl.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-profile")) {
      closeProfile();
    }
  });

  // Load profiles JSON and wire View Profile buttons
  fetch("data/profiles.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load profiles");
      return res.json();
    })
    .then(function (profiles) {
      profiles.forEach(function (profile) {
        profileMap[profile.id] = profile;
      });

      var buttons = document.querySelectorAll(".view-profile");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-profile-id");
          var profile = profileMap[id];
          if (!profile) return;

          var card = btn.closest(".tinder--card");
          var avatarSrc = "";
          if (card) {
            var cardImg = card.querySelector("img");
            if (cardImg) avatarSrc = cardImg.getAttribute("src") || "";
          }

          openProfile(profile, avatarSrc);
        });
      });
    })
    .catch(function () {});
});
