import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';
import Utils from '../utils.es6';

export default class FloatingParticles extends BaseGroup {
    /**
     * on create scene
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var geometry = new THREE.Geometry();
        var textureLoader = new THREE.TextureLoader();
        var sprite = textureLoader.load(Style.floatingparticles.sprite);

        for (var i = 0; i < 10000; i ++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            geometry.vertices.push( vertex );
        }

        this.materials = [];
        for (var i = 0; i < 4; i ++ ) {
            this.materials[i] = new THREE.PointsMaterial({
                size: Math.random()*2.0 + .75,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent : true });
            var particles = new THREE.Points( geometry, this.materials[i] );

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            this.add(particles);
        }

        this.setColor();
    }

    /**
     * set drum hit/trigger color
     * @param hex
     */
    setColor(hex) {
        if (!hex) {
            this._color = Style.floatingparticles.color;
        } else {
            this._color = hex;
        }

        for (var c = 0; c < this.materials.length; c++) {
            this.materials[c].color.set(this._color);
        }
     }

    onRender(time) {
        for (var i = 0; i < this.children.length; i ++) {
            var object = this.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y += .001;
                object.rotation.z += .001;
            }
        }
    }

}
