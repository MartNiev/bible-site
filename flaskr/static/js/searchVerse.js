let langInput = "en";
let bibleVersionInput = "NEW KING JAMES VERSION";
// let bookInput = "Genesis";
// let chapterInput = "1";
// let startingVerse = "1";
// let endingVerse = "";
let metadata = { lang: langInput, bibleVersion: bibleVersionInput };

let bibleRequestInfo = {
	lang: langInput,
	bibleVersion: bibleVersionInput,
	book: "",
	chapter: "",
	startingVerse: "",
	endingVerse: "",
};

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

function createOptions(amount, container) {
	for (let i = 1; i <= amount; i++) {
		let option = document.createElement("option");
		option.value = i;
		option.textContent = i;
		container.appendChild(option);
	}
}

async function onBookChange() {
	let dropdown = document.getElementById("book");

	let chapterDropdown = document.getElementById("chapter").replaceChildren();
	let verseDropdown = document.getElementById("verse").replaceChildren();

	bibleRequestInfo.book = dropdown.value;

	let requestObject = {
		lang: langInput,
		bibleVersion: bibleVersionInput,
		book: dropdown.value,
		searchFor: "chapter",
	};

	let chapterContainer = document.getElementById("chapter");
	let chapterAmount = await requestBookData(requestObject);
	createOptions(chapterAmount.AmountOfChapters, chapterContainer);

	requestObject.chapter = "1";
	requestObject.searchFor = "verse";

	bibleRequestInfo.chapter = "1";
	bibleRequestInfo.startingVerse = "1";

	let verseContainer = document.getElementById("verse");
	let verseAmount = await requestBookData(requestObject);
	createOptions(verseAmount.AmountOfVerses, verseContainer);
}

async function onChapterChange() {
	let dropdown = document.getElementById("chapter");

	let verseDropdown = document.getElementById("verse").replaceChildren();

	bibleRequestInfo.chapter = dropdown.value;

	let requestObject = {
		lang: langInput,
		bibleVersion: bibleVersionInput,
		book: bibleRequestInfo.book,
		chapter: dropdown.value,
		searchFor: "verse",
	};

	let verseContainer = document.getElementById("verse");
	let amount = await requestBookData(requestObject);
	createOptions(amount.AmountOfVerses, verseContainer);

	let endingVerseContainer = document.getElementById("endingVerse");
	if (endingVerseContainer !== null) {
		createOptions(amount.AmountOfVerses, endingVerseContainer);
	}
}

function onVerseChange() {
	let dropdown = document.getElementById("verse");

	bibleRequestInfo.startingVerse = dropdown.value;
}

function onEndingVerseChange() {
	let dropdown = document.getElementById("endingVerse");

	bibleRequestInfo.endingVerse = dropdown.value;
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

		let formattedString = "";
		for (const key in data) {
			formattedString += `${key}. ${data[key]} \n`;
		}

		console.log(formattedString);

		resultElem.textContent = formattedString;

		if (!response.ok) throw error;
	} catch (error) {
		console.log("Error in searchRequest:", error.message);
	}
}

function handleSearch(option) {
	searchRequest(bibleRequestInfo);
}

const checkbox = document.getElementById("multiple");

checkbox.addEventListener("change", function () {
	let dropdown = document.getElementById("searchInput");

	if (this.checked) {
		var selectElement = document.createElement("select");
		selectElement.name = "endingVerse";
		selectElement.id = "endingVerse";
		selectElement.className = "dropdown";
		selectElement.setAttribute("onchange", "onEndingVerseChange()");

		let span = document.createElement("span");
		span.id = "dash";
		span.textContent = " - ";

		dropdown.appendChild(span);
		dropdown.appendChild(selectElement);
	} else {
		document.getElementById("endingVerse").remove();
		document.getElementById("dash").remove();
		bibleRequestInfo.endingVerse = "";
		console.log(bibleRequestInfo);
	}

	onChapterChange("chapter");
});
