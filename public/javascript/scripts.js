$('#menu a').click(function(){
  $('#menuToggle input:checkbox').prop('checked', false);
});

/*

$('.parallax').scroll(function() {


  $('.target').each(function() {
      if($(window).scrollTop() >= $(this).offset().top) {
        var id = $(this).attr('id');
        $('#mainMenu a').removeClass('active');
        $('#mainMenu a[href*='+ id +']').addClass('active');
      }
  });

  scrollTopButton();
});

function scrollTopButton() {
  if ($('.parallax').scrollTop() > 100 ) {
    $("#top").css('display', 'block');
  } else {
    $("#top").css('display', 'none');
  }
}

function scrollToAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
}

scrollToAnchor();
*/
