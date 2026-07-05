let verseElement = document.getElementById("verseOftheDay");
let citationElement = document.getElementById("citation");
let cachedVerse = JSON.parse(localStorage.getItem("verse"));

function displayVerse(data) {
	verseElement.textContent = `"${data.randomVerse.content}"`;
	citationElement.textContent = `${data.randomVerse.book} ${data.randomVerse.chapter}:${data.randomVerse.verse}`;
}

async function verseOfTheDay(metadata) {
	try {
		let res = await fetch("/api/verseOfTheDay", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(metadata),
		});

		let data = await res.json();

		if (!cachedVerse) {
			localStorage.setItem("verse", JSON.stringify(data));
		}

		if (cachedVerse !== JSON.stringify(data)) {
			localStorage.setItem("verse", JSON.stringify(data));
		}
		displayVerse(data);
	} catch (error) {
		console.log("Verse of the Day:", error.message);
	}
}

let date = new Date();
let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

if (!cachedVerse || cachedVerse.dateChosen !== formattedDate) {
	verseOfTheDay(metadata);
} else {
	displayVerse(cachedVerse);
}
