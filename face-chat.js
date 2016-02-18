/*
 * face-chat
 * https://github.com/TonyFreire/chat-facebook-terminal
 *
 * Copyright (c) 2016 António Freire
 * Licensed under the MIT license.
 */

//Done by N1Z (TonyFreire)
const colors = require('colors');
const open = require("open");
const readlineSync = require('readline-sync');
readlineSync._DBG_set_useExt(true);
const login = require("facebook-chat-api");
const InfiniteLoop = require('infinite-loop');
const Delete = require('./change_modules.js');
var whil = new InfiniteLoop();
var status=0;
Delete.clean(); //clean a line module

var user_email = readlineSync.question("Email?: ".bold.blue);
var user_pass = readlineSync.question("Password: ".bold.blue, {hideEchoBack: true});

login({email: user_email, password: user_pass}, function callback (err, api) {
    if(err) return console.error(err);
  
    whil.add(chat, api); //infinite loop 
    whil.run();
   
});

chat = function (api){ //Menu to choose what mode you want
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

sendMsg =function (api){  //search a friend and send a message  
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

list =function(api){ // wait and answer to any message
    var stopListening = api.listen(function(err, event) {


        if(err) return console.error(err);              
            switch(event.type) {
                case "message":
                    if (event.body!==''){
                        console.log(event.senderName.bold.red+": ".bold.red+event.body); 

                    }
                    if (event.attachments.length>0){
                        var photos = readlineSync.question("Photos? (n to cancel)\n".bold.blue);
                        
                        if (photos !=='n'){
                           for(i=0;i<event.attachments.length;i++){
                                
                            open(event.attachments[i]['url']); //open photos in a browser
                        }  
                        }
                                             
                    }                              
                    var msg = readlineSync.question("answer? (n to cancel)\n".bold.blue);     
                        if (msg !=='n'){
                            
                            api.sendMessage(msg, event.threadID);   
                            
                        }         
                     
                    api.markAsRead(event.threadID, function(err) {
                        if(err) console.log(err);                                             
                    });

                                                                                                     
            }
                                 
        });
        process.on('SIGINT', function() { // exit of listen mode, with ctrl-c, and go to Menu (chat) 
            console.log('\n');   
            status=0
            return   
        });



}

