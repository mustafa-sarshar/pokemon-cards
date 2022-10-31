export function randomColorPicker() {
    const colors = "0123456789abcdef";
    const colorCodeLength = 6;
    let colorCode = "#";
    for (let i=0; i<colorCodeLength; i++) {
        colorCode += colors[Math.floor(Math.random() * colors.length)];
    }
    return colorCode;
}

export function colorDarknessChecker(colorCode) {
    const lumaThreshold = 120;
    /* Source: https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black (accessed on 13.08.2022) */
    let c = colorCode.substring(1);     // strip #
    let rgb = parseInt(c, 16);          // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff;         // extract red
    let g = (rgb >>  8) & 0xff;         // extract green
    let b = (rgb >>  0) & 0xff;         // extract blue

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    if (luma < lumaThreshold) return "white"
    else return "black"
}