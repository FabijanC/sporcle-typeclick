function normalizeText(text) {
  return text
    .toLowerCase()
    .split("")
    .filter((c) => /[A-Za-z0-9]/.test(c))
    .join("");
}

/**
 * Basically green color is correct, yellow is selected. The latter is possible in clickable quizzes
 * with two-side matching.
 */
function isAnswerMarkedAsCorrectOrSelected(el) {
  const classList = el.classList;
  return (
    classList.contains("answer") &&
    (classList.contains("right") || classList.contains("highlight"))
  );
}

function displayAll(elements) {
  for (const el of elements) {
    el.style.display = "block";
  }
}

function normalizedTextFromAnswerNode(answerNode) {
  const text = answerNode.innerText ?? answerNode.children[0].innerText;
  return normalizeText(text);
}

/**
 * Defines custom buttons and inputs.
 * Sporcle's script prevents default mousedown behavior on elements in questionbox, so we define a
 * new element that will hold the new input and move the Prev and Next buttons inside it for easier
 * tab navigation. If said buttons don't exist, inserts the input above answers.
 */
function insertControlBox() {
  const controlBox = document.createElement("div");
  controlBox.id = "controlbox";
  controlBox.style = "display: flex; justify-content: center; margin: 5px;";

  const prevButton = document.getElementById("pickprev");
  const nextButton = document.getElementById("picknext");

  const customInput = document.createElement("input");
  customInput.id = "typeclick-input";
  customInput.style = "margin: 0 5px; font-size: 2rem";

  if (prevButton) {
    controlBox.insertAdjacentElement("beforeend", prevButton);
    controlBox.insertAdjacentElement("beforeend", customInput);
    controlBox.insertAdjacentElement("beforeend", nextButton);

    prevButton.onclick = nextButton.onclick = () => {
      customInput.focus();
    };
  } else {
    controlBox.insertAdjacentElement("beforeend", customInput);
  }

  const answers = document.getElementsByClassName("answer");
  customInput.addEventListener("keyup", function (event) {
    const currentInputValue = normalizeText(this.value);

    if (!currentInputValue) {
      displayAll(answers);
      return;
    }

    const filteredAnswers = [];
    for (const answer of answers) {
      const answerText = normalizedTextFromAnswerNode(answer);
      if (
        answerText.indexOf(currentInputValue) !== -1 &&
        !isAnswerMarkedAsCorrectOrSelected(answer)
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
          const answerText = normalizedTextFromAnswerNode(answer);
          if (currentInputValue === answerText) {
            selectedAnswer = answer;
          }
        }
      }

      if (selectedAnswer) {
        selectedAnswer.click();
        if (isAnswerMarkedAsCorrectOrSelected(selectedAnswer)) {
          this.value = "";
          // Not excluding used answers because there are answer-reusable clickable quizzes
          displayAll(answers);
        }
      }
    }
  });

  const answerBox = document.getElementById("answerbox");
  answerBox.parentNode.insertBefore(controlBox, answerBox);
  customInput.focus();
}

// Inject input box
const playButton = document.getElementById("button-play");
playButton.addEventListener("click", () => {
  const breadcrumbBar = document.getElementById("breadcrumb-bar");
  let isClickable = false;
  for (eligibleType of ["clickable", "multiplechoice"]) {
    const pattern = `a[href="/type/${eligibleType}"]`;
    if (breadcrumbBar.querySelector(pattern)) {
      isClickable = true;
      break;
    }
  }

  if (!isClickable) {
    console.log("Quiz not clickable");
    return;
  }

  insertControlBox();
});
