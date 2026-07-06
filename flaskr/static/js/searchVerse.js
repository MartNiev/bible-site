let langInput = "en";
let bibleVersionInput = "NEW KING JAMES VERSION";
// let bookInput = "Genesis";
// let chapterInput = "1";
// let startingVerse = "1";
let endingVerse = "";
let metadata = { lang: langInput, bibleVersion: bibleVersionInput };

async function getBookInfo() {
	try {
		let response = await fetch("/api/getBookList", {
			method: "GET",
		});

		let data = await response.json();

		let container = document.getElementById("book");

		data.sortedBooks.forEach((book) => {
			let option = document.createElement("option");
			option.value = book;
			option.textContent = book;
			container.appendChild(option);
		});

		if (!response.ok) throw error;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

getBookInfo();

async function requestBookData(requestInfo) {
	try {
		let response = await fetch("/api/searchLength", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestInfo),
		});

		let data = await response.json();

		return data;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

let bibleRequestInfo = {
	lang: langInput,
	bibleVersion: bibleVersionInput,
	book: "",
	chapter: "",
	startingVerse: "",
	endingVerse: endingVerse,
};

function createOptions(amount, container) {
	for (let i = 1; i <= amount; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.textContent = i;
		container.appendChild(option);
	}
}

async function chapterAmount(option) {
	let dropdown = document.getElementById(option);

	bibleRequestInfo.book = dropdown.value;

	let requestObject = {
		lang: langInput,
		bibleVersion: bibleVersionInput,
		book: dropdown.value,
		option: option,
	};

	let container = document.getElementById("chapter");
	let amount = await requestBookData(requestObject);
	createOptions(amount.AmountOfChapters, container);
}

async function verseAmount(option) {
	let dropdown = document.getElementById(option);

	bibleRequestInfo.chapter = dropdown.value;

	let requestObject = {
		lang: langInput,
		bibleVersion: bibleVersionInput,
		book: bibleRequestInfo.book,
		chapter: dropdown.value,
		option: option,
	};

	let container = document.getElementById("verse");
	let amount = await requestBookData(requestObject);
	createOptions(amount.AmountOfVerses, container);
}

async function searchRequest(requestInfo) {
	try {
		let response = await fetch("/searchVerse", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestInfo),
		});

		let data = await response.json();

		let resultElem = document.getElementById("searchResult");
		resultElem.textContent = data;
		console.log(data);

		if (!response.ok) throw error;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

function handleSearch(option) {
	let dropdown = document.getElementById(option);

	bibleRequestInfo.startingVerse = dropdown.value;

	searchRequest(bibleRequestInfo);
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
