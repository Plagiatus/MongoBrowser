window.addEventListener("load", init);

function init(_event: Event): void {
    console.log(_event);
    let p: HTMLParagraphElement = document.createElement("p");
    document.body.appendChild(p);
    p.innerHTML = "loaded";
}