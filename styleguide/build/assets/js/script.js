'use strict';

// Style code templates using JavaScript code prettifier
// https://github.com/google/code-prettify
$('pre code').each(function () {
  let htmlString = $(this).html()
  $(this).addClass('prettyprint html');
  $(this).text(htmlString)
});

$(document).ready(function() {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });
});