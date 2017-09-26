function ClozeCard(text, cloze) {
	this.cloze = cloze;
	this.fullText = text;

	if(text.includes(cloze)) {
		this.partial = text.replace(cloze, "...");
	}
	else {
		console.log("Error: '" + cloze + "' does not appear in '" + text + "'");
	}
}

module.exports = ClozeCard;