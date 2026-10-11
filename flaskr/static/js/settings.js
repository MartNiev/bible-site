let getMetadata = JSON.parse(localStorage.getItem("metadata"));
console.log(getMetadata);
let langDropdown = document.getElementById("language");
let versionDropdown = document.getElementById("version");

langDropdown.value = getMetadata.lang;
versionDropdown.children[0].value = getMetadata.bibleVersion;
versionDropdown.children[0].textContent = getMetadata.bibleVersion;
console.log(versionDropdown);

async function verseOfTheDay(metadata) {
	let cachedVerse = JSON.parse(localStorage.getItem("verse"));

	try {
		var res = await fetch("/api/verseOfTheDay", {
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
	} catch (error) {
		console.log("Verse of the Day:", error);
	}
}

function saveSettings() {
	getMetadata.lang = langDropdown.value;
	getMetadata.bibleVersion = versionDropdown.value;
	localStorage.setItem("metadata", JSON.stringify(getMetadata));
	verseOfTheDay(getMetadata);
}

function getVersions() {
	let lang = document.getElementById("language").value;
	let versions = bibleVersionsObj[lang];
	versionDropdown.replaceChildren();

	for (const version of versions) {
		let option = document.createElement("option");
		option.value = version;
		option.textContent = version;
		versionDropdown.appendChild(option);
	}
}

getVersions();
