const { app, BrowserWindow, dialog } = require('electron');

let mainWindow;

function start() {
	mainWindow = new BrowserWindow({
		show: false,
		frame: true,
		backgroundColor: "#1A1A1A",
		center: true,
		fullscreenable: false,
		title: "BLEDOM Controller",
		darkTheme: true,
		vibrancy: "dark",
		titleBarStyle: 'hiddenInset',
		minWidth: 450,
		minHeight: 500,
		webPreferences: {
			devTools: true,
			defaultFontFamily: 'sansSerif',
			defaultFontSize: 15,
			nativeWindowOpen: false,
			experimentalFeatures: true
		},
		icon: __dirname + "/buildResources/icon.ico"
	});

	mainWindow.setMenu(null);
	mainWindow.loadFile("ui.html");

	mainWindow.on('closed', function(event) {
		console.log("Quitting...");
		app.quit();
	});
}

app.on('ready', function() {
	console.log("App is ready!");
	console.log('Node v' + process.versions.node);
	console.log('Electron v' + process.versions.electron);
	console.log('Chrome v' + process.versions.chrome);
	console.log('App v' + app.getVersion());

	if (process.platform === "linux") {
		app.commandLine.appendSwitch("enable-experimental-web-platform-features", true);
	}
	else {
		app.commandLine.appendSwitch("enable-web-bluetooth", true);
	}
	start();
});