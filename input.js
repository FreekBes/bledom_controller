async function getCaptureStream(displayMediaOptions) {
	var captureStream = null;

	try {
	  captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
	} catch(err) {
	  console.error("Error: " + err);
	}
	return captureStream;
}

var recorder = {};
var drawer = {
	draw: function() {
		recorder.analyser.getByteFrequencyData(recorder.dataArray);

		var barWidth = (window.innerWidth / recorder.bufferLength) * 2.5;
		var barHeight;
		var x = 0;

		drawer.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		for (var i = 0; i < recorder.bufferLength; i++) {
			barHeight = recorder.dataArray[i] * Math.floor(window.innerHeight / 142);
			drawer.context.fillStyle = 'rgb(18, ' + (recorder.dataArray[i] + 64) + ',64)';
			drawer.context.fillRect(x, window.innerHeight - barHeight / 2, barWidth, barHeight);
			drawer.context.fillRect(window.innerWidth - x - barWidth, window.innerHeight - barHeight / 2, barWidth, barHeight);
			x += barWidth + 1;
		}

		var now = Date.now();
		var elapsed = now - drawer.lastFrameTime;

		if (elapsed > drawer.fpsInterval) {
			drawer.lastFrameTime = now - (elapsed % drawer.fpsInterval);
			// var bPerc = 1.8 * Math.ceil(recorder.dataArray[drawer.beatBar] / 255 * 100) - 80;
			// var bPerc = 3.5 * Math.ceil(recorder.dataArray[drawer.beatBar] / 255 * 100) - 250;
			// var bPerc = 0.13 * Math.pow((Math.ceil(recorder.dataArray[drawer.beatBar] / 255 * 100) - 70), 2);
			// var bPerc = recorder.dataArray[drawer.beatBar] - 50;
			var bPerc = 0;
			for (i = 0; i < 4; i++) {
				if (recorder.dataArray[drawer.beatBar + i] > 0) {
					bPerc += recorder.dataArray[drawer.beatBar + i];
				}
			}
			bPerc = bPerc / 4 - drawer.reducer;
			// console.log(recorder.dataArray[drawer.beatBar] + " becomes " + Math.ceil(recorder.dataArray[drawer.beatBar] / 255 * 100) + " becomes " + bPerc);
			if (char != null) {
				if (recorder.dataArray[drawer.beatBar] > 0) {
					//console.log(Math.ceil((255 / recorder.dataArray[drawer.beatBar]) * 100));
					setBrightness(bPerc);
				}
				else {
					setBrightness(0);
				}
			}
		}
		requestAnimationFrame(drawer.draw);
	}
};

async function startCapture(button) {
	try {
		// cannot only capture audio, so video needs to be captured as well
		alert("In a moment you will be asked to select a screen or window to record. This does not matter.\nJust select 'Share system audio' at the bottom of the popup and press 'Share'.");
		var captureStream = await getCaptureStream({ video: true, audio: true });
		var audioTracks = captureStream.getAudioTracks();
		if (audioTracks.length > 0) {
			button.setAttribute("disabled", "");
			// create audio and context
			recorder.audio = new Audio();
			recorder.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			recorder.analyser = recorder.audioContext.createAnalyser();
			recorder.analyser.fftsize = 2048;
			recorder.analyser.smoothingTimeConstant = 0.8;
			recorder.bufferLength = recorder.analyser.frequencyBinCount;
			recorder.dataArray = new Uint8Array(recorder.bufferLength);
			recorder.source = recorder.audioContext.createMediaStreamSource(captureStream);

			// create filters
			recorder.filter = recorder.audioContext.createBiquadFilter();
			recorder.filter.type = "lowpass";
			recorder.filter.frequency.value = 8;
			recorder.gainNode = recorder.audioContext.createGain();
			recorder.gainNode.value = 1;

			// connect all Web Audio API elements together
			recorder.source.connect(recorder.filter);
			recorder.filter.connect(recorder.gainNode);
			recorder.gainNode.connect(recorder.analyser);
			// recorder.source.connect(recorder.audioContext.destination);

			// set up drawer
			drawer.canvas = document.getElementById("visualizer");
			drawer.canvas.setAttribute("width", window.innerWidth);
			drawer.canvas.setAttribute("height", window.innerHeight);
			window.addEventListener("resize", function(event) {
				drawer.canvas.setAttribute("width", window.innerWidth);
				drawer.canvas.setAttribute("height", window.innerHeight);
			});
			drawer.context = drawer.canvas.getContext("2d");
			drawer.beatBar = 2;
			drawer.fpsInterval = 1000 / 15;
			drawer.reducer = 0;
			drawer.lastFrameTime = Date.now();
			drawer.drawVisuals = requestAnimationFrame(drawer.draw);

			// play captureStream
			recorder.audio.srcObject = captureStream;
			recorder.audio.muted = true;
			recorder.audio.play();
		}
		else {
			alert("An error occurred: could not capture desktop audio");
		}
	} catch (err) {
		console.error(err);
	}
}
