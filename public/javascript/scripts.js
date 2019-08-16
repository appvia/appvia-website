$('#menu a').click(function(){
  $('#menuToggle input:checkbox').prop('checked', false);
});

$('.parallax').scroll(function() {
  $('.target').each(function() {
      if($(window).scrollTop() >= $(this).offset().top) {
        var id = $(this).attr('id');
        $('#mainMenu a').removeClass('active');
        $('#mainMenu a[href*='+ id +']').addClass('active');
      }
  });
});
