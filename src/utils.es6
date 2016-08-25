export default {
    /**
     * apply n number of properties to an object
     * @param object
     * @param {Object} props
     * @param {String} namespace of property (prepend key name)
     */
    copyPropsTo(object, props, namespace) {
        if (!namespace) { namespace = ''; }
        for (var c in props) {
            object[c + namespace] = props[c];
        }
        return object;
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