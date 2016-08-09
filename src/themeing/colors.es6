export default {
    neutral: {
        light: [0xDBBABD, 0xACE5BA, 0xD8E3DA],
        mid: [0x7A6869, 0x65876E, 0x888F89],
        dark: [0x2d2627, 0x3a3a3a]
    },

    colorful: {
        light: [ 0x1CDEFF, 0x86D62F, 0xFFAA2C, 0xFFE178 ],
        mid: [ 0xff0000 ],
        dark: [ 0xff0000 ]
    },

    /**
     * turn decimal color to RGB
     * @param dec
     * @param max
     * @returns {{r: number, g: number, b: number}}
     */
    decToRGB(dec, max) {
        if (!max) { max = 255; }
        max += 1; // aids with rounding
        var r = Math.floor(dec / (256*256));
        var g = Math.floor(dec / 256) % 256;
        var b = dec % 256;
        return { r: r/255 * max, g: g/255 * max, b: b/255 * max };
    },

    RGBToDec(rgb) {
        return rgb.r << 16 + rgb.g << 16 + rgb.b;
    }
}