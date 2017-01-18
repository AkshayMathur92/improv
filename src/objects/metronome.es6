import Shaders from './../shaders.es6';
import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';
import Utils from '../utils.es6';
import TonePlayback from '../toneplayback.es6';

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
        //this._synth = new Tone.DrumSynth().toMaster();

        /**
         * tween targets
         * @type {{drum: {animating: boolean, props: {}}}}
         * @private
         */
        this._tweenTargets = {
            drum: { animating: false, props: {} },
        };

        this.setHitColor();
    }

    /**
     * set drum hit/trigger color
     * @param hex
     */
    setHitColor(hex) {
        if (hex) {
            this._hitColor = Utils.decToRGB(hex, 100);
        } else {
            this._hitColor = Utils.decToRGB(Style.metronome.hammer.hitcolor, 100);
        }
    }

    onCreate(scenecollection, mycollection) {
        //this.addHammer('right', Math.PI/64, Math.PI * 2, 'C4');
        //this.addHammer('left', Math.PI/128, Math.PI/4, 'A4');
        this.addHammer('up', Math.PI/32, Math.PI/2, 'C3');
        //this.addHammer('down', Math.PI/32, 0, 'F3');
        this.addDrum();
    }

    /**
     * on render
     * @param scenecollection
     * @param mycollection
     */
    onRender(scenecollection, mycollection) {
        this.animateHammers();
        this.animateDrum();
    }

    /**
     * render cycle for drum
     */
    animateDrum() {
        if (this._tweenTargets.drum.animating) {
            this.drum.position.z = this._tweenTargets.drum.props.zPosition;
            this.drum.material.bumpScale = this._tweenTargets.drum.props.bumpscale;
            this.drum.material.color.setRGB(
                this._tweenTargets.drum.props.r/100,
                this._tweenTargets.drum.props.g/100,
                this._tweenTargets.drum.props.b/100 );
        }
    }

    /**
     * render cycle for hammers
     */
    animateHammers() {
        for (var c = 0; c < this._hammers.length; c++) {
            var hammer = this._hammers[c];

            if (hammer.animatingGlow) {
                hammer.glow.material.color.setRGB(
                    hammer.glowColor.r/100,
                    hammer.glowColor.g/100,
                    hammer.glowColor.b/100 );
            }

            var newrotation = hammer.pivot.rotation[hammer.rotationaxis] + hammer.direction * hammer.rate;

            if (Math.abs(newrotation) > Math.PI - Math.PI/16) {
                hammer.direction *= -1;
                newrotation = Math.abs(newrotation)/newrotation * (Math.PI - Math.PI/16);
                this.triggerDrum(hammer);
            }
            hammer.pivot.rotation[hammer.rotationaxis] = newrotation;
        }
    }

    /**
     * sound the drum, the hammer hit it
     * @param hammer
     */
    triggerDrum(hammer) {
        TonePlayback.noteOn(TonePlayback.SYNTHDRUM, hammer.note, 10, 1/8);
       // this._synth.triggerAttackRelease(hammer.note, "16n");
        hammer.animatingGlow = true;
        var startcolor = Utils.decToRGB(Style.metronome.hammer.color, 100);
        var endcolor = this._hitColor;
        hammer.glowColor.r = startcolor.r;
        hammer.glowColor.g = startcolor.g;
        hammer.glowColor.b = startcolor.b;
        createjs.Tween.get(hammer.glowColor)
            .to({ r: endcolor.r, g: endcolor.g, b: endcolor.b }, 500)
            .to({ r: startcolor.r, g: startcolor.g, b: startcolor.b }, 500)
            .wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call( function (scope) { scope.animatingGlow = false; } );

        var startcolor = Utils.decToRGB(Style.metronome.drum.color, 100);
        var endcolor = this._hitColor;
        this._tweenTargets.drum.props.r = startcolor.r;
        this._tweenTargets.drum.props.g = startcolor.g;
        this._tweenTargets.drum.props.b = startcolor.b;
        this._tweenTargets.drum.props.zPosition = -400;
        this._tweenTargets.drum.props.bumpscale = 0;
        this._tweenTargets.drum.animating = true;
        this._tweenTargets.drum.currentTween = createjs.Tween.get(this._tweenTargets.drum.props)
            .to({
                r: endcolor.r, g: endcolor.g, b: endcolor.b,
                bumpscale: 1.5,
                zPosition: -400 + hammer.direction * 50 }, 150)
            .to({
                r: startcolor.r, g: startcolor.g, b: startcolor.b,
                bumpscale: 0,
                zPosition: -400 }, 150)
            .wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
            .call( () => { this._tweenTargets.drum.animating = false; } );
    }

    /**
     * add center drum
     */
    addDrum() {
        var drumgeom = new THREE.CircleGeometry( 30, 24 );
        drumgeom.scale(1,1, 0.75);
        var mapHeight = new THREE.TextureLoader().load(Style.metronome.drum.bumpmap);
        mapHeight.anisotropy = 4;
        mapHeight.repeat.set(1, 1);
        mapHeight.wrapS = mapHeight.wrapT = THREE.ClampToEdgeWrapping;
        mapHeight.format = THREE.RGBFormat;

        var material = new THREE.MeshPhongMaterial( {
            color: Style.metronome.drum.color,
            emissive: Style.metronome.drum.emissive,
            specular: Style.metronome.drum.specular,
            bumpMap: mapHeight,
            bumpScale: 0,
        } );

        this.drum = new THREE.Mesh( drumgeom, material );
        this.drum.position.z = -400;
        this.add(this.drum, 'drum');
    }

    /**
     * add metronome hammer
     * @param origin
     * @param rate
     * @param offset
     */
    addHammer(origin, rate, offset, tone) {
        var hammergeom = new THREE.SphereGeometry(5);
        var centerpivot = new THREE.Object3D();

        var textureCube = new THREE.CubeTextureLoader().load(Style.metronome.hammer.refractioncube);
        textureCube.mapping = THREE.CubeRefractionMapping;

        var innermaterial = new THREE.MeshBasicMaterial( {
            envMap: textureCube } );

        var outermaterial = new THREE.MeshBasicMaterial( {
            color: Style.metronome.hammer.color,
            transparent: true,
            wireframe: true,
            opacity: 0.5 } );


        var hammer = new THREE.Mesh( hammergeom, innermaterial );
        hammer.name = 'ball';
        centerpivot.add(hammer);
        centerpivot.position.z = -400;

        var glow = new THREE.Mesh( hammergeom.clone(), outermaterial );
        glow.name = 'glow';
        glow.scale.multiplyScalar(1.2);
        centerpivot.add(glow);

        var rotationaxis;
        switch (origin) {
            case 'right':
                glow.position.x = -100;
                centerpivot.position.x = -100;
                hammer.position.x = -100;
                rotationaxis = 'y';
                break;

            case 'left':
                glow.position.x = 100;
                centerpivot.position.x = 100;
                hammer.position.x = 100;
                rotationaxis = 'y';
                break;

            case 'down':
                glow.position.y = 100;
                centerpivot.position.y = 100;
                hammer.position.y = 100;
                rotationaxis = 'x';
                break;

            case 'up':
                glow.position.y = -100;
                centerpivot.position.y = -100;
                hammer.position.y = -100;
                rotationaxis = 'x';
                break;
        }

        centerpivot.rotation[rotationaxis] += offset;

        this._hammers.push( {
            animatingGlow: false,
            glow: glow,
            glowColor: {},
            hammer: hammer,
            pivot: centerpivot,
            direction: 1,
            rate: rate,
            rotationaxis: rotationaxis,
            note: tone }
        );

        this.add(centerpivot, 'hammer');
    }
}
