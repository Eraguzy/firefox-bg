let sidebarToggle = document.getElementById("sidebarToggle"); // button
let sidebar = document.getElementById("sidebar"); // sidebar element

sidebarToggle.addEventListener("click", function (e) {
	sidebar.classList.toggle("active");
});

document.addEventListener("click", function (e) { // click away = close sidebar
	if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
		sidebar.classList.remove("active");
	}
});

let addWallpaper = document.getElementById("addWallpaper");

addWallpaper.addEventListener("click", function () {
	// simulate file input click to open file dialog
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = "image/*";
	fileInput.click();
});