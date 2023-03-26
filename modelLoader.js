import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

let inputElement = document.getElementById("poisonous");
let submitButton = document.getElementById("submit-button");
let personalPrediction = document.getElementById("personal-prediction");
let predictionResult = document.getElementById("prediction-result");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!inputElement.value) {
    alert("Please type something in the input field");
  } else {
    loadSavedModel(inputElement.value);
  }
});

function loadSavedModel(value) {
  fetch("./model.json")
    .then((response) => response.json())
    .then((model) => modelLoaded(model, value));
}

function modelLoaded(model, value) {
  let decisionTree = new DecisionTree(model);
  let mushroom = { class: value, bruises: "w", population: "s" };
  let prediction = decisionTree.predict(mushroom);

  if (value == "p") {
    personalPrediction.innerText = `You predicited; poisonous`;
    predictionResult.innerText = `Prediction; ${prediction}`;
  }
  if (value == "e") {
    personalPrediction.innerText = `You predicited; edible`;
    predictionResult.innerText = `Prediction; ${prediction}`;
  }
  let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
}

loadSavedModel();
