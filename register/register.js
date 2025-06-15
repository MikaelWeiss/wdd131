import { participantTemplate, successTemplate } from './Templates.js';

let participantsCount = 1;

function addParticipant() {
  participantsCount++;
  const addButton = document.querySelector('#add');
  addButton.insertAdjacentHTML('beforebegin', participantTemplate(participantsCount));
}

function submitForm(event) {
  event.preventDefault();
  const adultName = document.getElementById('adult_name').value;
  const totalFeesValue = totalFees();
  const participantsCount = document.querySelectorAll('section[class^="participant"]').length;
  const info = {
    adultName,
    totalFeesValue,
    participantsCount,
  }
  const successMessage = successTemplate(info);
  // hide the form
  const form = document.querySelector('form');
  form.classList.add('hide');
  // show the success message
  const summaryElement = document.getElementById('summary');
  summaryElement.innerHTML = successMessage;
  summaryElement.classList.remove('hide');
}

function totalFees() {
  let feeElements = document.querySelectorAll("[id^=fee]");
  feeElements = [...feeElements];
  console.log(feeElements);
  return feeElements.reduce((acc, curr) => {
    return acc + Number(curr.value);
  }, 0);
}

// Setup
const addButton = document.getElementById('add');
addButton.addEventListener('click', addParticipant);

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);