import BaseGroup from '../../node_modules/ccwc-threejs-vrscene/src/basegroup.es6';

export default class Dome extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
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
            color      :  new THREE.Color("rgb(30,30,30)"),
            emissive   :  new THREE.Color("rgb(30,30,30)"),
            specular   :  new THREE.Color("rgb(100,100,100)"),
            side       :  THREE.BackSide,
            shininess  :  10,
            shading    :  THREE.FlatShading,
            transparent: 1,
            opacity    : 1
        });
    }
}