
chrome.extension.sendMessage({}, function(extensionLoad) {

	var readyStateCheckInterval = setInterval(function() {

		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
	
			var script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three.min.js';
			script.async = 1;
			script.addEventListener('load', function (e) {
				console.log('scriptloaded')
			})

			document.querySelector('head').appendChild(script)

			var controlWrapper = document.querySelector('.ytp-right-controls');
			var launcher = document.createElement('button');
			launcher.className = 'shader-launcher';
			controlWrapper.appendChild( launcher );

			var s = document.createElement('script');
			s.src = chrome.extension.getURL('src/script.js');
			document.querySelector('head').appendChild(s)

			var shaderScript = document.createElement('script');
			shaderScript.id = 'frag';
			shaderScript.type = 'x-shader/x-fragment';

			fetch( chrome.extension.getURL('src/shaders/circles.frag'), {
				method: 'get'
			}).then(function(response) {
				return response.text()
			}).then(function(response){
				shaderScript.innerHTML = response;
			});

			document.querySelector('head').appendChild(shaderScript);
		}
	}, 10);
});
