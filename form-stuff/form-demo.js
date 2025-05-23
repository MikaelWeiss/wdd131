// form-demo.js
function validateForm(event) {
  const theForm = event.target;
  const errors = [];
  let isValid = true;

  const fullName = theForm.fullName.value.trim();
  const paymentMethod = theForm.paymentMethod.value;
  const creditCardNumber = theForm.creditCardNumber.value.trim();

  if (fullName !== "Bob") {
    errors.push("Sorry, only users named 'Bob' can submit this form.");
    isValid = false;
  }

  if (paymentMethod === "creditCard") {
    if (creditCardNumber !== "1234123412341234") {
      errors.push("Invalid credit card number. Please use the test number: 1234123412341234");
      isValid = false;
    }
  }

  if (!isValid) {
    event.preventDefault();
    showErrors(errors);
    return false;
  }
}

function togglePaymentDetails(e) {
  const creditCardContainer = document.querySelector('#creditCardContainer');
  const paypalContainer = document.querySelector('#paypalContainer');

  creditCardContainer.classList.add('hide');
  paypalContainer.classList.add('hide');

  const creditCardNumber = document.querySelector('#creditCardNumber');
  const paypalUsername = document.querySelector('#paypalUsername');
  
  const selectedPayment = e.target.value;
  
  if (selectedPayment === 'creditCard') {
    creditCardContainer.classList.remove('hide');
    creditCardNumber.setAttribute('required', '');
    paypalUsername.removeAttribute('required');
  } else if (selectedPayment === 'paypal') {
    paypalContainer.classList.remove('hide');
    paypalUsername.setAttribute('required', '');
    creditCardNumber.removeAttribute('required');
  }
}

function showErrors(errors) {
  const errorEl = document.querySelector(".errors");
  const html = errors.map((error) => `<p>${error}</p>`);
  errorEl.innerHTML = html.join("");
}

document.querySelector('#paymentMethod').addEventListener('change', togglePaymentDetails);

document.querySelector('#checkoutForm').addEventListener('submit', validateForm);