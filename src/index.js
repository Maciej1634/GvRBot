const dsc = require("discord.js");
const python = require("python-shell");
const config = require("../config/config.js");
const randomFunc = require("../src/randomFunc.js"); // random-based functions
const basicFunc = require("../src/basicFunc.js"); // base functions
const textFunc = require("../src/textFunc.js"); // text functions
const musicFunc = require("../src/music.js") //music functions
const apikey = require("../config/apikey.js");
const ytdl = require("ytdl-core");
const cp = require("child_process");
//connection with account
const client = new dsc.Client();
const queue = new Map();


client.login(apikey.private.key);


//changing activity status
const baseReg = new RegExp(`${config.main.prefix}`);
client.once("ready", () => {
  client.user.setActivity(config.main.activity.text, {
    type: `${config.main.activity.type}`
  });
});

client.on("message", msg => {
  ///                                   LOGING ALL DMs SENDING TO BOT  TODO://zeby nie spamil mi na dm ><

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

  if (msg.content.match(baseReg)) {
    const serverQueue = queue.get(msg.guild.id);
    let reg = new RegExp(`^${config.main.prefix}ping`);
    if (msg.content.match(reg)) {
      msg.channel.send("*pong!*");
      return 0;
    }
    /*
    //
    //                  BASIC FUNCTIONS                 
    //
    */
    //                   SHOW

    reg = new RegExp(`^${config.main.prefix}show`);
    if (msg.content.match(reg)) {
      basicFunc.show(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }
    /*
    //
    //                   RANDOM FUNCTIONS                        
    //
    */
    //                      DICE
    reg = new RegExp(`^${config.main.prefix}dice`);
    if (msg.content.match(reg)) {
      randomFunc.dice(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }
    /*
    //
    //                   TEXT FUNCTIONS                        
    //
    */
    //                   UP AND DOWN
    reg = new RegExp(`^${config.main.prefix}updown`);
    if (msg.content.match(reg)) {
      textFunc.upDown(msg);
      return 0;
    }
    //                     STORY
    reg = new RegExp(`^${config.main.prefix}story`);
    if (msg.content.match(reg)) {
      textFunc.story(msg);
      return 0;
    }
    //                      POKELANG
    reg = new RegExp(`^${config.main.prefix}pokelang`);
    if (msg.content.match(reg)) {
      textFunc.pokelang(msg);
    }
    /*
    //
    //                   MUSIC FUNCTIONS                        
    //
    */
    reg = new RegExp(`^${config.main.prefix}find`);
    if (msg.content.match(reg)) {
      musicFunc.find(msg);
      return 0;
    }
    reg = new RegExp(`^${config.main.prefix}play`);
    if (msg.content.match(reg)) {
      let song = basicFunc.parseParams(msg.content)[0]
      if (song.startsWith("http")){
        execute(msg,serverQueue);
      }else{
        find(msg,true,serverQueue);
      }
      return 0;
    }
    reg = new RegExp(`^${config.main.prefix}skip`);
    if (msg.content.match(reg)) {
      skip(msg,serverQueue);
      return 0;
    }
    reg = new RegExp(`^${config.main.prefix}stop`);
    if (msg.content.match(reg)) {
      stop(msg,serverQueue);
      return 0;
    }
  }


});
function find(query, callback = false, serverQueue){
  let r = "";
  cp.exec("python src/findYTURL.py "+basicFunc.parseParams(query.content).join("%2137%"),(ex,out,err)=>{
          query.channel.send("Found: "+out);
          if (callback==true){
              execute(query,serverQueue,out);
          }
  });
  return r;
}
async function execute(message, serverQueue, link=null) {
  let args = message.content.split(" ")[1];
  if(link !== null){
    args =link;
  }

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song && serverQueue !== undefined) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}