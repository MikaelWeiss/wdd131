// Functions
function getGrades() {
  const grades = document.getElementById("grades").value;
  return grades.split(",");
}

function gradeToGpa(grade) {
  if (grade === "A") {
    return 4;
  } else if (grade === "B") {
    return 3;
  } else if (grade === "C") {
    return 2;
  } else if (grade === "D") {
    return 1;
  } else if (grade === "F") {
    return 0;
  }
}

function calculateGPA(grades) {
  const gpas = grades.map(gradeToGpa);
  const gpa = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length;
  const roundedGpa = gpa.toFixed(2);
  return roundedGpa;
}

function displayGPA(gpa) {
  document.getElementById("output").innerHTML = gpa;
}

function clickHandler() {
  const grades = getGrades();
  const gpa = calculateGPA(grades);
  displayGPA(gpa);
}

// Page setup

// Event listeners
document.querySelector("#submitButton").addEventListener("click", clickHandler);