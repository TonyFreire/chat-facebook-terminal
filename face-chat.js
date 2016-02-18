//Done by N1Z (TonyFreire)
const colors = require('colors');
const open = require("open");
const readlineSync = require('readline-sync');
readlineSync._DBG_set_useExt(true);
const login = require("facebook-chat-api");
const InfiniteLoop = require('infinite-loop');
var whil = new InfiniteLoop();
var status=0;


login({email: "YOUREMAIL", password: "PASS"}, function callback (err, api) {
    if(err) return console.error(err);
  
    whil.add(chat, api);
    whil.run();
   
});

chat = function (api){
    if (status==0){
        status = readlineSync.question("option?\n1- search friend\n2- listen\n3- Exit\n".bold.blue);
        if (status==1 || status==2 || status==3){}
        else{
            status=0
        }
    }
    if (status==1){
        status=4;
        sendMsg(api);
    }
    if (status==2){
        status=4;
        list(api);
                  
    }
    if (status==3){
        process.exit();
                  
    }
}

sendMsg =function (api){    
    var name = readlineSync.question("What name? \n".bold.blue);
    api.getUserID(name, function(err, data) {
        if(err) return callback(err);                    
        for(i=0;i<data.length;i++){
            console.log(i + " "+data[i].name);
        }
        var to = readlineSync.question("Who? (select number)\n (n to cancel)\n".bold.blue);
        if (to ==='n'){
            status=0;
            return
        }
        var threadID = data[to].userID;
        var text = readlineSync.question("text? (n to cancel)\n".bold.blue);
        if (text ==='n'){
            status=0;
            return
        }
           
        api.sendMessage(text,threadID , function(err,data){
            console.log("Message sent".bold.blue);
            status=0;
        });
           
                                 
    });
}

list =function(api){
    var stopListening = api.listen(function(err, event) {


        if(err) return console.error(err);              
            switch(event.type) {
                case "message":
                    if (event.body!==''){
                        console.log(event.senderName+": "+event.body); 

                    }
                    if (event.attachments.length>0){
                        var photos = readlineSync.question("Photos? (n to cancel)\n".bold.blue);
                        
                        if (photos ==='n'){
                            status=0;
                            return
                        }
                        for(i=0;i<event.attachments.length;i++){
                                
                            open(event.attachments[i]['url']);
                        }                       
                    }                              
                    var msg = readlineSync.question("answer? (n to cancel)\n".bold.blue);     
                        if (msg ==='n'){
                            status=0;
                            return
                        }         
                    api.sendMessage(msg, event.threadID);    
                    api.markAsRead(event.threadID, function(err) {
                        if(err) console.log(err);                                             
                    });

                                                                                                     
            }
                                 
        });
        process.on('SIGINT', function() {
            console.log('\n');   
            status=0
            return   
        });



}


