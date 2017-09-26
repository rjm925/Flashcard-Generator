var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require("inquirer");

inquirer
	.prompt([
		{
			type: "list",
			message: "Would you like to create a basic or cloze card?",
			choices: ["Basic", "Cloze"],
			name: "type"
		},
	])
	.then(function(card) {
		if (card.type === "Basic") {
			inquirer
				.prompt([
					{
						type: "input",
						message: "What is the question?",
						name: "question"
					},
					{
						type: "input",
						message: "What is the answer?",
						name: "answer"
					}
				])
				.then(function(setup) {
					var card = new BasicCard(setup.question, setup.answer);
				});
		}
		else {
			inquirer
				.prompt([
					{
						type: "input",
						message: "What is the full text?",
						name: "text"
					},
					{
						type: "input",
						message: "What is the cloze word(s)?",
						name: "cloze"
					}
				])
				.then(function(setup) {
					var card = new ClozeCard(setup.text, setup.cloze);
				});
		}
	});