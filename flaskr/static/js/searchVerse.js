let langInput = "en";
let bibleVersionInput = "NEW KING JAMES VERSION";
let bookInput = "Genesis";
let chapterInput = "1";
let startingVerse = "1";
let endingVerse = "";
let metadata = { lang: langInput, bibleVersion: bibleVersionInput };

let bibleRequestInfo = {
	lang: langInput,
	bibleVersion: bibleVersionInput,
	book: bookInput,
	chapter: chapterInput,
	startingVerse: startingVerse,
	endingVerse: endingVerse,
};

async function getBookInfo() {
	try {
		let response = await fetch("/api/getBookList", {
			method: "GET",
		});

		let data = await response.json();

		let container = document.getElementById("book");

		data.sortedBooks.forEach((book) => {
			console.log(book);
			let option = document.createElement("option");
			option.value = book.toLowerCase();
			option.textContent = book;
			container.appendChild(option);
		});

		if (!response.ok) throw error;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

getBookInfo();

async function searchRequest(requestInfo) {
	try {
		let response = await fetch("/searchVerse", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestInfo),
		});

		let data = await response.json();

		console.log(data);

		if (!response.ok) throw error;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

// Only fetch when search for a verse from a dropdown menu
// searchRequest(bibleRequestInfo);

async function randomVerse(metadata) {
	try {
		let res = await fetch("/api/randomverse", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(metadata),
		});

		let data = await res.json();
		console.log(data);
	} catch (error) {
		console.log("Random Verse", error.message);
	}
}

// When I press the Get Random Verse Button
// randomVerse(metadata);
