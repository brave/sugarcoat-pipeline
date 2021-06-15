window.onload = () => {
    let myScript = document.createElement("script");
    myScript.setAttribute("src", "https://sc-static.net/scevent.min.js");
    document.body.appendChild(myScript);

    console.log(navigator.userAgent);
    console.log(window.localStorage);
    console.log(window.performance);
}
