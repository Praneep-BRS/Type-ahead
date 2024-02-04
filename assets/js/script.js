import { data } from "./data.js";

const input = document.getElementById("input");
const suggestions = document.getElementById("suggestions");
const inputClearBtn = document.getElementById("input-clear-button");

input.addEventListener("input", handleInputChange);
inputClearBtn.addEventListener("click", clearInput);

function handleInputChange(e) {
  const inputText = e.target.value.trim().toLowerCase();
  if (inputText === "") suggestions.innerHTML = "";
  toggleClearButtonOpacity(inputText);
  updateSuggestions(inputText);
}

function clearInput() {
  input.value = "";
  inputClearBtn.style.opacity = 0;
  inputClearBtn.style.pointerEvents = "none";
  suggestions.innerHTML = "";
}

function toggleClearButtonOpacity(text) {
  const opacity = text.length > 0 ? 1 : 0;
  inputClearBtn.style.opacity = opacity;
  inputClearBtn.style.pointerEvents = opacity ? "all" : "none";
}

function updateSuggestions(inputText) {
  const markup = data
    .filter((census) =>
      census
        ? census.city.toLowerCase().startsWith(inputText) ||
          census.state.toLowerCase().startsWith(inputText)
        : false,
    )
    .map((census) => {
      const cityBoldString = getBoldString(census.city, inputText);
      const stateBoldString = getBoldString(census.state, inputText);

      return `<div class='list'><h3>${cityBoldString}, ${stateBoldString}</h3><p>${addCommasToInteger(
        census.population,
      )}</p></div>`;
    });
  suggestions.innerHTML =
    markup.length > 0
      ? markup.join("")
      : "<div class='list'>No match found</div>";
}

function getBoldString(str, inputText) {
  /*const boldArray = Array.from(str).map((char, i) => {
    const matching =
      i < inputText.length && char.toLowerCase() === inputText[i];
    return matching ? `<span>${char}</span>` : char;
  });
  return boldArray.join("");*/
  const matchingSubString = getMatchingSubString(str, inputText);
  return matchingSubString
    ? str.replace(matchingSubString, `<span>${matchingSubString}</span>`)
    : str;
}

function getMatchingSubString(str, inputText) {
  const length = Math.min(str.length, inputText.length);
  const index = Array.from({ length }).findIndex(
    (_, i) => str[i].toLowerCase() !== inputText[i],
  );
  return index !== -1 ? str.substring(0, index) : str.substring(0, length);
}

function addCommasToInteger(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setTheme(theme) {
  document.documentElement.style.setProperty("--primary-color", theme);
  localStorage.setItem("movie-theme", theme);
}

setTheme(localStorage.getItem("movie-theme") || chathams_blue);
