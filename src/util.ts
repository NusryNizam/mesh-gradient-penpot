/**
 * Generate an SVG string with randomized radial gradients and blend modes.
 * @param stopCount Number of gradients to create.
 * @param initialHue Initial hue for the color palette.
 * @param svgWidth Width of the SVG canvas.
 * @param svgHeight Height of the SVG canvas.
 * @param blendMode Blend mode to apply (e.g., 'overlay', 'multiply', 'screen').
 * @returns The complete SVG string.
 */
export const generateRandomizedGradientSvg = (
  stopCount: number,
  initialHue: number,
  svgWidth: number,
  svgHeight: number,
  blendMode: string = "overlay",
  blurStrength = 0
): string => {
  const random = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

  // Generate colors based on split complementary scheme
  const generateColors = (length: number, hue: number): string[] => {
    return Array.from({ length }, (_, i) => {
      if (i === 0) {
        return `hsl(${hue}, 100%, 50%)`;
      }
      if (i < length / 1.4) {
        return `hsl(${
          hue - 30 * (1 - 2 * (i % 2)) * (i > 2 ? i / 2 : i)
        }, 100%, ${64 - i * (1 - 2 * (i % 2)) * 1.75}%)`;
      }
      return `hsl(${hue - 150 * (1 - 2 * (i % 2))}, 100%, ${
        66 - i * (1 - 2 * (i % 2)) * 1.25
      }%)`;
    });
  };

  // Generate radial gradient <defs> with randomized positions and sizes
  const generateGradientDefs = (colors: string[]): string => {
    return colors
      .map((color, i) => {
        const cx = random(0, 100).toFixed(2);
        const cy = random(0, 100).toFixed(2);

        const r = 100;

        console.log(color);
        return `
        <radialGradient id="gradient${i}" cx="${cx}%" cy="${cy}%" r="${r}%">
          <stop offset="0%" stop-color="${color.replace("-", "")}" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>`;
      })
      .join("\n");
  };

  const generateCombinedFilter = (
    blendMode: string,
    blurStrength: number
  ): string => {
    return `
      <filter id="combinedFilter">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${blurStrength}" result="blurred" />
        <feBlend mode="${blendMode}" in="blurred" in2="BackgroundImage" result="blend" />
      </filter>`;
  };

  // Generate full-width elements with random opacity
  const generateSvgElements = (count: number): string => {
    return (
      `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white"   />` +
      Array.from({ length: count }, (_, i) => {
        return `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}"  fill="url(#gradient${i})" filter="url(#combinedFilter)"  />`;
      }).join("\n")
    );
  };

  // Generate colors
  const colors = generateColors(stopCount, initialHue);

  // Generate SVG components
  const gradientDefs = generateGradientDefs(colors);
  const svgElements = generateSvgElements(stopCount);
  const combinedFilter = generateCombinedFilter(blendMode, blurStrength);

  // Combine into a full SVG
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <defs>
    ${combinedFilter}
    ${gradientDefs}
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="hsl(${initialHue}, 100%, 100%)" />
  ${svgElements}
</svg>`;
};

/**
 * Updates the mode of the <feBlend> element in an SVG string.
 *
 * @param {string} svgString - The SVG string to modify.
 * @param {string} newMode - The new blend mode to apply (e.g., "multiply", "screen").
 * @returns {string} - The updated SVG string.
 */
export function updateFeBlendMode(svgString: string, newMode: string) {
  // Create a parser to convert the SVG string to a DOM element
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  // Parse the SVG string into a DOM object
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

  // Find the <feBlend> element
  const feBlend = svgDoc.querySelector("feBlend");

  // Update the mode attribute if <feBlend> exists
  if (feBlend) {
    feBlend.setAttribute("mode", newMode);
  } else {
    console.warn("No <feBlend> element found in the SVG string.");
  }

  // Serialize the updated DOM object back to an SVG string
  return serializer.serializeToString(svgDoc);
}

/**
 * Updates the stdDeviation of the <feGaussianBlur> and the mode of <feBlend>
 * in the combined filter of an SVG string.
 *
 * @param {string} svgString - The SVG string to modify.
 * @param {number} stdDeviation - The new standard deviation value for Gaussian blur.
 * @param {string} blendMode - The new blend mode (e.g., 'multiply', 'screen').
 * @returns {string} - The updated SVG string.
 */
export const updateCombinedFilter = (
  svgString: string,
  stdDeviation: number,
  blendMode: string
): string => {
  try {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    // Parse the SVG string into a DOM object
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

    // Check for parsing errors
    const parseError = svgDoc.querySelector("parsererror");
    if (parseError) {
      console.error("SVG Parsing Error:", parseError.textContent);
      return svgString; // Return the original string if parsing fails
    }

    // Find the combined filter
    const combinedFilter = svgDoc.querySelector(`filter#combinedFilter`);
    if (!combinedFilter) {
      console.warn(`No <filter> element with id "combinedFilter" found.`);
      return svgString; // Return the original string if the filter is not found
    }

    // Update <feGaussianBlur>
    const gaussianBlurElement = combinedFilter.querySelector("feGaussianBlur");
    if (!gaussianBlurElement) {
      console.warn(`No <feGaussianBlur> element found in "combinedFilter".`);
    } else {
      gaussianBlurElement.setAttribute("stdDeviation", stdDeviation.toString());
    }

    // Update <feBlend>
    const feBlendElement = combinedFilter.querySelector("feBlend");
    if (!feBlendElement) {
      console.warn(`No <feBlend> element found in "combinedFilter".`);
    } else {
      feBlendElement.setAttribute("mode", blendMode);
    }

    // Serialize the updated DOM object back to an SVG string
    return serializer.serializeToString(svgDoc);
  } catch (error) {
    console.error("Error updating combined filter:", error);
    return svgString; // Return the original string on any error
  }
};
