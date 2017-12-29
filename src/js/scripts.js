//=require aos/dist/aos.js
//=require jquery/dist/jquery.js

$(document).ready(function() {
  // Initialize Animate On Scroll
  AOS.init({
    duration: 800
  });

  // Initialize hamburger menus if there are any
  var navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if (navbarBurgers.length > 0) {

    // Add a click event on each of them
    navbarBurgers.forEach(function (element) {
      element.addEventListener('click', function () {
        // Get the target from the "data-target" attribute
        var target = element.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        element.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

// Contact form submission logic
function submitContactForm(token) {
  $.ajax({
    type: 'POST',
    url: '/php/contact.php',
    data: $('#contact-form').serialize(),
    success: function(data) {
      console.log(data);
    },
    error: function (data) {
      console.log('error');
      console.log(data);
    }
  });
}
