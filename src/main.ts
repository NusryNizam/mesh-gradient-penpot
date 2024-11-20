import "./style.css";
import { generateRandomizedGradientSvg } from "./util";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const box = document.getElementById("gradient-wrapper") as HTMLDivElement;
const stopCountInput = document.getElementById("stop-count") as HTMLDivElement;
const stopInput = document.getElementById("stops") as HTMLElement;

stopCountInput.innerText = "3";
stopInput.setAttribute("value", "3");
let stopCount = 3;

let gradient = generate();
box.innerHTML = gradient;

stopInput.addEventListener("input", (e) => {
  const val = (e.target as HTMLInputElement).value;
  stopCount = Number(val);
  stopCountInput.innerText = val;

  gradient = generate();
  box.innerHTML = gradient;
});

document
  .querySelector("[data-handler='generate']")
  ?.addEventListener("click", () => {
    gradient = generate();
    box.innerHTML = gradient;
  });

document
  .querySelector("[data-handler='add-to-canvas']")
  ?.addEventListener("click", () => {
    parent.postMessage(
      {
        type: "add-to-canvas",
        data: gradient,
      },
      "*"
    );
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});

function generate() {
  return generateRandomizedGradientSvg(
    stopCount,
    Math.round(Math.random() * 360),
    1200,
    800,
    "screen"
  );
}
