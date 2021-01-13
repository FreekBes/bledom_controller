var keyDebug = false;
var keyPressed = false;

window.addEventListener("keydown", function(e) {
	if (e.target.type != 'text' && e.target.nodeName != 'TEXTAREA' && e.target.getAttribute("contenteditable") == null && !keyPressed) {
		
		var key = e.keyCode || e.which;
		
		if (keyDebug === true) {
			console.log("Keycode for KEYDOWN: " + key);
		}

		keyPressed = true;

		switch(key) {
			case 65:	// [A]
				setColor(255, 0, 0);
				break;
			case 83:	// [S]
				setColor(0, 255, 0);
				break;
			case 68:	// [D]
				setColor(0, 0, 255);
				break;
			case 116:	// [F5]
				window.location.reload();
				break;
		}

		return false;
	}
});

window.addEventListener("keyup", function(e) {
	if (e.target.type != 'text' && e.target.nodeName != 'TEXTAREA' && e.target.getAttribute("contenteditable") == null && keyPressed) {
		
		var key = e.keyCode || e.which;
		
		if (keyDebug === true) {
			console.log("Keycode for KEYUP: " + key);
		}

		keyPressed = false;

		switch(key) {
			case 65:	// [A]
			case 83:	// [S]
			case 68:	// [D]
				break;
		}

		return false;
	}
});