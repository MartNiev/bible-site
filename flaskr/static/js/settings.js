function saveSettings() {
	let langDropdown = document.getElementById("language");
	let getMetadata = JSON.parse(localStorage.getItem("metadata"));

	if (langDropdown.value !== "en") {
		getMetadata.lang = langDropdown.value;
		getMetadata.bibleVersion = "REINA VALERA 1909";
		// bibleRequestInfo.lang = langDropdown.value;
		// bibleRequestInfo.bibleVersion = "REINA VALERA 1909";

		localStorage.setItem("metadata", JSON.stringify(getMetadata));
	}

	// change the language in the html tag
}
