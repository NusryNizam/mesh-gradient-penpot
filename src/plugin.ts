penpot.ui.open("Meshy - Generate mesh gradients", `?theme=${penpot.theme}`, {
  width: 350,
  height: 400,
});

penpot.ui.onMessage<{
  type: string;
  data: any;
}>((message) => {
  console.log(message);
  if (message.type === "add-to-canvas") {
    console.log("Adding to canvas");
    console.log(message.data);

    penpot.createShapeFromSvg(message.data);

    // penpot
    //   .uploadMediaData("abc", new Uint8Array(message.data), "image/svg+xml")
    //   .then((imageData) => {
    //     console.log("success");
    //   })
    //   .catch((e) => {
    //     console.log("Error: ", e);
    //   });
    // TODO: Logic here
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});
