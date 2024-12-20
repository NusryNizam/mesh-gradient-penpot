penpot.ui.open("Meshy - Generate mesh gradients", `?theme=${penpot.theme}`, {
  width: 350,
  height: 540,
});

penpot.ui.onMessage<{
  type: string;
  data: any;
}>((message) => {
  if (message.type === "add-to-canvas") {
    console.info("Adding to canvas");
    const board = penpot.createBoard();
    board.addFlexLayout();
    board.verticalSizing = "auto";
    board.horizontalSizing = "auto";
    board.x = penpot.viewport.center.x;
    board.y = penpot.viewport.center.y;

    const svgGroup = penpot.createShapeFromSvg(message.data);

    if (svgGroup) board.insertChild(0, svgGroup);
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
