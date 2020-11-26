const {app, BrowserWindow} = require('electron')
const path = require('path')

const CreateWindow = () => {
	const window = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight:800,
		backgroundColor: "white"
	})

	window.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

require('electron-reload')(__dirname, {
	electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

app.whenReady().then(CreateWindow);
