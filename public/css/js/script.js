// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  // Find all alerts on the page and set a timeout to close them smoothly.
  const alerts = document.querySelectorAll('.alert-dismissible');

  alerts.forEach(function (alert) {
    setTimeout(function () {
      // Use Bootstrap's Alert API to gracefully close the alert, triggering the fade-out animation.
      new bootstrap.Alert(alert).close();
    }, 3000); // 3 seconds
  });

})()