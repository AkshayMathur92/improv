import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';
import TonePlayback from '../toneplayback.es6';

export default class Dome extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        this._material = this.createMaterial();
        var mesh = new THREE.Mesh(this.createGeometry(), this._material);
        mesh.position.z = 5;
        this.add(mesh, 'dome');
    }

    /**
     * on render
     * @param scenecollection
     * @param mycollection
     */
    onRender(scenecollection, mycollection) {
        if (TonePlayback.isPlaying) {
            this.group.rotation.y += Math.PI / 1024;
        }
    }

    setEmissive(color) {
        this._material.emissive.setHex(color);
    }

    /**
     * create globe geometry
     * @returns {THREE.IcosahedronGeometry}
     */
    createGeometry() {
        return new THREE.IcosahedronGeometry( 800, 2 );
    }

    /**
     * create globe material
     */
    createMaterial() {
        return new THREE.MeshPhongMaterial({
            color      :  Style.dome.color,
            emissive   :  Style.dome.emissive,
            specular   :  Style.dome.specular,
            side       :  THREE.BackSide,
            shininess  :  10,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });
    }
}
