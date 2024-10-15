let timeLeft;
let currentTask = 0;
let correctAnswers = 0;
let currentRuleIndex = 0;
let ruleTaskCount = 0;
let maxRuleTaskCount = 3; // Default value for how many tasks a rule should be applied
let gameDuration = 9 * 60; // Default 9 minutes in seconds
let totalTasks = 5; // Default number of tasks
let gameInProgress = false;
const rules = [
  {
    description:
      "<span style='color: red;'>Digit 1 </span> is the sum of the numbers (second digit)<br>" +
      "<span style='color: red;'>Digit 2 </span> is the positive difference",
    func: rule1,
  },
  {
    description:
      "<span style='color: red;'>Digit 1 </span> is number 1 multiplied by 2<br>" +
      "<span style='color: red;'>Digit 2 </span> is the absolute difference",
    func: rule2,
  },
  {
    description:
      "<span style='color: red;'>Digit 1</span> is number 1 mod 3<br>" +
      "<span style='color: red;'>Digit 2</span> is (number 1 mod number 2)",
    func: rule3,
  },
  {
    description:
      "<span style='color: red;'>Digit 1</span> is the sum of the numbers<br>" +
      "<span style='color: red;'>Digit 2</span> is number 2 times 2",
    func: rule4,
  },
];

function displayRule(index) {
  const ruleContainer = document.getElementById("ruleDisplay");
  ruleContainer.innerHTML = rules[index].description;
}

function getRandomNumbers() {
  return {
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10),
  };
}

function generateNumbers() {
  return Array.from({ length: totalTasks }, () => getRandomNumbers());
}

let numbers = generateNumbers(); // Generate numbers initially

function setGameDuration() {
  const durationInput = document.getElementById("game-duration").value;
  gameDuration = parseInt(durationInput) * 1;
  timeLeft = gameDuration;
  updateTimerDisplay();
}

function setRuleDuration() {
  const ruleInput = document.getElementById("rule-duration").value;
  maxRuleTaskCount = parseInt(ruleInput);
  ruleTaskCount = 0;
}

function setTotalTasks() {
  const totalTasksInput = document.getElementById("total-tasks").value;
  totalTasks = parseInt(totalTasksInput);
  numbers = generateNumbers(); // Regenerate numbers when total tasks change
}

function startTimer() {
  const timerInterval = setInterval(function () {
    if (timeLeft <= 0 || currentTask >= totalTasks) {
      clearInterval(timerInterval);
      showResult();
      return;
    }
    timeLeft--;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent = `${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function addToInput(num) {
  const inputField = document.getElementById("answer");
  inputField.value += num;
}

function clearInput() {
  document.getElementById("answer").value = "";
  document.getElementById("correct-answer").textContent = "";
}

function submitAnswer() {
  if (!gameInProgress) return; // If the game hasn't started, do nothing.

  const inputField = document.getElementById("answer").value;
  const correctAnswer = rules[currentRuleIndex]
    .func(numbers[currentTask].num1, numbers[currentTask].num2)
    .toString(); // Ensure correctAnswer is a string for comparison

  if (inputField === correctAnswer) {
    correctAnswers++;
    if (document.getElementById("color-feedback").checked) {
      colorInput("green");
    }
  } else {
    if (document.getElementById("color-feedback").checked) {
      colorInput("red");
    }
  }

  // Move to the next task regardless of correctness
  nextTask();
  // Display the current rule again
  displayRule(currentRuleIndex);
}

function nextTask() {
  currentTask++;
  console.log(currentTask);
  if (currentTask >= totalTasks) {
    showResult();
    return;
  }

  // Switch rule if needed
  ruleTaskCount++;
  if (ruleTaskCount >= maxRuleTaskCount) {
    currentRuleIndex = (currentRuleIndex + 1) % rules.length;
    ruleTaskCount = 0;
  }

  clearInput();
  numbers = generateNumbers(); // Generate numbers at the start of the game

  displayRule(currentRuleIndex);

  document.getElementById("numbers").classList.remove("hidden");
  document.getElementById("start-game").disabled = true; // Start button disabled

  document.getElementById(
    "numbers"
  ).textContent = `${numbers[currentTask].num1} - ${numbers[currentTask].num2}`;
}

function colorInput(color) {
  const inputField = document.getElementById("answer");
  inputField.style.backgroundColor = color;

  setTimeout(() => {
    inputField.style.backgroundColor = ""; // Visszaállítjuk az eredeti háttérszínt 1 másodperc után
  }, 1000); // 1 másodperces késleltetés
}

function rule1(num1, num2) {
  // Számjegyek kiszámítása
  let digit1 = num1 + num2;
  const digit2 = Math.abs(num1 - num2);

  // Ha digit1 két számjegyű, csak a második számjegyet tartjuk meg
  if (digit1 >= 10) {
    digit1 = digit1 % 10; // A maradékos osztás segítségével megtartjuk a második számjegyet
  }

  return `${digit1}${digit2}`;
}

function rule2(num1, num2) {
  const digit1 = num1 * 2;
  const digit2 = Math.abs(num1 - num2);
  return `${digit1}${digit2}`;
}

function rule3(num1, num2) {
  const digit1 = num1 % 3;
  const digit2 = num2 !== 0 ? num1 % num2 : 0; // Avoid division by zero
  return `${digit1}${digit2}`;
}

function rule4(num1, num2) {
  const digit1 = num1 + num2;
  const digit2 = num2 * 2;
  return `${digit1}${digit2}`;
}

function startGame() {
  currentTask = 0;
  correctAnswers = 0;
  currentRuleIndex = 0;
  ruleTaskCount = 0;
  timeLeft = gameDuration;
  gameInProgress = true;
  numbers = generateNumbers(); // Generate numbers at the start of the game
  clearInput();
  document.getElementById("result").textContent = ``;

  displayRule(currentRuleIndex);

  document.getElementById("numbers").classList.remove("hidden");
  document.getElementById("start-game").disabled = true; // Start button disabled

  document.getElementById(
    "numbers"
  ).textContent = `${numbers[currentTask].num1} - ${numbers[currentTask].num2}`;

  startTimer();
}

function showResult() {
  document.getElementById(
    "result"
  ).textContent = `Game over! You got ${correctAnswers} out of ${currentTask} correct!`;
  document.getElementById("start-game").disabled = false; // Re-enable start button
  gameInProgress = false;
}

// Információs ikon esemény kezelése
document.getElementById("info-icon").addEventListener("click", () => {
  const rulesContainer = document.getElementById("rules-container");
  // Ellenőrizzük, hogy a szabálykönyv látható-e
  if (rulesContainer.style.display === "none") {
    rulesContainer.style.display = "block"; // Megjelenítjük
  } else {
    rulesContainer.style.display = "none"; // Elrejtjük
  }
});

// Bezáró gomb esemény kezelése
document.getElementById("close-rules").addEventListener("click", () => {
  document.getElementById("rules-container").style.display = "none"; // Bezárjuk a szabálykönyvet
});
