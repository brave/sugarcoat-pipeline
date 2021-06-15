window.onload = () => {
    let myScript = document.createElement("script");
    myScript.setAttribute("src", "https://www.google-analytics.com/analytics.js");
    document.body.appendChild(myScript);

    console.log(navigator.userAgent);
    console.log(window.localStorage);
    console.log(window.performance);
}
