import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';

export default class Dome extends BaseGroup {
    /**
     * on create scene (or earliest possible opportunity)
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        var loader = new THREE.FontLoader();
        loader.load( 'assets/models/optimer_bold.typeface.json', ( response ) => {
            this.font = response;
        });
    }

    /**
     * on render
     * @param scenecollection
     * @param mycollection
     */
    onRender(scenecollection, mycollection) {}

    /**
     * set text
     * @param text
     */
    setText(text) {
        this.createMesh(text);
    }

    /**
     * create mesh
     */
    createMesh(text) {
        if (this.mesh) {
            this.group.remove(this.mesh);
        }

        if (!text) {
            return;
        }

        this.mesh = new THREE.Mesh(this.createGeometry(text), this.createMaterial(), text.length);
        this.mesh.position.z = -15;
        this.mesh.position.y = 1.20;
        if (text.length === 2) {
            this.mesh.position.x = -.65;
        } else if (text.length === 3) {
            this.mesh.position.x = -.85;
        } else {
            this.mesh.position.x = -.35;
        }
        this.mesh.name = 'notationtext';
        this.group.add(this.mesh);
    }

    /**
     * create globe geometry
     * @returns {THREE.IcosahedronGeometry}
     */
    createGeometry(text) {
        var size = .75;
        if (text.length === 3) {
            size = .55;
        }
        return new THREE.TextGeometry( text, {
            font: this.font,
            size: size,
            height: .5,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: false,
            material: 0,
            extrudeMaterial: 0
        });
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
