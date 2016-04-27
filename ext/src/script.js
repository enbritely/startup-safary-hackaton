
/**
 * ShaderTube main loader
 * License: Apache 2.0
 * Author: Tibor Szász
 */
var container;
var camera, scene, renderer;
var uniforms;
var shader = "";
var vertexShader = "void main() { gl_Position = vec4( position, 1.0 ); }";
var inited = false;

function init() {
	console.log('render started')
	inited = true;
    container = document.getElementById( 'page-container' );

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

	var shader = document.querySelector('#frag').textContent;

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: shader
    });

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.domElement.id = 'shader-tube';
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    document.onmousemove = function(e){
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
}


/********************************
 *
 * INITIALIZER
 * 
 ********************************/

var THREELoaded = setInterval(function() {	

	if( typeof THREE !== 'undefined' ) {
		console.log("Hello. We are inside YouTube :)");

		clearInterval( THREELoaded );

		document.querySelector('.shader-launcher').addEventListener('click',function(){
			init();
			animate();
			launchIntoFullscreen( document.querySelector('#shader-tube') );
			// initAudioMonitor( document.querySelector('.html5-main-video') ); 
		});
	}
}, 10);


/********************************
 *
 * UTILS
 * 
 ********************************/

 function launchIntoFullscreen(element) {
   if(element.requestFullscreen) {
     element.requestFullscreen();
   } else if(element.mozRequestFullScreen) {
     element.mozRequestFullScreen();
   } else if(element.webkitRequestFullscreen) {
     element.webkitRequestFullscreen();
   } else if(element.msRequestFullscreen) {
     element.msRequestFullscreen();
   }
 }

 function exitFullscreen() {
   if(document.exitFullscreen) {
     document.exitFullscreen();
   } else if(document.mozCancelFullScreen) {
     document.mozCancelFullScreen();
   } else if(document.webkitExitFullscreen) {
     document.webkitExitFullscreen();
   }
 }

var globalVolume = 0;

var audioCtx = AudioContext;

function initAudioMonitor ( video ) {
	var sourceNode  = video;

	// Feed the HTMLMediaElement into it
	var source = audioCtx.createMediaElementSource( sourceNode );

	processor = audioCtx.createScriptProcessor(1024),
	/* Create an analyser node */
	analyser = audioCtx.createAnalyser();

	/* Wire the processor into our audio context. */
	processor.connect(audioCtx.destination);
	
	/* Wire the analyser into the processor */
	analyser.connect(processor);

	var data = new Uint8Array(analyser.frequencyBinCount);
	
	processor.onaudioprocess = function() {
	    /* Populate the data array with the frequency data. */
	    var array =  new Uint8Array(analyser.frequencyBinCount);
	    analyser.getByteFrequencyData(array);
	    var average = getAverageVolume(array);
	    console.log( average );
	};
}

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}
