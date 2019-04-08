(function () {
  'use strict';
  $('code').each(function () {
    let htmlString = $(this).html()
    $(this).addClass('prettyprint html');
    $(this).text(htmlString)
  });
}());