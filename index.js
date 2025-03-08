const { useState, useEffect } = React;

function NewTab() {
  const [wallpaper, setWallpaper] = useState("");

  // componentDidMount
  useEffect(() => {
    browser.storage.local.get("wallpaper").then((data) => {
      if (data.wallpaper) {
        setWallpaper(data.wallpaper);
      }
    });
  }, []);

  // function to change wallpaper
  const changeWallpaper = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      browser.storage.local.set({ wallpaper: url });
      setWallpaper(url);
    }
  };

  return React.createElement(
    "div",
    { className: "background" },
    React.createElement(
      "div",
      { className: "searchWrapper" },
      React.createElement("div", {
        className: "firefoxLogo",
      }),
      React.createElement("div", {
        className: "firefoxWordmark",
      })
    ),
    React.createElement(
      "button",
      { onClick: changeWallpaper, className: "fileButton" },
      "Change Wallpaper"
    )
  );
}

// render app
ReactDOM.render(React.createElement(NewTab), document.getElementById("root"));
