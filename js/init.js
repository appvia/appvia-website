/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/

 jQuery(document).ready(function() {


/*----------------------------------------------------*/
/*	Flexslider
/*----------------------------------------------------*/
   $('#intro-slider').flexslider({
      animation: 'fade',
      controlNav: false,
   });

/* ------------------------------------------------------ */
/* Client Carousel
/* ------------------------------------------------------ */
   $(".owl-carousel").owlCarousel({
      nav: false,
      loop: true,
      margin: 50,
      responsiveClass:true,
      responsive: {
         0:{
            items:2,
            margin: 20
         },
         400:{
            items:3,
            margin: 30
         },
         600:{
            items:4,
            margin: 40
         },
         1000:{
            items:6
         }
      }
   });

/*----------------------------------------------------*/
/*	gmaps
------------------------------------------------------*/

   var map;

   // main directions
   map = new GMaps({
      el: '#map', lat: 51.5003646652, lng: -0.1214328476, zoom: 14, zoomControl : true,
      zoomControlOpt: { style : 'SMALL', position: 'TOP_LEFT' }, panControl : false, scrollwheel: false
   });

   // add address markers
   map.addMarker({ lat: 51.5003646652, lng: -0.1214328476, title: 'Appvia Tower',
   infoWindow: { content: '<p>Appvia.<br>Big Ben<br>Westminster<br><a>http://appvia.io</a></p>' } });

/*----------------------------------------------------*/
/*	contact form
------------------------------------------------------*/

   $('form#contactForm button.submit').click(function() {

      $('#image-loader').fadeIn();

      var contactName = $('#contactForm #contactName').val();
      var contactEmail = $('#contactForm #contactEmail').val();
      var contactSubject = $('#contactForm #contactSubject').val();
      var contactMessage = $('#contactForm #contactMessage').val();

      var data = 'contactName=' + contactName + '&contactEmail=' + contactEmail +
               '&contactSubject=' + contactSubject + '&contactMessage=' + contactMessage;

      $.ajax({

	      type: "POST",
	      url: "inc/sendEmail.php",
	      data: data,
	      success: function(msg) {

            // Message was sent
            if (msg == 'OK') {
               $('#image-loader').fadeOut();
               $('#message-warning').hide();
               $('#contactForm').fadeOut();
               $('#message-success').fadeIn();   
            }
            // There was an error
            else {
               $('#image-loader').fadeOut();
               $('#message-warning').html(msg);
	            $('#message-warning').fadeIn();
            }

	      }

      });

      return false;

   });


});








