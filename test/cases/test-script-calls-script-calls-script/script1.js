function reqListener () {
  console.log(this.responseText);
}

window.onload = () => {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://www.example.org/example.txt");
    oReq.send();
    let myScript = document.createElement("script");
    myScript.setAttribute("src", "script2.js");
    document.body.appendChild(myScript);
    fetch('http://example.com/movies.json')
        .then(response => response.json())
        .then(data => console.log(data));
    console.log(window.localStorage());
}
