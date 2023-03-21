// array with all the Wordle words
import { wordList } from "./wordlist.js";

const startDate = new Date(2021, 5, 19, 0, 0, 0, 0);
const todayDate = new Date().setHours(0, 0, 0, 0);
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// get word number by comparing date with start date
function getWordNumber(startDate, date = todayDate) {
  const differenceDate = startDate - date;
  const drawNumber = Math.abs(Math.round(differenceDate / 864e5));
  console.log(drawNumber)
  return drawNumber;
}

const drawNumber = getWordNumber(startDate);

// get word from array using list and draw number
function getWord(list, drawNumber) {
  let todaysWord = list[drawNumber];
  return todaysWord;
}

const todaysWord = getWord(wordList, drawNumber);
const yesterdaysWord = getWord(wordList, drawNumber - 1);
const tomorrowsWord = getWord(wordList, drawNumber + 1);

// custom timeout for fetch request
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  return response;
}

// Free Dictionary API
async function getDefinition(whichWord) {
  try {
    let response = await fetchWithTimeout(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${whichWord}`, {
        timeout: 6000
      }
    );
    let data = await response.json();
    let definition = data[0].meanings[0].definitions[0].definition;
    return definition;
  } catch {
    return (definition = "");
  }
}

// Event listeners with function to show answers and add classes
const yesterdayButton = document.getElementById("yesterdays-btn");

yesterdayButton.addEventListener("click", async () => {
  let definitionNode = document.createElement("p");
  let definitionText = document.createTextNode(
    await getDefinition(yesterdaysWord)
  );
  yesterdayButton.textContent = yesterdaysWord;
  definitionNode.appendChild(definitionText);
  yesterdayButton.appendChild(definitionNode);
  yesterdayButton.classList.add(
    "answer-text",
    "animate__animated",
    "animate__wobble"
  );
  definitionNode.classList.add("definition-text");
});

const todayButton = document.getElementById("todays-btn");

todayButton.addEventListener("click", async () => {
  let definitionNode = document.createElement("p");
  let definitionText = document.createTextNode(await getDefinition(todaysWord));
  todayButton.textContent = todaysWord;
  definitionNode.appendChild(definitionText);
  todayButton.appendChild(definitionNode);
  todayButton.classList.add(
    "answer-text-today",
    "animate__animated",
    "animate__wobble"
  );
  definitionNode.classList.add("definition-text");
});

const tomorrowButton = document.getElementById("tomorrows-btn");

tomorrowButton.addEventListener("click", async () => {
  let definitionNode = document.createElement("p");
  let definitionText = document.createTextNode(
    await getDefinition(tomorrowsWord)
  );
  tomorrowButton.textContent = tomorrowsWord;
  tomorrowButton.classList.add(
    "answer-text",
    "animate__animated",
    "animate__wobble"
  );
  definitionNode.appendChild(definitionText);
  tomorrowButton.appendChild(definitionNode);
  definitionNode.classList.add("definition-text");
});

// function to display date in the answer box

function displayDate() {
  const date = new Date();
  document.getElementById("todays-date").textContent = date.toLocaleDateString(
    "en-US",
    options
  );
  date.setDate(date.getDate() - 1);
  document.getElementById("yesterdays-date").textContent =
    date.toLocaleDateString("en-US", options);
  date.setDate(date.getDate() + 2);
  document.getElementById("tommorows-date").textContent =
    date.toLocaleDateString("en-US", options);
}

displayDate();
