var midiEnabled = false;
var useMidiRelease = false;

function getMIDIMessage(midiMessage) {
	//console.log(midiMessage);
	if (midiMessage.data[0] == 144 && midiMessage.data[2] != 0) {		// NOTE_ON
		document.getElementById("attack").value = Math.min(10, 10 - midiMessage.data[2] / 128 * 14);
		keysPressed = [65, 68];
	}
	else if (midiMessage.data[0] == 128 || midiMessage.data[2] == 0) {	// NOTE_OFF
		if (useMidiRelease) {
			document.getElementById("release").value = Math.min(4, 4 - midiMessage.data[2] / 128 * 7);
		}
		keysPressed = [];
	}
}

function onMIDIFailure() {
	console.log("Could not access your MIDI devices.");
}

function onMIDISuccess(midiAccess) {
	console.log(midiAccess);

	var inputs = midiAccess.inputs;
	console.log(inputs);
	for (var input of midiAccess.inputs.values()) {
		input.onmidimessage = getMIDIMessage;
	}

	midiEnabled = true;
}

function reqMidi() {
	navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}