var BasicCard = require("./BasicCard.js");	//Calls for basic card constructor
var ClozeCard = require("./ClozeCard.js");	//Calls for cloze card constructor
var inquirer = require("inquirer");					//Calls inquirer package
var fs = require("fs");											//Calls fs package
var basic = [];															//Array to hold basic cards
var cloze = [];															//Array to hold cloze cards

//Read basic.txt file
fs.readFile("basic.txt", "utf8", function(err, data) {
	//If file exists
	if (!err) {
		//Parses data inside file
		basic = JSON.parse(data);
		//Updates basic array with content inside file
		return basic;
	}
});

//Read cloze.txt file
fs.readFile("cloze.txt", "utf8", function(err, data) {
	//If file exists
	if (!err) {
		//Parses data inside file
		cloze = JSON.parse(data);
		//Updates cloze array with content inside file
		return cloze;
	}	
});

//Prompts user to create a card, study, or exit
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

//Prompts user what type of card they would like to create
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
					//Creates a basic card
					var card = new BasicCard(setup.question, setup.answer);
					//Add card to basic array
					basic.push(card);
					//Updates basic.txt
					fs.writeFile("basic.txt", JSON.stringify(basic, null, 2));
					//Asks user if they want to create another card
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
					//Creates a cloze card
					var card = new ClozeCard(setup.text, setup.cloze);

					//Checks if text contains cloze
					if (setup.text.includes(setup.cloze)) {
						//Add card to cloze array
						cloze.push(card);
						//Updates cloze.txt file
						fs.writeFile("cloze.txt", JSON.stringify(cloze, null, 2));
					}
					
					//Asks user if they want to create another card
					another();
				});
		}
	});
}

//Prompts user to create another card
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

//Prompts user if they want to study the cards
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

//Prompts user which cards they would like to study
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

//Goes through basic cards
function basicTest() {
	//Initialize score
	var correct = 0;
	var incorrect = 0;

	//Read file for questions
	fs.readFile("basic.txt", "utf8", function(err, data) {
		//Check if file exists
		if (!err) {
			//Holds the data
			dataArr = JSON.parse(data);
			//Randomizes the question
			randomize(dataArr);
			//Counter for cards
			card = 0;

			//Prompts the question
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
						//User input is case-insensitive
						if (response.answer.toUpperCase() === dataArr[card].back.toUpperCase()) {
							console.log("Correct!\n");
							correct++;
						}
						else {
							console.log("Incorrect! Answer: " + dataArr[card].back + "\n");
							incorrect++;
						}

						card++;

						//Checks if all cards have been asked
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

			//Starts the quiz
			ask();
		}
		//If file does not exist
		else {
			console.log("Deck is empty.");
			start();
		}		
	})
}

//Goes through cloze cards
function clozeTest() {
	//Initialize score
	var correct = 0;
	var incorrect = 0;

	//Read file for questions
	fs.readFile("cloze.txt", "utf8", function(err, data) {
		//Check if file exists
		if (!err) {
			//Holds the data
			dataArr = JSON.parse(data);
			//Randomizes the questions
			randomize(dataArr);	
			//Counter for cards	
			card = 0;

			//Prompts the question
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
						//User input is case-insensitive
						if (response.answer.toUpperCase() === dataArr[card].cloze.toUpperCase()) {
							console.log("Correct!\n");
							correct++;
						}
						else {
							console.log("Incorrect! Answer: " + dataArr[card].cloze + "\n");
							incorrect++;
						}

						card++;

						//Checks if all cards have been asked
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

			//Starts the quiz
			ask();
		}
		//If file does not exist
		else {
			console.log("Deck is empty");
			start();
		}
	})
}

//Randomizes the cards
function randomize(array) {
	//Counter variable
	var i = 0;

	//Continue for length iterations
	while (i < array.length) {
		//Random index numbers
		num1 = Math.floor(Math.random() * array.length);
		num2 = Math.floor(Math.random() * array.length);

		//Holds card info
		tmp = array[num1];
		//Move num2 data into num1
		array[num1] = array[num2];
		//Move num1 data into num2
		array[num2] = tmp;

		i++;
	}

	//Updates array
	return array;
}

//Initiate program
start();