// variables storaged in browser's local storage browser.storage.local :
// wallpapers: array of data URLs of wallpapers
// currentWallpaperIndex: index of the currently applied wallpaper in the wallpapers array
// isFirefoxTitleWhite : bool indicating if the Firefox title is visible



// code executed when opening the new tab page
applyWallpaper(); // apply wallpaper when opening the page
updateWallpapersList(); // populate the list of wallpapers in the sidebar
browser.storage.local.get("isFirefoxTitleWhite").then(result => { // set the initial state of the firefox title switch
	let firefoxTitleSwitch = document.getElementById("firefoxTitleColorSwitch");
	let firefoxWordmark = document.getElementById("firefoxWordmark");
	let logoWrapper = document.getElementById("logoWrapper");

	setTimeout(() => { // fade in the logo at startup
		logoWrapper.style.opacity = "1";
	}, 400);

	if (result.isFirefoxTitleWhite == true) {
		firefoxWordmark.style.filter = "brightness(0) invert(1)";
		firefoxTitleSwitch.checked = true;
	} else {
		firefoxWordmark.style.filter = "brightness(0) invert(0)";
		firefoxTitleSwitch.checked = false;
	}
});

// handle sidebar
let sidebarToggle = document.getElementById("sidebarToggle"); // button
let sidebar = document.getElementById("sidebar"); // sidebar element

sidebarToggle.addEventListener("click", () => {
	sidebar.classList.toggle("active");
});

document.addEventListener("click", (e) => { // click away = close sidebar
	if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
		sidebar.classList.remove("active");
	}
});




//wallpaper handling
// misc
function applyWallpaper() { // read the index currently stored and apply the corresponding wallpaper
	browser.storage.local.get(["wallpapers", "currentWallpaperIndex"]).then(result => {
		const wallpapers = result.wallpapers || [];
		const index = result.currentWallpaperIndex;
		const bg = document.getElementById("backgroundFade");

		if (wallpapers.length > 0 && index >= 0 && index < wallpapers.length) {
			bg.style.opacity = 0;
			setTimeout(() => {
				bg.style.backgroundImage = `url(${wallpapers[index]})`;
				bg.style.opacity = 1;
			}, 400); // you need to wait until transition to zero is done before changing back to 1
		} else { // no wallpaper case
			bg.style.opacity = 0;
			setTimeout(() => {
				bg.style.backgroundImage = `none`;
				bg.style.opacity = 1;
			}, 400);
		}
	});
}

function updateWallpapersList() { // update the list of wallpapers in the sidebar
	let wallpapersList = document.getElementById("wallpapersList");
	Array.from(wallpapersList.children).forEach(e => {
		if (e.classList.contains("wallpaperItem")) {
			wallpapersList.removeChild(e);
		}
	});

	browser.storage.local.get("wallpapers").then(result => {
		const wallpapers = result.wallpapers || [];

		wallpapers.forEach((wallpaper) => {
			let wallpaperItem = document.createElement("div");
			wallpaperItem.className = "wallpaperItem"; // styled in css
			wallpaperItem.style.backgroundImage = `url(${wallpaper})`; // thumbnail

			wallpaperItem.addEventListener("click", () => { // click to set as current wallpaper
				browser.storage.local.set({ currentWallpaperIndex: wallpapers.indexOf(wallpaper) });
				applyWallpaper();
			});

			// create delete button
			let deleteButton = document.createElement("div");
			deleteButton.className = "wallpaperDeleteButton";
			deleteButton.addEventListener("click", () => { // click to set as current wallpaper
				deleteWallpaper(wallpapers.indexOf(wallpaper)).then(() => {
					updateWallpapersList();
					applyWallpaper();
				});
			});
			wallpaperItem.appendChild(deleteButton);

			wallpapersList.appendChild(wallpaperItem);
		});
	});
}

function deleteWallpaper(index) { // delete wallpaper at given index
	return browser.storage.local.get(["wallpapers", "currentWallpaperIndex"]).then(result => { // return the promise for .then()
		let wallpapers = result.wallpapers || [];
		let currentIndex = result.currentWallpaperIndex;
		if (index < 0 || index >= wallpapers.length) return; // invalid index

		wallpapers.splice(index, 1); // remove wallpaper
		if (currentIndex === index) currentIndex = -1; // if the deleted wallpaper was the current one, set no wallpaper

		browser.storage.local.set({ wallpapers, currentWallpaperIndex: currentIndex });
	});
}

// add wallpaper
let addWallpaper = document.getElementById("addWallpaper");

addWallpaper.addEventListener("click", () => {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = "image/*";

	fileInput.addEventListener("change", () => {
		const userInput = fileInput.files[0];
		if (!userInput) return;
		// if (userInput.size > 5 * 1024 * 1024) { // 5MB in bytes
		// 	alert("File is too large, maximum allowed size is 5MB");
		// 	return;
		// }

		const reader = new FileReader();
		reader.onload = (e) => {
			const dataURL = e.target.result;

			browser.storage.local.get("wallpapers").then(result => { // save to storage, adding up to previously saved bgs
				const wallpapers = result.wallpapers || [];
				wallpapers.push(dataURL);

				currentWallpaperIndex = wallpapers.length - 1; // set current index to the newly added wallpaper
				browser.storage.local.set({ wallpapers, currentWallpaperIndex }).then(() => {
					applyWallpaper();
					updateWallpapersList();
				});
			});

		};
		reader.readAsDataURL(userInput)
	});
	fileInput.click(); 	// simulate file input click to open file dialog
});



// switches
let firefoxTitleSwitch = document.getElementById("firefoxTitleColorSwitch");
firefoxTitleSwitch.addEventListener("change", () => {
	let firefoxWordmark = document.getElementById("firefoxWordmark");

	browser.storage.local.set({ isFirefoxTitleWhite: firefoxTitleSwitch.checked });
	firefoxWordmark.style.filter = firefoxTitleSwitch.checked ? "brightness(0) invert(1)" : "brightness(0) invert(0)";
});