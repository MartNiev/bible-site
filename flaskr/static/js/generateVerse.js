let langInput = "en";
let bibleVersionInput = "NEW KING JAMES VERSION";
// let bookInput = "Genesis";
// let chapterInput = "1";
// let startingVerse = "1";
// let endingVerse = "";
let metadata = { lang: langInput, bibleVersion: bibleVersionInput };

let generatedVerse = document.getElementById("randomVerse");
let randomCitation = document.getElementById("randomCitation");

let verseOfTheDay = JSON.parse(localStorage.getItem("verse"));

function display(data) {
	generatedVerse.textContent = `"${data.randomVerse.content}"`;
	randomCitation.textContent = `${data.randomVerse.book} ${data.randomVerse.chapter}:${data.randomVerse.verse}`;
}

display(verseOfTheDay);

function displayVerse(data) {
	generatedVerse.textContent = `"${data.content}"`;
	randomCitation.textContent = `${data.book} ${data.chapter}:${data.verse}`;
}

async function randomVerse() {
	try {
		let res = await fetch("/api/randomverse", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(metadata),
		});

		let data = await res.json();
		console.log(data);
		displayVerse(data);
	} catch (error) {
		console.log("Random Verse:", error.message);
	}
}

// When I press the Get Random Verse Button
// randomVerse(metadata);
