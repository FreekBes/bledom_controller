var keyDebug = false;
var keysPressed = [];
var onlyOneKey = false;
var useKbd = false;

window.addEventListener("keydown", function(e) {
	if (e.target.type != 'text' && e.target.nodeName != 'TEXTAREA' && e.target.getAttribute("contenteditable") == null) {
		
		var key = e.keyCode || e.which;
		
		if (keyDebug === true) {
			console.log("Keycode for KEYDOWN: " + key);
		}

		if (keysPressed.indexOf(key) == -1) {
			keysPressed.push(key);
			switch(key) {
				case 65:	// [A]
					//setColor(255, 0, 0);
					//brightness[0] = 255;
					//keyPressed = true;
					break;
				case 83:	// [S]
					//setColor(0, 255, 0);
					//brightness[1] = 255;
					//keyPressed = true;
					break;
				case 68:	// [D]
					//setColor(0, 0, 255);
					//brightness[2] = 255;
					//keyPressed = true;
					break;
				case 116:	// [F5]
					window.location.reload();
					break;
			}
		}

		return false;
	}
});

window.addEventListener("keyup", function(e) {
	if (e.target.type != 'text' && e.target.nodeName != 'TEXTAREA' && e.target.getAttribute("contenteditable") == null) {
		
		var key = e.keyCode || e.which;
		
		if (keyDebug === true) {
			console.log("Keycode for KEYUP: " + key);
		}

		keyPressed = false;

		if (keysPressed.indexOf(key) > -1) {
			keysPressed.splice(keysPressed.indexOf(key), 1);
			switch(key) {
				case 65:	// [A]
					//brightness[0] = 0;
					break;
				case 83:	// [S]
					//brightness[1] = 0;
					break;
				case 68:	// [D]
					//brightness[2] = 0;
					break;
			}
		}

		return false;
	}
});