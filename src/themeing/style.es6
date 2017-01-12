import Colors from './colors.es6';
export default {
    colorwheel: [       0xfffa00, 0xffcf00, 0xffa600, 0xff7d01,
                        0xff2000, 0xf42494, 0x8b20bb, 0x0024ba,
                        0x007ac7, 0x00b2d6, 0x02b801, 0x84ce00 ],


    keys: {
        normal: {
            white: {
                emissive: Colors.grayscale[3],
                color: Colors.neutral.red
            },
            black: {
                emissive: Colors.grayscale[1],
                color: Colors.neutral.red
            }
        },
        suggested: {
            white: {
                emissive: Colors.grayscale[2],
                color: Colors.neon.green
            },
            black: {
                emissive: Colors.grayscale[1],
                color: Colors.neon.green
            }
        },
        stronglySuggested: {
            white: {
                emissive: Colors.grayscale[2],
                color: Colors.neon.orange
            },
            black: {
                emissive: Colors.grayscale[1],
                color: Colors.neon.orange
            }
        },


    },

    metronome: {
        drum: {
            bumpmap: './assets/images/ripplemap.jpg',
            color: Colors.neutral.darkred,
            hitcolor: Colors.grayscale[0],
            emissive: Colors.grayscale[0],
            specular: Colors.neutral.grayblue
        },

        hammer: {
            refractioncube: [
                './assets/images/nx.jpg',
                './assets/images/ny.jpg',
                './assets/images/nz.jpg',
                './assets/images/nx.jpg',
                './assets/images/ny.jpg',
                './assets/images/nz.jpg' ],
            color: Colors.neutral.red,
            hitcolor: Colors.grayscale[0]
        }
    },

    dome: {
        color: Colors.neutral.darkred,
        emissive: Colors.neutral.darkred,
        specular: Colors.neutral.red
    },

    floatingparticles: {
        sprite: './assets/images/snowflake1.png',
        color: Colors.grayscale[2]
    },

    lighting: {
        hemisphere: {
            top: Colors.neutral.darkred,
            bottom: Colors.neutral.green
        },
        spotlight: Colors.grayscale[1]
    }
}
