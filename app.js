import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

// DATA
const csvFile = "./data/mushrooms.csv";
const trainingLabel = "class";
const ignored = ["population"];

// load csv data as json
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => trainModel(results.data),
  });
}

// MACHINE LEARNING - Decision Tree
function trainModel(data) {
  data.sort(() => Math.random() - 0.5);
  // todo: splits data in traindata en testdata
  const trainData = data.slice(0, Math.floor(data.length * 0.8));
  const testData = data.slice(Math.floor(data.length * 0.8) + 1);
  console.log(testData);

  // make algorithm
  let decisionTree = new DecisionTree({
    ignoredAttributes: ["class"],
    trainingSet: trainData,
    categoryAttr: trainingLabel,
  });

  let json = decisionTree.stringify();
  console.log(json);

  // Teken de decision tree -- node, breedte, hoogte, decision tree
  let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());

  const amountCorrectTotal = [];
  const amountTotal = [];

  let amountCorrectP = 0;
  let amountCorrectE = 0;
  let amountIncorrectE = 0;
  let amountIncorrectP = 0;

  // todo: schrijf een for-loop waarin je alle rijen uit de testdata haalt
  for (let mushroom of testData) {
    const mushroomWithoutClass = { ...mushroom };
    delete mushroomWithoutClass.class;

    let mushroomPrediction = decisionTree.predict(mushroomWithoutClass);
    amountTotal.push(mushroomPrediction);
    console.log(`Mushroom label ${mushroom.class} predicted ${mushroomPrediction}`);
    console.log(`Correct prediction!`);

    if (mushroom.class == mushroomPrediction) {
      amountCorrectTotal.push(mushroomPrediction);
      if (mushroom.class == "e" && mushroomPrediction == "e") {
        amountCorrectE++;
      }

      if (mushroom.class == "p" && mushroomPrediction == "p") {
        amountCorrectP++;
      }
    } else {
      console.log(`Incorrect prediction!`);

      if (mushroom.class == "e" && mushroomPrediction == "p") {
        amountIncorrectE++;
      }

      if (mushroom.class == "p" && mushroomPrediction == "e") {
        amountIncorrectP++;
      }
    }
  }

  // todo: bereken de accuracy met behulp van alle testdata
  let accuracy = document.getElementById("accuracy");
  let roundedAccuracy = Math.round((amountCorrectTotal.length / amountTotal.length) * 100);
  accuracy.innerText = `Accuracy = ${roundedAccuracy}%`;

  // Confusion matrix
  let correctEdible = document.getElementById(`correctE`);
  let incorrectEdible = document.getElementById(`incorrectE`);
  let correctPoisonous = document.getElementById(`correctP`);
  let incorrectPoisonous = document.getElementById(`incorrectP`);

  correctEdible.innerText = `${amountCorrectE}`;
  incorrectEdible.innerText = `${amountIncorrectE}`;
  correctPoisonous.innerText = `${amountCorrectP}`;
  incorrectPoisonous.innerText = `${amountIncorrectP}`;
}

loadData();