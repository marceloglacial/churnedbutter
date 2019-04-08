'use strict';

// Style code templates using JavaScript code prettifier
// https://github.com/google/code-prettify
$('code').each(function () {
  let htmlString = $(this).html()
  $(this).addClass('prettyprint html');
  $(this).text(htmlString)
});
