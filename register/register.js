
function participantTemplate(count) {
  return `
    <section class="participant${count}">
      <p>Participant ${count}</p>
    </section>
  `;
}

function submitForm(event) {
  event.preventDefault();

}

function successTemplate(info) {
  return `
    <h1>Success</h1>
    <p>Thank you for your registration!</p>
    <p>Here is the information you submitted:</p>
    <p>${info}</p>
  `;
}

function totalFees() {
  let feeElements = document.querySelectorAll("[id^=fee]");
  console.log(feeElements);
  feeElements = [...feeElements];
  return feeElements.reduce((acc, curr) => {
    return acc + Number(curr.value);
  }, 0);
}