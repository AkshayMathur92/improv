import BaseGroup from '../../node_modules/ccwc-threejs-vrscene/src/basegroup.es6';

export default class Keyboard extends BaseGroup {
   onInitialize() {
        /**
         * key visuals
         * @type {Array}
         * @private
         */
        this._keys = [];

        /**
         * key material
         * @type {THREE.MeshLambertMaterial}
         */
        var keyMaterial = this.createMaterial();

        /**
         * white key mesh
         */
        this._whiteKeyMesh = this.createWhiteKey(keyMaterial.clone());

        /**
         * black key mesh
         */
        this._blackKeyMesh = this.createBlackKey(keyMaterial.clone());
    }

    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var counter = 0;
        for (var c = 0; c < 14; c++) {
            this.addKey(-c * Math.PI * 2 / 14, true, String.fromCharCode('A'.charCodeAt(0) + counter));

            if (counter !== 1 && counter !== 4) {
                this.addKey(-(c * Math.PI * 2 / 14 + Math.PI/14), false, String.fromCharCode('A'.charCodeAt(0) + counter) + '#');
            }

            counter ++;
            if (counter >= 7) {
                counter = 0;
            }
        }
    }

    /**
     * create white key geometry
     * @returns {THREE.Mesh}
     */
    createWhiteKey(material) {
        var keygeom = new THREE.CubeGeometry( 26, 70, 5 );
        var key = new THREE.Mesh( keygeom, material);
        key.geometry.translate( 0, 100, -400 );
        return key;
    }

    /**
     * create black key geometry
     * @returns {THREE.Mesh}
     */
    createBlackKey(material) {
        var keygeom =  new THREE.CubeGeometry( 13, 35, 5 );
        var key = new THREE.Mesh( keygeom, material);
        key.geometry.translate( 0, 130, -400 );
        return key;
    }

    /**
     * create and add a key
     * @param {Number} rotation
     * @param {Boolean} white
     */
    addKey(rotation, white, notation) {
        var key, color;
        if (white) {
            color = 'white';
            key = this._whiteKeyMesh.clone();
        } else {
            color = 'black';
            key = this._blackKeyMesh.clone();
        }
        key.rotation.z = rotation;
        this._keys.push({ type: color, object: key, notation: notation });
        this.add(key,'key_' + notation);
    }

    /**
     * create key material
     */
    createMaterial() {
        var loader = new THREE.TextureLoader();
        var envMap = loader.load('./assets/moon.jpg');
        envMap.mapping = THREE.CubeRefractionMapping;
        envMap.format = THREE.RGBFormat;
        return new THREE.MeshLambertMaterial(
            {   color: 0xffee00,
                envMap: envMap,
                refractionRatio: 0.95,
                combine: THREE.MixOperation,
                reflectivity: 0.3 });
    }
}