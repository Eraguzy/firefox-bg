# Glossy Custom Tab

This is an extension to override Firefox's new tab page and allow you to store background videos/gifs/photos as wallpapers.

Find it here : https://addons.mozilla.org/fr/firefox/addon/glossy-custom-tab/

## Limitations

### GIF loop interrupting
- Some GIFs (not all of them) are glitched and will stop looping after a few cycles (this is a well-known bug from Firefox).

> Since video formats are accepted, you can head [here](https://ffmpeg-online.vercel.app/?inputOptions=-i&output=output.webm&outputOptions=-c%20vp9%20-b%3Av%200%20-crf%2030) to convert your .gif to a video file (parameters are already filled, conversion is done locally).

### Override about:homepage
`about:homepage` is the first page that pops up when you open the browser. An add-on cannot override it. To allow this page to be overriden, follow these easy steps :
- Go to `about:debugging`, then "This Firefox".
- Find Glossy Custom Tab, and copy the **internal UUID**. 
- Head to `about:config`. If prompted, confirm and continue. 
- look for the `browser.startup.homepage` parameter. Set its value to `moz-extension://[Internal UUID]/newtab.html`.
- Now, you should be done.