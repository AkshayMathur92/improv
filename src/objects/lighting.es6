import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';

export default class Lighting extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var light = new THREE.HemisphereLight( Style.lighting.hemisphere.top, Style.lighting.hemisphere.bottom, 4 );
        var spotLight = new THREE.SpotLight( Style.lighting.spotlight );
        spotLight.position.set( 0, 0, 400 );
        spotLight.rotation.x = Math.PI / 2;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 100;
        spotLight.shadow.camera.far = 400;
        spotLight.shadow.camera.fov = 30;

        this.add(spotLight);
        this.add(light);
    }
}