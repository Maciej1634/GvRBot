const dsc = require("discord.js");
const config = require("../config/config.js");
const randomFunc = require("../src/randomFunc.js"); // random-based functions
const basicFunc = require("../src/basicFunc.js"); // base functions
const textFunc = require("../src/textFunc.js"); // text functions
const musicFunc = require("../src/music.js") //music functions
const apikey = require("../config/apikey.js");
//const { Speaking_turtle } = require("./speaking_turtle.js");
require('console');
//connection with account

const client = new dsc.Client();

client.login(apikey.private.key);




//Youtube-music init
var ytm = new musicFunc.YTMusic();

//changing activity status

client.once("ready", () => {
  client.user.setActivity(config.main.activity.text, {
    type: `${config.main.activity.type}`
  });
});

client.on("message", msg => {
  ///                                   LOGING ALL DMs SENDING TO BOT  TODO://zeby nie spamil mi na dm ><
  console.log("widze");
  try{
  if (msg.channel.type == "dm") {
    if (msg.author.id != "613750972392538182") {
      client.users
        .get("348177295787294721")
        .send(msg.content + " autor: " + msg.author.username);
    }
    if (msg.attachments) {
      const x = msg.attachments.array();
      if (typeof x[0] != "undefined")
        client.users.get("348177295787294721").send(x[0].url);
    }
  }
  //                 TEST MESSAGE
  console.log(msg.content.length);
  if (msg.content.startsWith(config.main.prefix)) {
    msg.content = msg.content.slice(config.main.prefix.length);
    
    if (msg.content.startsWith('ping')) {
      msg.channel.send("*pong!*");
      console.log("ping");
      return 0;
    }
    /*
    //
    //                  BASIC FUNCTIONS                 
    //
    */
    //                   SHOW

    if (msg.content.startsWith('show')) {
      basicFunc.show(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }
    /*
    //
    //                   RANDOM FUNCTIONS                        
    //
    */
    //                      DICE
    if (msg.content.startsWith('dice')) {
      randomFunc.dice(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }
    /*
    //
    //                   TEXT FUNCTIONS                        
    //
    */
    //                   UP AND DOWN
    if (msg.content.startsWith('UpDown')) {
      textFunc.upDown(msg);
      return 0;
    }
    //                      POKELANG
    if (msg.content.startsWith('pokelang')) {
      textFunc.pokelang(msg);
    }
    /*
    //
    //                   MUSIC FUNCTIONS                        
    //
    */
    // if (msg.content.startsWith('find')) {
    //   m.find(msg);
    //   return 0;
    // }
    if (msg.content.startsWith('play')) {
      let song = basicFunc.parseParams(msg.content)[0]
      if(song.match(/playlist[\?]/)){
        ytm.findPlayList(msg, song);
      }else{
        if (song.startsWith("https://")){
          ytm.exec(msg, song)
        }else{
          ytm.find(msg);
        }
      }
      return 0;
    }
    if (msg.content.startsWith('skip')) {
      ytm.skip(msg);
      return 0;
    }
    if (msg.content.startsWith('shuffle')) {
      ytm.shuffle(msg);
      msg.channel.send("Shuffled!");
      return 0;
    }
    if (msg.content.startsWith('stop')) {
      ytm.stop(msg);
      return 0;
    }
  }
}catch(err){
  msg.channel.send("Error: ");
  msg.channel.send(err);
}
});

