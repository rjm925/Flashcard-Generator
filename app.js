var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");
var basic = [];
var cloze = [];

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
					cloze.push(card);
					fs.writeFile("cloze.txt", JSON.stringify(cloze, null, 2));
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
	fs.readFile("basic.txt", "utf8", function(err, data) {
		dataArr = JSON.parse(data);
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
					if (response.answer === dataArr[card].back) {
						console.log("Correct!");
					}
					else {
						console.log("Incorrect!");
					}

					card++;

					if (card < dataArr.length) {
						ask();
					}
				})
		}

		ask();
	})
}

function clozeTest() {
	fs.readFile("cloze.txt", "utf8", function(err, data) {
		dataArr = JSON.parse(data);
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
					if (response.answer === dataArr[card].cloze) {
						console.log("Correct!");
					}
					else {
						console.log("Incorrect!");
					}

					card++;

					if (card < dataArr.length) {
						ask();
					}
				})
		}

		ask();
	})
}

create();