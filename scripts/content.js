function normalizeText(text) {
  return text
    .toLowerCase()
    .split("")
    .filter((c) => /[A-Za-z0-9]/.test(c))
    .join("");
}

function isAnswerMarkedAsCorrect(el) {
  return el.classList.contains("answer") && el.classList.contains("right");
}

function displayAll(elements) {
  for (const el of elements) {
    el.style.display = "block";
  }
}

// Define custom buttons and inputs.
// Sporcle's script prevents default mousedown behavior on elements in questionbox,
// so we define a new element that will hold the new input,
// and move the Prev and Next buttons inside it for easier tab navigation
const playGameBox = document.getElementById("playGameBox");
const answers = document.getElementsByClassName("answer");

const controlBox = document.createElement("div");
controlBox.id = "controlbox";
controlBox.style = "display: flex; justify-content: center;";

const prevButton = document.getElementById("pickprev");
const nextButton = document.getElementById("picknext");

controlBox.insertAdjacentElement("afterbegin", prevButton);

const customInput = document.createElement("input");
customInput.id = "typeclick-input";
customInput.style = "margin: 0 5px;";

controlBox.insertAdjacentElement("afterbegin", customInput);
controlBox.insertAdjacentElement("afterbegin", nextButton);

customInput.addEventListener("keyup", function (event) {
  const currentInputValue = normalizeText(this.value);

  if (!currentInputValue) {
    displayAll(answers);
    return;
  }

  const filteredAnswers = [];
  for (const answer of answers) {
    const answerText = normalizeText(answer.children[0].innerText);
    if (
      answerText.indexOf(currentInputValue) !== -1 &&
      !isAnswerMarkedAsCorrect(answer)
    ) {
      // TODO Add highlighting of matched text
      filteredAnswers.push(answer);
    } else {
      answer.style.display = "none";
    }
  }

  // Not displaying answers marked as correct to avoid confusion about what is selected with Enter
  displayAll(filteredAnswers);

  if (event.key === "Enter") {
    let selectedAnswer = undefined;
    if (filteredAnswers.length === 1) {
      selectedAnswer = filteredAnswers[0];
    } else if (filteredAnswers.length > 1) {
      // if multiple same answers (this is possible), the last one is clicked
      for (const answer of answers) {
        if (currentInputValue === normalizeText(answer.children[0].innerText)) {
          selectedAnswer = answer;
        }
      }
    }

    if (selectedAnswer) {
      selectedAnswer.click();
      if (isAnswerMarkedAsCorrect(selectedAnswer)) {
        this.value = "";
        // Not excluding used answers because there are answer-reusable clickable quizzes
        displayAll(answers);
      }
    }
  }
});

// inject input box
const playButton = document.getElementById("button-play");
playButton.addEventListener("click", () => {
  const quizDetails = document.getElementById("quiz-details");
  const isClickable = Array.from(quizDetails.querySelectorAll("span")).find(
    (el) => el.textContent.toLowerCase().indexOf("clickable") !== -1
  );

  if (!isClickable) {
    return;
  }

  // TODO also check if answer boxes even contain searchable text (or are just images)
  document
    .getElementById("questionbox")
    .insertAdjacentElement("afterend", controlBox);
});
