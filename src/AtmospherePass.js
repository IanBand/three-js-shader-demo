// WIP
import {
	Color,
	MeshDepthMaterial,
	NearestFilter,
	NoBlending,
	RGBADepthPacking,
	ShaderMaterial,
	UniformsUtils,
	WebGLRenderTarget
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { AtmosphereShader } from './AtmosphereShader.js';

/**
 * Depth-of-field post-process with Atmosphere shader
 */

class AtmospherePass extends Pass {

	constructor( scene, camera, params ) {

		super();

		this.scene = scene;
		this.camera = camera;

        /*
		const focus = ( params.focus !== undefined ) ? params.focus : 1.0;
		const aspect = ( params.aspect !== undefined ) ? params.aspect : camera.aspect;
		const aperture = ( params.aperture !== undefined ) ? params.aperture : 0.025;
		const maxblur = ( params.maxblur !== undefined ) ? params.maxblur : 1.0;
        */

		// render targets

		const width = params.width || window.innerWidth || 1;
		const height = params.height || window.innerHeight || 1;

		this.renderTargetDepth = new WebGLRenderTarget( width, height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter
		} );

		this.renderTargetDepth.texture.name = 'AtmospherePass.depth';

		// depth material

		this.materialDepth = new MeshDepthMaterial();
		this.materialDepth.depthPacking = RGBADepthPacking;
		this.materialDepth.blending = NoBlending;

		// Atmosphere material

		if ( AtmosphereShader === undefined ) {

			console.error( 'THREE.AtmospherePass relies on AtmosphereShader' );

		}

		const AtmosphereShader = AtmosphereShader;
		const AtmosphereUniforms = UniformsUtils.clone( AtmosphereShader.uniforms );

		AtmosphereUniforms[ 'tDepth' ].value = this.renderTargetDepth.texture;

		AtmosphereUniforms[ 'focus' ].value = focus;
		AtmosphereUniforms[ 'aspect' ].value = aspect;
		AtmosphereUniforms[ 'aperture' ].value = aperture;
		AtmosphereUniforms[ 'maxblur' ].value = maxblur;
		AtmosphereUniforms[ 'nearClip' ].value = camera.near;
		AtmosphereUniforms[ 'farClip' ].value = camera.far;

		this.materialAtmosphere = new ShaderMaterial( {
			defines: Object.assign( {}, AtmosphereShader.defines ),
			uniforms: AtmosphereUniforms,
			vertexShader: AtmosphereShader.vertexShader,
			fragmentShader: AtmosphereShader.fragmentShader
		} );

		this.uniforms = AtmosphereUniforms;
		this.needsSwap = false;

		this.fsQuad = new FullScreenQuad( this.materialAtmosphere );

		this._oldClearColor = new Color();

	}

	render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;

		renderer.getClearColor( this._oldClearColor );
		const oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( 0xffffff );
		renderer.setClearAlpha( 1.0 );
		renderer.setRenderTarget( this.renderTargetDepth );
		renderer.clear();
		renderer.render( this.scene, this.camera );

		// Render Atmosphere composite

		this.uniforms[ 'tColor' ].value = readBuffer.texture;
		this.uniforms[ 'nearClip' ].value = this.camera.near;
		this.uniforms[ 'farClip' ].value = this.camera.far;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		this.scene.overrideMaterial = null;
		renderer.setClearColor( this._oldClearColor );
		renderer.setClearAlpha( oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	}

}

export { AtmospherePass };