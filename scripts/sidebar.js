// variables storaged in browser's local storage browser.storage.local :
// wallpapers: array of data URLs of wallpapers
// currentWallpaperIndex: index of the currently applied wallpaper in the wallpapers array



// code executed when opening the new tab page
applyWallpaper(); // apply wallpaper when opening the page
updateWallpapersList(); // populate the list of wallpapers in the sidebar

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

		if (wallpapers.length > 0 && index >= 0 && index < wallpapers.length) {
			document.body.style.backgroundImage = `url(${wallpapers[index]})`;
		} else {
			alert("error")
		}
	});
}

function updateWallpapersList() { // update the list of wallpapers in the sidebar
	let wallpapersList = document.getElementById("wallpapersList");

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

			wallpapersList.appendChild(wallpaperItem);
		});
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
		if (userInput.size > 5 * 1024 * 1024) { // 5MB in bytes
			alert("File is too large. Maximum allowed size is 5MB.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const dataURL = e.target.result;

			browser.storage.local.get("wallpapers").then(result => { // save to storage, adding up to previously saved bgs
				const wallpapers = result.wallpapers || [];
				wallpapers.push(dataURL);

				currentWallpaperIndex = wallpapers.length - 1; // set current index to the newly added wallpaper
				browser.storage.local.set({ wallpapers, currentWallpaperIndex });
			});

			applyWallpaper();
			updateWallpapersList();
		};
		reader.readAsDataURL(userInput);
	});
	fileInput.click(); 	// simulate file input click to open file dialog
});