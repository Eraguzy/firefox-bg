let searchWrapper = document.getElementById('searchWrapper');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const ul = document.getElementById('suggestions');
let suggestions = [];

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

				li.addEventListener('mousedown', () => {
					searchInput.value = suggestions[i];
					searchInput.form.submit();
				});

				li.textContent = suggestions[i];
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

searchInput.addEventListener('blur', () => { // focus lost
	document.getElementById('suggestions').style.display = 'none';
	searchWrapper.classList.remove('withSuggestions');
});

// avoid search on empty input
form.addEventListener('submit', (e) => {
	if (!searchInput.value.trim()) {
		e.preventDefault();
	}
});