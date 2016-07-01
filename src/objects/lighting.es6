import BaseGroup from '../../node_modules/ccwc-threejs-vrscene/src/basegroup.es6';

export default class Lighting extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    create(scene, custom) {
        super.create(scene, custom);
        var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 4 );
        var spotLight = new THREE.SpotLight( 0x3a3a3a );
        spotLight.position.set( 0, 0, 400 );
        spotLight.rotation.x = Math.PI / 2;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 100;
        spotLight.shadow.camera.far = 400;
        spotLight.shadow.camera.fov = 30;

        this.add(spotLight);
        this.add(light)
    }
}