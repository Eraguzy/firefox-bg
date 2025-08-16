let searchWrapper = document.getElementById('searchWrapper');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const ul = document.getElementById('suggestions');
let suggestions = [];
let searchIndex = -1;

const form = document.querySelector('form');



searchInput.addEventListener('input', (e) => {
	let query = "https://suggestqueries.google.com/complete/search?client=firefox&q=";
	if (e.target.value != "") {
		query += encodeURIComponent(e.target.value.trim());
	}

	// suggestions request
	const xhr = new XMLHttpRequest(); // fetch() blocked by CORS
	xhr.open("GET", query, true);
	xhr.onload = function () {
		if (xhr.status === 200) {
			const data = JSON.parse(xhr.responseText);

			suggestions = data[1];

			// show/hide suggestions
			if (Array.isArray(suggestions) && suggestions.length > 0) searchWrapper.classList.add('withSuggestions');
			else searchWrapper.classList.remove('withSuggestions');

			ul.innerHTML = '';
			for (let i = 0; i < suggestions.length; i++) {
				const li = document.createElement('li');
				li.id = `suggestion-${i}`; // unique ID for each suggestion
				const divFromLi = document.createElement('div');

				divFromLi.addEventListener('mousedown', () => {
					searchInput.value = suggestions[i];
					searchInput.form.submit();
				});

				divFromLi.textContent = suggestions[i];
				li.appendChild(divFromLi);
				ul.appendChild(li);
			}
		}
	};
	xhr.send();
});


// handle suggestions display
searchInput.addEventListener('focus', () => {
	document.getElementById('suggestions').style.display = 'block';

	if (!Array.isArray(suggestions) || suggestions.length === 0) return;
	searchWrapper.classList.add('withSuggestions');
});

// handle scrolling through suggestions
searchInput.addEventListener('keydown', (e) => {
	let previous = document.getElementById(`suggestion-${searchIndex}`)

	if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
		e.preventDefault(); // prevent cursor going to the beginning/end of input
		previous ? previous.classList.remove("selected") : null;

		if (e.key == 'ArrowDown') {
			searchIndex < suggestions.length - 1 ? searchIndex++ : searchIndex = 0; // iterate and loop around
		} else if (e.key == 'ArrowUp') {
			searchIndex > 0 ? searchIndex-- : searchIndex = suggestions.length - 1;
		}
		let next = document.getElementById(`suggestion-${searchIndex}`)
		if (next) document.getElementById(`suggestion-${searchIndex}`).classList.add("selected");

		searchInput.value = next.textContent;
	}

	if (searchInput.value.trim() === "") { // reset index if input is empty
		searchIndex = -1;
	}
});

// focus lost
searchInput.addEventListener('blur', () => {
	document.getElementById('suggestions').style.display = 'none';
	searchWrapper.classList.remove('withSuggestions');
});

// avoid search on empty input
form.addEventListener('submit', (e) => {
	if (!searchInput.value.trim()) {
		e.preventDefault();
	}
});