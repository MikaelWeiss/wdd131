//  arrays.js
// Activity 1 - Map
const steps = ["one", "two", "three"];
const listTemplate = (step) => `<li>${step}</li>`;
const stepsHtml = steps.map(listTemplate);
document.querySelector("#myList").innerHTML = stepsHtml.join();

// Activity 2 - Map
const grades = ["A", "B", "A"];

function gradeToGpa(grade) {
  if (grade === "A") {
    return 4;
  } else if (grade === "B") {
    return 3;
  } else if (grade === "C") {
    return 2;
  }
}

// Activity 3 - Reduce
const points = grades.map(gradeToGpa);
const gpa = points.reduce((sum, gpa) => sum + gpa, 0) / points.length;

// Activity 4 - Filter
const fruits = ['watermelon', 'peach', 'apple', 'tomato', 'grape']
const filterredFruits = fruits.filter(fruit => fruit.length < 6)

// Activity 5 - indexOf
const nums = [12, 34, 21, 54];
const luckyNumber = 21;
const index = nums.indexOf(luckyNumber);
const numExists = index != -1;