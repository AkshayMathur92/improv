import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';

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
                size: Math.random()*1.0 + .75,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent : true });

            this.materials[i].color.set(Style.floatingparticles.color);

            var particles = new THREE.Points( geometry, this.materials[i] );

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            this.add(particles);

        }
    }

    onRender() {
        var time = Date.now() * 0.00005;
        for (var i = 0; i < this.children.length; i ++) {
            var object = this.children[ i ];
            if ( object instanceof THREE.Points ) {
                object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }

        /*for ( i = 0; i < this.materials.length; i ++ ) {
            var h = ( 360 * ( 0 + time ) % 360 ) / 360;
            this.materials[i].color.setHSL( 1, .5, h );
        }*/
    }

}