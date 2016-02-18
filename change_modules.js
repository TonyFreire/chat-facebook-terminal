const fs = require('fs');
var file="node_modules/facebook-chat-api/src/listen.js"
module.exports.clean=function(){
	console.log("delete");	

	fs.readFile(file, 'utf8', function (err,data) {
        if (err) {
                return console.log(err);
                  
        }
        if (data.indexOf("//log.info")==-1){
        	var result = data.replace(/log.info/g, '//log.info');
          	fs.writeFile(file, result, 'utf8', function (err) {
                if (err) return console.log(err);
                console.log("done");	
                     
            });
        }
	});
}