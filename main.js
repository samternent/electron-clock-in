var menubar = require('menubar')

var mb = menubar()

mb.on('ready', function ready () {
  console.log('app is ready')
})

mb.setOption('transparent', true)
mb.setOption('width', 300)
mb.setOption('height', 420)
