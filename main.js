// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog } = require('electron')
// var remote = require('remote');
// var dialog = remote.require('dialog');

// Live reload module which watches `public` folder
// const _ = require('electron-reload')(__dirname + '/public')

const path = require('path');
const url = require('url');
const fs = require('fs');
const parse = require('csv-parse');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
let mainWindow;
let currentFileName;
let currentBacklog = [];

// A function to create the browser window when the app is ready
function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // center: true,
        // frame: false,
        // resizable: false,
        // alwaysOnTop: true,
        useContentSize: true // when false, width/height will set the size of the whole app, including frames. If true, innerWindow will be set instead, resulting in a bigger app window
    })

    // Load the index.html of the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'public/personal', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools on start
    // mainWindow.webContents.openDevTools("undock")

    // Emitted when the window is closed
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.on('ready', () => {
    mainWindow = new BrowserWindow({})

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'public/personal', 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    mainWindow.maximize();

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    Menu.setApplicationMenu(mainMenu)
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// open a backlog file from disk. Backlog is in id,description,,story points, complexity
function openFile () {
  var options = {
    defaultPath: './backlogs'
  }
  dialog.showOpenDialog(options, function (fileNames) {
      if (fileNames === undefined) {
        console.log('No File')
      } else {
        // read the file and send the details to the list
        currentFileName = fileNames[0];
        fs.readFile(currentFileName, function (err, data) {
          if (err) return console.error(err);
          parse(data, {comment: '#'}, function(err, output){
            if (err) return console.error(err);
            // ready to paste new items from file
            mainWindow.webContents.send('item:clear');

            output.forEach(function(row) {
              console.log(row);
              currentBacklog.push(row[0] + ',' + row[1] + ',' + row[2] + ',' + row[3] + '\n');
              mainWindow.webContents.send('item:add', row[1])
            });
          });
       });
      }
  });
}

//Save File
function saveFile () {

  dialog.showSaveDialog({ filters: [
     { name: currentFileName, extensions: ['csv'] }
    ]},

    function (fileName) {

    if (fileName === undefined) return;

    // Need to grab the backlog and make csv. Will convert to json when model is mature

    if ( currentBacklog.length > 0 ) {
      // parse currentBacklog to CSV
      let _content = '';
      currentBacklog.forEach(function(row) {
        _content += row;
      })

      // write to disk
      fs.writeFile(fileName, _content, function (err) {
        dialog.showMessageBox({ message: "The file has been saved! :-)",
         buttons: ["OK"] });
       });
    }
  });
}


//Save File As
function saveFileAs () {

  dialog.showSaveDialog({ filters: [
     { name: 'csv', extensions: ['csv'] }
    ]}, function (fileName) {

    if (fileName === undefined) return;

    fs.writeFile(fileName, currentBacklog.toString(), function (err) {
     dialog.showMessageBox({ message: "The file has been saved! :-)",
      buttons: ["OK"] });
    });
  });
}



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Backlog',
          click() {
            mainWindow.webContents.send('item:clear')
          }
        },
        {
          label: 'Open backlog',
          accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
          click(item, focussedWindow) {
            // file open dailog, then read and display in ul
            openFile();
          }
        },
        {
          label: 'Save backlog',
          accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
          click(item, focussedWindow) {
            // file open dailog, then read and display in ul
            saveFile();
          }
        },
        {
          label: 'Save backlog As',
          accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
          click(item, focussedWindow) {
            // file open dailog, then read and display in ul
            saveFileAs();
          }
        },
        {
          label: 'Quit',
          accelerator: process.platform == 'darwin' ? 'command+Q' : 'CTRL+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Envelope',
      submenu: [
        {
          label: 'Add PBI',
          click() {
            createAddWindow()
          }
        },
        {
          label: 'Edit PBI',
          click() {

          }
        },
      ]
    }
  ]

  // if mac add empty object to mac
  if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
  }

  // add developer tools if not in production

  if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focussedWindow) {
            focussedWindow.toggleDevTools()
          }
        },
        {
          role: 'reload'
        }
      ]
    })
  }