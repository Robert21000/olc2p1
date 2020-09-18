var fs = require('fs'); 
var parser = require('./hoja5');


/*fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());


});*/
try {
    parser.parse("if(14==21)");    
} catch (error) {
    console.log(error);
}

