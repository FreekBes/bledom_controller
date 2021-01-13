var loc = window.location.href+'';
if (loc.indexOf('http://') == 0) {
	window.location.href = loc.replace('http://','https://');
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function limitHex(number) {
	if (number > 255) {
		return 255;
	}
	else if (number < 0) {
		return 0;
	}
	return number;
}

function limitPerc(number) {
	if (number > 100) {
		return 100;
	}
	else if (number < 0) {
		return 0;
	}
	return number;
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

if ('bluetooth' in navigator && 'permissions' in navigator) {
	document.getElementById("yesyes").style.display = "block";
}
else {
	document.getElementById("nosupport").style.display = "block";
}

function onDisconnected(event) {
	const device = event.target;
	console.log(`Device ${device.name} is disconnected.`);
}

var char = null;
function searchBLEDom() {
	navigator.bluetooth.requestDevice({
		filters: [
			{ services: ['0000fff0-0000-1000-8000-00805f9b34fb'] }
		]
	}).then(function(device) {
		console.log(device);
		device.addEventListener('gattserverdisconnected', onDisconnected);
		return device.gatt.connect();
	}).then(function(server) {
		console.log(server);
		return server.getPrimaryService('0000fff0-0000-1000-8000-00805f9b34fb');
	}).then(function(service) {
		console.log(service);
		return service.getCharacteristic('0000fff3-0000-1000-8000-00805f9b34fb');
	}).then(function(characteristic) {
		console.log(characteristic);
		char = characteristic;
		document.getElementById("searchBtn").style.display = "none";
		document.getElementById("controls").style.display = "block";
		setInterval(attackRelease, 60);
	}).catch(function(err) {
		console.error(err);
	});
}

commandInProgress = false;
function sendCommand(command, onSuccess) {
	if (!commandInProgress) {
		commandInProgress = true;
		char.writeValue(command).then(function() {
			console.log("Command written to characteristic");
			commandInProgress = false;
			if (typeof onSuccess == 'function') {
				onSuccess();
			}
		}).catch(function(err) {
			commandInProgress = false;
			console.error(err);
		});
	}
	else {
		setTimeout(function() {
			sendCommand(command, onSuccess)
		}, 10);
	}
}

function setColor(r, g, b, onSuccess) {
	document.getElementById("customColorInput").value = rgbToHex(r, g, b);
	document.getElementById("modeSelect").value = "null";
	document.getElementById("dynamicSelect").value = "null";
	var command = new Uint8Array([0x7e, 0x00, 0x05, 0x03, limitHex(r), limitHex(g), limitHex(b), 0x00, 0xef]).buffer;
	sendCommand(command, onSuccess);
}

function setColorHex(hexColor, onSuccess) {
	if (hexColor == null || hexColor.trim() == "") {
		console.warn("Hex color is empty!");
		return;
	}
	var rgbColor = hexToRgb(hexColor);
	setColor(rgbColor.r, rgbColor.g, rgbColor.b, onSuccess);
}

function setBrightness(brightness, onSuccess) {
	var command = new Uint8Array([0x7e, 0x00, 0x01, limitHex(brightness), 0x00, 0x00, 0x00, 0x00, 0xef]).buffer;
	sendCommand(command, onSuccess);
}

function setEffectSpeed(speed) {
	var command = new Uint8Array([0x7e, 0x00, 0x02, limitPerc(speed), 0x00, 0x00, 0x00, 0x00, 0xef]).buffer;
	sendCommand(command);
}

function setModeEffect(effect) {
	var effects = {
		red: 0x80,
		blue: 0x81,
		green: 0x82,
		cyan: 0x83,
		yellow: 0x84,
		magenta: 0x85,
		white: 0x86,
		jump_rgb: 0x87,
		jump_rgbycmw: 0x88,
		gradient_rgb: 0x89,
		gradient_rgbycmw: 0x8a,
		gradient_r: 0x8b,
		gradient_g: 0x8c,
		gradient_b: 0x8d,
		gradient_y: 0x8e,
		gradient_c: 0x8f,
		gradient_m: 0x90,
		gradient_w: 0x91,
		gradient_rg: 0x92,
		gradient_rb: 0x93,
		gradient_gb: 0x94,
		blink_rgbycmw: 0x95,
		blink_r: 0x96,
		blink_g: 0x97,
		blink_b: 0x98,
		blink_y: 0x99,
		blink_c: 0x9a,
		blink_m: 0x9b,
		blink_w: 0x9c
	};
	if (effect in effects) {
		var command = new Uint8Array([0x7e, 0x00, 0x03, limitHex(effects[effect]), 0x03, 0x00, 0x00, 0x00, 0xef]).buffer;
		sendCommand(command);
	}
	else {
		throw new Exception(effect + " is not a valid effect");
	}
	document.getElementById("dynamicSelect").value = "null";
}

function setModeDynamic(dynamic) {
	var command = new Uint8Array([0x7e, 0x00, 0x03, limitHex(dynamic), 0x04, 0x00, 0x00, 0x00, 0xef]).buffer;
	sendCommand(command);
	document.getElementById("modeSelect").value = "null";
}

function setSensitivityForDynamicMode(sensitivity) {
	var command = new Uint8Array([0x7e, 0x00, 0x07, limitHex(sensitivity), 0x00, 0x00, 0x00, 0x00, 0xef]).buffer;
	sendCommand(command);
}

var brightness = 0;
var lastBrightness = 0;

function attackRelease() {
	var target = 0;
	var time = 1;
	if (keyPressed) {
		target = 100;
		time = parseFloat(document.getElementById("attack").value);
	}
	else {
		time = parseFloat(document.getElementById("release").value);
	}
	var threshold = 0.001;
	timeconstant = time * 44100 * 0.001;
	coeff = Math.pow(1.0 / threshold, -1.0 / timeconstant);
	brightness = Math.floor((coeff * brightness) + ( ( 1.0 - coeff ) * target));
	if (brightness != lastBrightness) {
		setBrightness(brightness);
		console.log(brightness);
	}
	lastBrightness = brightness;
}
