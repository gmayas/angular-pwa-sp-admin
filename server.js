const express = require('express');
const path = require('path');

const dotenv = require ('dotenv');
require('dotenv').config();

const app = express();

app.use(express.static(__dirname + '/dist/pwa-gmayas-angular'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/pwa-gmayas-angular/index.html'))
});

app.listen(process.env.PORT || 8000);
console.log('Server on port: ', process.env.PORT || 8000);
