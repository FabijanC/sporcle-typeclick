function normalizeText(text) {
  return text
    .toLowerCase()
    .split("")
    .filter((c) => /[A-Za-z0-9]/.test(c))
    .join("");
}

function isAnswerMarkedAsCorrect(answer) {
  return (
    answer.classList.contains("answer") && answer.classList.contains("right")
  );
}

const playGameBox = document.getElementById("playGameBox");
// TODO perhaps wrap input in a div
const answers = document.getElementsByClassName("answer");

const customInput = document.createElement("input");
customInput.addEventListener("keyup", function (event) {
  const currentInputValue = normalizeText(this.value);

  if (!currentInputValue) {
    for (const answer of answers) {
      answer.style.display = "block";
    }
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
      // Not displaying answers marked as correct to avoid confusion about what is selected with Enter
      answer.style.display = "block";
      filteredAnswers.push(answer);
    } else {
      answer.style.display = "none";
    }
  }

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
        for (const answer of answers) {
          answer.style.display = "block";
        }
      }

      // Not excluding used answers because there are answer-reusable clickable quizzes
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
  playGameBox.insertAdjacentElement("beforeend", customInput);
});
