let metadata = localStorage.getItem("metadata");

let generatedVerse = document.getElementById("randomVerse");
let randomCitation = document.getElementById("randomCitation");

let verseOfTheDay = JSON.parse(localStorage.getItem("verse"));
displayVerse(verseOfTheDay.randomVerse);

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
		displayVerse(data);
	} catch (error) {
		console.log("Random Verse:", error.message);
	}
}

// When I press the Get Random Verse Button
// randomVerse(metadata);
