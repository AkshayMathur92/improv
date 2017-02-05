import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';

export default class Lighting extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        this._light = new THREE.HemisphereLight( Style.lighting.hemisphere.top, Style.lighting.hemisphere.bottom, 4 );
        var spotLight = new THREE.SpotLight( Style.lighting.spotlight );
        spotLight.position.set( 0, 0, 400 );
        spotLight.rotation.x = Math.PI / 2;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 100;
        spotLight.shadow.camera.far = 400;
        spotLight.shadow.camera.fov = 30;

        this.add(spotLight);
        this.add(this._light);

        this._animation = {};
    }

    /**
     * on render scene
     * @param scene
     * @param custom
     */
    onRender(scene, custom) {
        if (this._animation.animating) {
            this._light.intensity = this._animation.intensity;
        }
    }

    setIntensity(value) {
        this._animation = { animating: true, intensity: this._light.intensity };
        createjs.Tween.get(this._animation)
            .to({ intensity: value }, 1000)
            .wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call( function() { this.animating = false; } );
    }
}
