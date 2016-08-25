import Colors from './colors.es6';
export default {
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
                emissive: Colors.grayscale[4],
                color: Colors.neon.green
            },
            black: {
                emissive: Colors.grayscale[2],
                color: Colors.neon.green
            }
        },
        stronglySuggested: {
            white: {
                emissive: Colors.grayscale[4],
                color: Colors.neon.orange
            },
            black: {
                emissive: Colors.grayscale[2],
                color: Colors.neon.orange
            }
        }
    },

    metronome: {
        drum: {
            bumpmap: './assets/ripplemap.jpg',
            color: Colors.neutral.darkred,
            hitcolor: Colors.neon.blue,
            emissive: Colors.grayscale[0],
            specular: Colors.neutral.grayblue
        },

        hammer: {
            refractioncube: [
                './assets/nx.jpg',
                './assets/ny.jpg',
                './assets/nz.jpg',
                './assets/nx.jpg',
                './assets/ny.jpg',
                './assets/nz.jpg' ],
            color: Colors.neutral.red,
            hitcolor: Colors.neon.blue
        }
    },

    dome: {
        color: Colors.neutral.darkred,
        emissive: Colors.neutral.darkred,
        specular: Colors.neutral.red
    },

    floatingparticles: {
        sprite: './assets/snowflake1.png',
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