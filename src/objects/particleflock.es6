import BaseGroup from '../../node_modules/trivr/src/basegroup.es6';
import Style from '../themeing/style.es6';
import Utils from '../utils.es6';
import Shaders from '../shaders.es6';

export default class ParticleFlock extends BaseGroup {
    /**
     * on create scene
     * @param scene
     * @param custom
     */
    onCreate(scene, custom) {
        this.flockGPURenderer = {
            gpuCompute: null,
            velocityVariable: null,
            positionVariable: null,
            positionUniforms: null,
            velocityUniforms: null,
            uniforms: null
        };

        this._color;

        /* TEXTURE WIDTH FOR SIMULATION */
        this.WIDTH = 64;

        var BIRDS = this.WIDTH * this.WIDTH;

        this.mouseX = 0;
        this.mouseY = 0;
        this.BOUNDS = 1000;
        this.BOUNDS_HALF = this.BOUNDS / 2;

        this.immersed = false;
        this.immersionLevels = { min: -200.0, max: 2000.0 };
        this.initComputeRenderer(scene.renderer);

        /*document.addEventListener( 'mousemove', e => this.onDocumentMouseMove(e), false );
        document.addEventListener( 'touchstart', e => this.onDocumentTouchStart(e), false );
        document.addEventListener( 'touchmove', e => this.onDocumentTouchMove(e), false );*/
        this.initBirds();
    }

    onDocumentMouseMove( event ) {
        this.mouseX = event.clientX - 600;//- windowHalfX;
        this.mouseY = event.clientY - 600;//- windowHalfY;
    }

    onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {

            event.preventDefault();

            this.mouseX = event.touches[ 0 ].pageX - 600;//- windowHalfX;
            this.mouseY = event.touches[ 0 ].pageY - 600;//- windowHalfY;

        }
    }

    onDocumentTouchMove( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            this.mouseX = event.touches[ 0 ].pageX - 600;//windowHalfX;
            this.mouseY = event.touches[ 0 ].pageY - 600;//windowHalfY;

        }
    }

    /**
     * set drum hit/trigger color
     * @param hex
     */
    setColor(hex) {
        var color;
        if (hex) {
            color = Utils.decToRGB(hex, 1);
            this.immersed = true;
        } else {
            color = Utils.decToRGB(Style.floatingparticles.color, 1);
            this.immersed = false;
        }

        if (!this._color ) {
            this._color = color;
            this.mesh.material.uniforms.color.value = [ this._color.r, this._color.g, this._color.b ];
        } else {
            this._color.animating = true;
            createjs.Tween.get(this._color)
                .to(color, 2000)
                .wait(100) // wait a few ticks, or the render cycle won't pick up the changes with the flag
                .call( function() { this.animating = false; });
        }
    }

    onRender(time) {

        if (this.immersed && this.flockGPURenderer.positionUniforms.depth.value < this.immersionLevels.max) {
            this.flockGPURenderer.positionUniforms.depth.value += 1.0;
        }

        if (!this.immersed && this.flockGPURenderer.positionUniforms.depth.value > this.immersionLevels.min) {
            this.flockGPURenderer.positionUniforms.depth.value -= 1.0;
        }

        var delta = time.delta / 1000;
        if (delta > 1) delta = 1;
        this.flockGPURenderer.positionUniforms.time.value = time.now;
        this.flockGPURenderer.positionUniforms.delta.value = delta;
        this.flockGPURenderer.velocityUniforms.time.value = time.now;
        this.flockGPURenderer.velocityUniforms.delta.value = delta;
        this.flockGPURenderer.uniforms.time.value = time.now;
        this.flockGPURenderer.uniforms.delta.value = delta;
        //this.flockGPURenderer.uniforms.depth.value = -200.0;

        //this.flockGPURenderer.velocityUniforms.predator.value.set( 0.5 * this.mouseX / 600, - 0.5 * this.mouseY / 600, 0 );
        this.flockGPURenderer.gpuCompute.compute();

        this.flockGPURenderer.uniforms.texturePosition.value = this.flockGPURenderer.gpuCompute.getCurrentRenderTarget( this.flockGPURenderer.positionVariable ).texture;
        this.flockGPURenderer.uniforms.textureVelocity.value = this.flockGPURenderer.gpuCompute.getCurrentRenderTarget( this.flockGPURenderer.velocityVariable ).texture;

        if (this._color.animating) {
            this.mesh.material.uniforms.color.value = [ this._color.r, this._color.g, this._color.b ];
        }
    }

    initComputeRenderer(renderer) {
        this.flockGPURenderer.gpuCompute = new GPUComputationRenderer( this.WIDTH, this.WIDTH, renderer );
        var dtPosition = this.flockGPURenderer.gpuCompute.createTexture();
        var dtVelocity = this.flockGPURenderer.gpuCompute.createTexture();
        this.fillPositionTexture( dtPosition );
        this.fillVelocityTexture( dtVelocity );

        this.flockGPURenderer.velocityVariable = this.flockGPURenderer.gpuCompute.addVariable( "textureVelocity", Shaders.flockvelocity.fragment, dtVelocity );
        this.flockGPURenderer.positionVariable = this.flockGPURenderer.gpuCompute.addVariable( "texturePosition", Shaders.flockposition.fragment, dtPosition );

        this.flockGPURenderer.gpuCompute.setVariableDependencies( this.flockGPURenderer.velocityVariable, [ this.flockGPURenderer.positionVariable, this.flockGPURenderer.velocityVariable ] );
        this.flockGPURenderer.gpuCompute.setVariableDependencies( this.flockGPURenderer.positionVariable, [ this.flockGPURenderer.positionVariable, this.flockGPURenderer.velocityVariable ] );

        this.flockGPURenderer.positionUniforms = this.flockGPURenderer.positionVariable.material.uniforms;
        this.flockGPURenderer.velocityUniforms = this.flockGPURenderer.velocityVariable.material.uniforms;

        this.flockGPURenderer.positionUniforms.time = { value: 0.0 };
        this.flockGPURenderer.positionUniforms.delta = { value: 0.0 };
        this.flockGPURenderer.positionUniforms.depth = { value: -200.0 };
        this.flockGPURenderer.velocityUniforms.time = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.delta = { value: 0.0 };
        this.flockGPURenderer.velocityUniforms.testing = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.seperationDistance = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.alignmentDistance = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.cohesionDistance = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.freedomFactor = { value: 1.0 };
        this.flockGPURenderer.velocityUniforms.predator = { value: new THREE.Vector3() };
        this.flockGPURenderer.velocityVariable.material.defines.BOUNDS = this.BOUNDS.toFixed( 2 );

        this.flockGPURenderer.velocityVariable.wrapS = THREE.RepeatWrapping;
        this.flockGPURenderer.velocityVariable.wrapT = THREE.RepeatWrapping;
        this.flockGPURenderer.positionVariable.wrapS = THREE.RepeatWrapping;
        this.flockGPURenderer.positionVariable.wrapT = THREE.RepeatWrapping;

        var error = this.flockGPURenderer.gpuCompute.init();
        if ( error !== null ) {
            console.error( error );
        }
    }

    initBirds() {
        var geometry = new THREE.SwarmParticleGeometry(this.WIDTH);

        // For Vertex and Fragment
        this.flockGPURenderer.uniforms = {
            color: { value: [0.0,0.0,0.0] },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            time: { value: 1.0 },
            delta: { value: 0.0 }
        };

        // ShaderMaterial
        var material = new THREE.ShaderMaterial( {
            uniforms:       this.flockGPURenderer.uniforms,
            vertexShader:   Shaders.flock.vertex,
            fragmentShader: Shaders.flock.fragment,
            //side: THREE.DoubleSide
            //transparent: true
        });

        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.rotation.y = Math.PI / 2;
        // this.mesh.position.z = -100;
        // this.mesh.position.y = -10;
        /*this.mesh.scale.x = .2;
        this.mesh.scale.y = .2;
        this.mesh.scale.z = .2;*/
        this.mesh.matrixAutoUpdate = true;
        this.mesh.updateMatrix();

        this.add(this.mesh);
        this.setColor();

    }

    fillPositionTexture( texture ) {
        var theArray = texture.image.data;

        for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {

            var x = (Math.random() * this.BOUNDS - this.BOUNDS_HALF)/1;
            var y = (Math.random() * this.BOUNDS - this.BOUNDS_HALF)/1;
            var z = (Math.random() * this.BOUNDS - this.BOUNDS_HALF)/1;

            theArray[ k + 0 ] = x;
            theArray[ k + 1 ] = y;
            theArray[ k + 2 ] = z;
            theArray[ k + 3 ] = 1;
        }
    }

    fillVelocityTexture( texture ) {
        var theArray = texture.image.data;

        for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
            var x = Math.random() - 0.5;
            var y = Math.random() - 0.5;
            var z = Math.random() - 0.5;

            theArray[ k + 0 ] = x * 10;
            theArray[ k + 1 ] = y * 10;
            theArray[ k + 2 ] = z * 10;
            theArray[ k + 3 ] = 1;
        }
    }

}
