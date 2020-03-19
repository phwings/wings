'use strict'

const ftpd = require('simple-ftpd')
var fs = require('fs')
ftpd({ host: '10.54.108.19', port: 1337, root: '' }, (session) => {

  session.on('pass', (username, password, cb) => {
    if (username === '193199' && password === 'nakalim0t') {
      session.readOnly = false
      session.root = '/users/eric.colmenares/documents/auth'
      cb(null, 'Welcome admin')
    } else {
      cb(null, 'Welcome guest')
    }
  })

  session.on('stat', fs.stat)
  // AKA
  // session.on('stat', (pathName, cb) => {
  //  fs.stat(pathName, cb)
  // })

  session.on('readdir', fs.readdir)
  // AKA
  // session.on('readdir', (pathName, cb) => {
  //   fs.readdir(pathName, cb)
  // })

  session.on('read', (pathName, offset, cb) => {
    cb(null, fs.createReadStream(pathName, { start: offset }))
  })

  session.on('write', (pathName, offset, cb) => {
    cb(null, fs.createWriteStream(pathName, { start: offset }))
  })

  // I'd do some checking if I were you, but hey.

  session.on('mkdir', fs.mkdir)
  session.on('unlink', fs.unlink)
  session.on('rename', fs.rename)
  session.on('remove', require('rimraf'))
})