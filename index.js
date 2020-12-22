const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const path = require('path')

const CreateWindow = () => {
	const window = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight:800,
		backgroundColor: "white",
		webPreferences: {
			nodeIntegrationInWorker: true,
			nodeIntegration: true
		}
	})

	window.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

require('electron-reload')(__dirname, {
	electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

ipcMain.on('asynchronous-message', (event, arg) => {
	console.log("heyyyy",arg) // prints "heyyyy ping"
})

app.whenReady().then(CreateWindow);
