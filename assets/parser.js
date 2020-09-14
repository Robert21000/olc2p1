var fs = require('fs'); 
var parser = require('./Gramatica');
//const { createVerify } = require('crypto');
    fs.readFile('./entrada', (err, data) => {
        if (err) throw err;
        parser.parse(data.toString());    
    });

  