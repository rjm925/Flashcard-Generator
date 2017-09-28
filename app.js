var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");
var basic = [];
var cloze = [];

fs.readFile("basic.txt", "utf8", function(err, data) {
	if (!err) {
		basic = JSON.parse(data);
		return basic;
	}
});

fs.readFile("cloze.txt", "utf8", function(err, data) {
	if (!err) {
		cloze = JSON.parse(data);
		return cloze;
	}	
});

function start() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Would you like to create a card or study?",
				choices: ["Create", "Study", "Exit"],
				name: "action"
			}
		])
		.then(function(response) {
			if (response.action === "Create") {
				create();
			}
			else if (response.action === "Study") {
				deck();
			}
		})
}

function create() {
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
					basic.push(card);
					fs.writeFile("basic.txt", JSON.stringify(basic, null, 2));
					another();
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

					if (setup.text.includes(setup.cloze)) {
						cloze.push(card);
						fs.writeFile("cloze.txt", JSON.stringify(cloze, null, 2));
					}
					
					another();
				});
		}
	});
}

function another() {
	inquirer
		.prompt([
			{
				type: "confirm",
				message: "Create another card?",
				name: "again"
			}
		])
		.then(function(response) {
			if (response.again) {
				create();
			}
			else {
				study();
			}
		})
}

function study() {
	inquirer
		.prompt([
			{
				type: "confirm",
				message: "Would you like to study?",
				name: "test"
			}
		])
		.then(function(response) {
			if (response.test) {
				deck();
			}
		})
}

function deck() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Which cards would you like to study?",
				choices: ["Basic", "Cloze"],
				name: "type"
			}
		])
		.then(function(response) {
			if (response.type === "Basic") {
				basicTest();
			}
			else {
				clozeTest();
			}
		})
}

function basicTest() {
	var correct = 0;
	var incorrect = 0;

	fs.readFile("basic.txt", "utf8", function(err, data) {
		if (!err) {
			dataArr = JSON.parse(data);
			randomize(dataArr);
			card = 0;

			function ask() {
				inquirer
					.prompt([
						{
							type: "input",
							message: dataArr[card].front,
							name: "answer"
						}
					])
					.then(function(response) {
						if (response.answer.toUpperCase() === dataArr[card].back.toUpperCase()) {
							console.log("Correct!\n");
							correct++;
						}
						else {
							console.log("Incorrect! Answer: " + dataArr[card].back + "\n");
							incorrect++;
						}

						card++;

						if (card < dataArr.length) {
							ask();
						}
						else {
							console.log("Correct Answers: " + correct);
							console.log("Incorrect Answers: " + incorrect + "\n");
							start();
						}
					})
			}

			ask();
		}
		else {
			console.log("Deck is empty.");
			start();
		}		
	})
}

function clozeTest() {
	var correct = 0;
	var incorrect = 0;

	fs.readFile("cloze.txt", "utf8", function(err, data) {
		if (!err) {
			dataArr = JSON.parse(data);
			randomize(dataArr);		
			card = 0;

			function ask() {
				inquirer
					.prompt([
						{
							type: "input",
							message: dataArr[card].partial,
							name: "answer"
						}
					])
					.then(function(response) {
						if (response.answer.toUpperCase() === dataArr[card].cloze.toUpperCase()) {
							console.log("Correct!\n");
							correct++;
						}
						else {
							console.log("Incorrect! Answer: " + dataArr[card].cloze + "\n");
							incorrect++;
						}

						card++;

						if (card < dataArr.length) {
							ask();
						}
						else {
							console.log("Correct Answers: " + correct);
							console.log("Incorrect Answers: " + incorrect + "\n");
							start();
						}
					})
			}

			ask();
		}
		else {
			console.log("Deck is empty");
			start();
		}
	})
}

function randomize(array) {
	var i = 0;

	while (i < array.length) {
		num1 = Math.floor(Math.random() * array.length);
		num2 = Math.floor(Math.random() * array.length);

		tmp = array[num1];
		array[num1] = array[num2];
		array[num2] = tmp;

		i++;
	}

	return array;
}

start();