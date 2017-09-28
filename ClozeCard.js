//Constructor for cloze cards
function ClozeCard(text, cloze) {
	//Answer
	this.cloze = cloze;
	//Full sentence
	this.fullText = text;

	//If answer is in full sentence
	if(text.includes(cloze)) {
		//Removes the answer from the full sentence and replaces with ...
		this.partial = text.replace(cloze, "...");
	}
	//If cloze phrase is not in full sentence
	else {
		//Tells the user there was an error
		console.log("Error: '" + cloze + "' does not appear in '" + text + "'");
	}
}

//Exports constructor
module.exports = ClozeCard;