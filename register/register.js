let participantsCount = 1;

function participantTemplate(count) {
  return `
    <section class="participant${count}">
            <p>Participant ${count}</p>
            <div class="item">
              <label for="fname${count}"> First Name<span>*</span></label>
              <input id="fname${count}" type="text" name="fname" value="" required />
            </div>
            <div class="item activities">
              <label for="activity${count}">Activity #<span>*</span></label>
              <input id="activity${count}" type="text" name="activity" />
            </div>
            <div class="item">
              <label for="fee${count}">Fee ($)<span>*</span></label>
              <input id="fee${count}" type="number" name="fee" />
            </div>
            <div class="item">
              <label for="date${count}">Desired Date <span>*</span></label>
              <input id="date${count}" type="date" name="date" />
            </div>
            <div class="item">
              <p>Grade</p>
              <select id="grade${count}">
                <option selected value="" disabled selected></option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
                <option value="5">5th</option>
                <option value="6">6th</option>
                <option value="7">7th</option>
                <option value="8">8th</option>
                <option value="9">9th</option>
                <option value="10">10th</option>
                <option value="11">11th</option>
                <option value="12">12th</option>
              </select>
            </div>
          </section>
  `;
}

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

function successTemplate(info) {
  const { adultName, totalFeesValue, participantsCount } = info;
  return `
    <p>Thank you ${adultName} for registering. You have registered ${participantsCount} participants and owe $${totalFeesValue} in Fees.</p>
  `;
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