// File: ./sidenav/js/profile.js | Purpose: legacy profile menu toggle
$(document).ready(function () {
  // Toggle mobile menu animation
  $(".menu").on("click", function () {
    $(".bar").toggleClass("animate");
    $(".expand-menu").toggleClass("animate");
    $(".expand-menu .nav-link").toggleClass("animate");
    setTimeout(function () {
      $(".expand-menu .nav-link").toggleClass("animate-show");
    }, 500);
  });
});
