const { useState, useEffect } = React;

// so apparently you can now replace classes with functions and hooks in React ?
function NewTab() {
  const [wallpaper, setWallpaper] = useState("");

  const [styles] = useState({
    background: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      color: "white",
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      background: "#0078d7",
      color: "white",
      border: "none",
      borderRadius: "5px",
      marginTop: "20px",
    },
  });

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

  // create html elements
  return React.createElement(
    "div",
    { style: styles.background },
    React.createElement("h1", null, "Firefox Custom Wallpaper"),
    React.createElement(
      "button",
      {
        onClick: changeWallpaper,
        style: styles.button,
      },
      "Change Wallpaper"
    )
  );
}

// render app
ReactDOM.render(React.createElement(NewTab), document.getElementById("root"));
