var autoControl = false;
var bpm = 138;
var autoSequence = [
	[255, 0, 0],
	[, 0, 0],
	[255, 0, 255],
	[0, 0, 0],
	[255, 0, 0],
	[0, 0, 0],
	[255, 0, 255],
	[0, 0, 0],
	[255, 0, 0],
	[0, 0, 0],
	[255, 0, 255],
	[0, 0, 0],
	[255, 0, 0],
	[0, 0, 0],
	[255, 0, 255],
	[0, 0, 0]
];
var autoPos = 0;

function setBPM(newBpm) {
	if (newBpm > 0) {
		bpm = newBpm;
	}
}

function autoLooper() {
	if (autoControl) {
		if (autoPos >= autoSequence.length) {
			autoPos = 0;
		}
		setColor(autoSequence[autoPos][0], autoSequence[autoPos][1], autoSequence[autoPos][2]);
		console.log(autoPos);
		autoPos++;
		setTimeout(autoLooper, 60000 / (bpm * 2));
	}
}