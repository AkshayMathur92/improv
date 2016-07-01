import Shaders from './../shaders.es6';
import BaseGroup from '../../node_modules/ccwc-threejs-vrscene/src/basegroup.es6';

export default class Metronome extends BaseGroup {
    onInitialize() {
        /**
         * metronome hammers in scene
         * @type {Array}
         * @private
         */
        this._hammers = [];

        /**
         * synth
         * @type {Tone}
         * @private
         */
        this._synth = new Tone.DrumSynth().toMaster();
    }

    onCreate(scenecollection, mycollection) {
        this.addHammer('right', Math.PI/64, Math.PI * 2, 'C4', scenecollection);
        this.addHammer('left', Math.PI/64, Math.PI, 'A4', scenecollection);
        this.addHammer('up', Math.PI/64, Math.PI/2, 'G5', scenecollection);
        this.addHammer('down', Math.PI/64, 0, 'F3', scenecollection);
    }

    onRender(scenecollection, mycollection) {
        for (var c = 0; c < this._hammers.length; c++) {
            var hammer = this._hammers[c];
            var newrotation = hammer.pivot.rotation[hammer.rotationaxis] + hammer.rate;
            if (newrotation > Math.PI * 3) {
                newrotation = newrotation - Math.PI * 2;
                this._synth.triggerAttackRelease(hammer.note, "8n");
            }
            hammer.pivot.rotation[hammer.rotationaxis] = newrotation;
            hammer.glow.material.uniforms.viewVector.value =
              new THREE.Vector3().subVectors( scenecollection.camera.position, hammer.pivot.position );
        }
    }

    /**
     * add metronome hammer
     * @param origin
     * @param scenecollection
     */
    addHammer(origin, rate, offset, tone, scenecollection) {
        var hammergeom = new THREE.SphereGeometry(5);
        var hammertex = THREE.ImageUtils.loadTexture( './assets/moon.jpg' );
        var hammermat = new THREE.MeshBasicMaterial( { map: hammertex } );
        var centerpivot = new THREE.Object3D();

        var hammer = new THREE.Mesh( hammergeom, hammermat );
        hammer.name = 'ball';
        centerpivot.add(hammer);
        centerpivot.position.z = -400;

        var glowmat = new THREE.ShaderMaterial({
            uniforms: {
                "c":   { type: "f", value: 2 },
                "p":   { type: "f", value: 3 },
                glowColor: { type: "c", value: new THREE.Color(0xff0000) },
                viewVector: { type: "v3", value: scenecollection.camera.position }
            },
            vertexShader: Shaders.glow.vertex,
            fragmentShader: Shaders.glow.fragment,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true, opacity: 0.4 });

        var glow = new THREE.Mesh( hammergeom.clone(), glowmat.clone() );
        glow.name = 'glow';
        glow.scale.multiplyScalar(1.2);
        centerpivot.add(glow);

        var rotationaxis;
        switch (origin) {
            case 'right':
                glow.position.x = 100;
                centerpivot.position.x = 100;
                hammer.position.x = 100;
                rotationaxis = 'y';
                break;

            case 'left':
                glow.position.x = -100;
                centerpivot.position.x = -100;
                hammer.position.x = -100;
                rotationaxis = 'y';
                break;

            case 'down':
                glow.position.y = -100;
                centerpivot.position.y = -100;
                hammer.position.y = -100;
                rotationaxis = 'x';
                break;

            case 'up':
                glow.position.y = 100;
                centerpivot.position.y = 100;
                hammer.position.y = 100;
                rotationaxis = 'x';
                break;
        }

        centerpivot.rotation[rotationaxis] += offset;

        this._hammers.push( {
            glow: glow,
            hammer: hammer,
            pivot: centerpivot,
            rate: rate,
            rotationaxis: rotationaxis,
            note: tone}
        );

        this.add(centerpivot, 'hammer');
    }
}