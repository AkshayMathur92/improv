import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';

export default class Dome extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
        mesh.position.z = 5;
        this.add(mesh, 'dome');
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