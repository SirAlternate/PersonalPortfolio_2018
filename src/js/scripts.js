//=require aos/aos.js
//=require jquery/jquery.js
//=require jquery-ui/jquery-ui.js
//=require jvectormap/jquery-jvectormap-2.0.3.min.js
//=require jvectormap/jquery-jvectormap-world-mill.js

$(document).ready(function() {
  // Initialize animate on scroll
  AOS.init({
    easing: 'ease-out-back',
    duration: 800,
    once: true
  });

  // Initialize scroll arrow shake and start interval
  const navlink = $('.navbar').find('a').attr('href');
  $('.down-arrow').attr('href', navlink);
  function arrowLoop() {
    $('.down-arrow .fa').animate({'top': '40'}, {
      duration: 1200,
      complete: function() {
        $('.down-arrow .fa').animate({'top': '25'}, {
          duration: 1200,
          complete: arrowLoop
        });
      }
    });
  }
  setTimeout(arrowLoop, 4200);

  // Handle hamburger menu toggling
  $('.navbar-burger').click(function(e) {
    this.classList.toggle('is-active');
    $(`#${this.dataset.target}`).toggleClass('is-active');
  });

  // Smooth page scrolling
  $('a.page-scroll').click(function(event) {
    const distance = $($(this).attr('href')).offset().top - $('html').offset().top;
    const scrollTime = Math.abs(distance) < 1000 ? 1000 : 2000;

    $('html, body').stop().animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, scrollTime, 'easeInOutExpo');

    event.preventDefault();
  });

  // Notification close handling
  $('.notification .delete').click(function(e) {
    $(e.target).parent().hide();
  });

  // Travel map
  $('#travel-map').vectorMap({
    map: 'world_mill',
    zoomOnScroll: false,
    backgroundColor: 'transparent',
    series: {
      regions: [{
        values: {
          'US': true,
          'AU': true,
          'KH': true,
          'CR': true,
          'CU': true,
          'IT': true,
          'NO': true,
          'PE': true,
          'TH': true,
          'TZ': true,
          'CA': true,
          'VN': true,
          'FR': true,
          'AT': true,
          'EC': true,
          'MX': true,
          'CH': true
        },
        scale: {
          true: '#209cee'
        }
      }]
    },
    regionStyle: {
      initial: {
        fill: '#e8e8e8'
      },
      hover: {
        fill: '#87c9f4'
      }
    }
  });
});

// Contact form submission logic
function submitContactForm(token) {
  $.ajax({
    type: 'POST',
    url: '/php/contact.php',
    data: $('#contact-form').serialize(),
    success: function(data) {
      if (parseInt(data) == 500 || parseInt(data) == 403) {
        triggerContactNotification('error');
      } else {
        triggerContactNotification('success');
        $('#contact-form')[0].reset();
      }
    },
    error: function (data) {
      triggerContactNotification('error');
    }
  });

  // Display contact form status notification
  function triggerContactNotification(type) {
    if (type == 'success') {
      $('#contact-form-success').find('.text').text('Contact form submitted successfully');
      $('#contact-form-success').show();
    } else if (type == 'error') {
      $('#contact-form-danger').find('.text').text('Woops, something went wrong. Try again later');
      $('#contact-form-danger').show();
    }
  }
}
