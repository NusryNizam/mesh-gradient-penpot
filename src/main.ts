import { generateMeshGradient } from "meshgrad";
import "./style.css";

import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { elementToSVG, inlineResources } from "dom-to-svg-v2";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const box = document.getElementById("gradient-wrapper") as HTMLDivElement;
const stopCount = document.getElementById("stop-count") as HTMLDivElement;
const stopInput = document.getElementById("stops") as HTMLElement;

stopCount.innerText = "3";
stopInput.setAttribute("value", "3");
let NO_OF_STOPS = 3;
box.setAttribute("style", generateMeshGradient(NO_OF_STOPS));

stopInput.addEventListener("input", (e) => {
  const val = (e.target as HTMLInputElement).value;
  NO_OF_STOPS = Number(val);
  stopCount.innerText = val;
  box.setAttribute("style", generateMeshGradient(NO_OF_STOPS));
});

document
  .querySelector("[data-handler='generate']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts

    box.setAttribute("style", generateMeshGradient(NO_OF_STOPS));
  });

document
  .querySelector("[data-handler='add-to-canvas']")
  ?.addEventListener("click", async () => {
    // send message to plugin.ts

    const svgDocument = elementToSVG(box);

    // Inline external resources (fonts, images, etc) as data: URIs
    await inlineResources(svgDocument.documentElement);

    // Get SVG string
    const svgString = new XMLSerializer().serializeToString(svgDocument);

    if (svgString) {
      return parent.postMessage(
        {
          type: "add-to-canvas",
          message: svgString,
        },
        "*"
      );
    }
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
