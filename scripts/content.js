const playGameBox = document.getElementById("playGameBox");
// TODO perhaps wrap input in a div
const answers = document.getElementsByClassName("answer");

const customInput = document.createElement("input");
customInput.addEventListener("keyup", function (event) {
  const currentInputValue = this.value.toLowerCase();

  const filteredAnswers = [];

  for (const answer of answers) {
    const answerText = answer.children[0].innerText.toLowerCase();
    if (!answerText.startsWith(currentInputValue)) {
      answer.style.display = "none";
    } else {
      // TODO add shading of matched text
      answer.style.display = "block";
      filteredAnswers.push(answer);
    }
  }

  // TODO support not pressing enter if complete match
  if (filteredAnswers.length === 1 && event.key === "Enter") {
    const onlyAnswer = filteredAnswers[0];
    // TODO don't do anything if answer already used
    onlyAnswer.click();
    if (onlyAnswer.className === "answer right") {
      this.value = "";
      for (const answer of answers) {
        answer.style.display = "block";
      }
    }
  }
});

// inject input box
const playButton = document.getElementById("button-play");
playButton.addEventListener("click", () => {
  const quizDetails = document.getElementById("quiz-details");
  const isClickable = Array.from(quizDetails.querySelectorAll("span")).find(
    (el) => el.textContent.toLowerCase().indexOf("clickable") != -1
  );

  if (!isClickable) {
    return;
  }

  // TODO also check if answer boxes even contain searchable text (or are just images)
  playGameBox.insertAdjacentElement("beforeend", customInput);
});
