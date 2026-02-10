// File: ./sidenav/js/card-meta.js | Purpose: fill card name/age/sex
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".tinder--card[data-profile-id]");
  if (!cards.length) return;

  // Render name + age/sex on a card
  function setMeta(card, profile) {
    var nameEl = card.querySelector(".card-name");
    var metaEl = card.querySelector(".card-meta");

    if (nameEl && profile.name) {
      nameEl.textContent = profile.name;
    }

    if (metaEl) {
      var age = profile.age ? String(profile.age) : "";
      var sexLabel = "";
      if (profile.sex) {
        var sexValue = String(profile.sex).toUpperCase();
        sexLabel =
          sexValue === "F" ? "♀" : sexValue === "M" ? "♂" : profile.sex;
      }
      if (age || sexLabel) {
        metaEl.textContent =
          ", " + [age, sexLabel].filter(Boolean).join(" \u2022 ");
      } else {
        metaEl.textContent = "";
      }
    }
  }

  // First pass: use data attributes (works even without fetch/file://)
  cards.forEach(function (card) {
    var profile = {
      name: card.querySelector(".card-name")
        ? card.querySelector(".card-name").textContent
        : "",
      age: card.getAttribute("data-age") || "",
      sex: card.getAttribute("data-sex") || "",
    };
    setMeta(card, profile);
  });

  // Second pass: hydrate from JSON if available (overrides placeholders)
  fetch("data/profiles.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load profiles");
      return res.json();
    })
    .then(function (profiles) {
      var map = {};
      profiles.forEach(function (profile) {
        map[profile.id] = profile;
      });

      cards.forEach(function (card) {
        var id = card.getAttribute("data-profile-id");
        var profile = map[id];
        if (profile) {
          setMeta(card, profile);
        }
      });
    })
    .catch(function () {});
});
