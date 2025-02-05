console.log("Custom new tab loaded!");

// Load stored wallpaper
browser.storage.local.get("wallpaper", function (data) {
  if (data.wallpaper) {
    document.body.style.backgroundImage = `url(${data.wallpaper})`;
    document.body.style.backgroundSize = "cover";
  }
});

// Change wallpaper when button is clicked
document
  .getElementById("change-wallpaper")
  .addEventListener("click", function () {
    let url = prompt("Enter image URL:");
    if (url) {
      browser.storage.local.set({ wallpaper: url }, function () {
        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = "cover";
      });
    }
  });
