let sidebarToggle = document.getElementById("sidebarToggle");
let sidebar = document.getElementById("sidebar");

sidebarToggle.addEventListener("click", function (e) {
	sidebar.classList.toggle("active");
});

document.addEventListener("click", function (e) { // click away = close sidebar
	if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
		sidebar.classList.remove("active");
	}
});