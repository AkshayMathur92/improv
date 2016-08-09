import Colors from './colors.es6';
export default {
    keys: {
        white: Colors.neutral.mid[0],
        black: Colors.neutral.dark[0]
    },

    metronome: {
        drum: {
            bumpmap: './assets/ripplemap.jpg',
            color: Colors.neutral.dark[0], //0xfafafa,
            hitcolor: Colors.colorful.light[0],
            specular: Colors.neutral.dark[0] //0x222222
        },

        hammer: {
            refractioncube: [
                './assets/nx.jpg',
                './assets/ny.jpg',
                './assets/nz.jpg',
                './assets/nx.jpg',
                './assets/ny.jpg',
                './assets/nz.jpg' ],
            color: Colors.neutral.mid[0],
            hitcolor: Colors.colorful.light[0]
        }
    },

    dome: {
        color: Colors.neutral.dark[0], //0x1E1E1E,
        emissive: Colors.neutral.dark[0], //0x1E1E1E,
        specular: Colors.neutral.mid[0], //0x646464
    },

    floatingparticles: {
        sprite: './assets/snowflake1.png',
        color: Colors.neutral.mid[1]
    },

    lighting: {
        hemisphere: {
            top: Colors.neutral.dark[0], //0xffffbb,
            bottom: Colors.neutral.mid[1] //0x080820
        },
        spotlight: Colors.neutral.dark[0] //0x3a3a3a
    }
}