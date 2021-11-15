const cp = require("child_process");
const ytdl = require("ytdl-core");
const dsc = require("discord.js");
const basicFunc = require("../src/basicFunc.js"); // base functions
const util = require("util")
require("http");
const exec = util.promisify(require('child_process').exec);
////////////////////////////////////////////////

class YTMusic{
    queue; // queues
    constructor(){
        this.queue = new Map();
    }
    async exec(message, songURL){
        //Get the voiceChannel reference
        const voiceChannel = message.member.voice.channel;
        //If Sender is not connected to voice channel
        if(!voiceChannel){
            return message.channel.send("Join VC to play music!");
        }
        //#TODO: DJ permission check
        //Get the bot permissions
        const perms = voiceChannel.permissionsFor(message.client.user);
        //Check if bot has enough permissions
        if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
            return message.channel.send("I don't have enough permissions to join this VC");
        }
        //Get the song info
        const songInfo = await ytdl.getInfo(songURL);
        //Save the song info
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
       };
       //Get the server ID
       const serverId = message.guild.id;
       //Check if the Queue exists
       if (this.queue ===undefined || !this.queue.get(serverId)) {
        //New queue member
        const qm = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
            };
        //Add server to queues
        this.queue.set(serverId, qm);
        this.queue.get(serverId).songs.push(song);
        this.queue.get(serverId).textChannel = message.channel;
        //Join VC and play song 
        try{
            this.queue.get(serverId).connection = await voiceChannel.join();
            this.play(serverId, this.queue.get(serverId).songs[0], message);
        }catch(error){
            console.log(error);
            this.queue.delete(message.guild.id);
            return message.channel.send("error: "+error);
        }
        }else {
            this.queue.get(serverId).songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
    }
    async skip(message) {
        //Get the server ID
        const serverId = message.guild.id;
        //Check if user is in VC and queue is not empty
        if (!message.member.voice.channel) return message.channel.send("You have to be in a VC to stop the music!");
        if (!this.queue.get(serverId)) return message.channel.send("There is no song that I could skip!");
        this.queue.get(serverId).connection.dispatcher.end();
      }
    async stop(message) {
        //Get the server ID
        const serverId = message.guild.id;
        //Check if user is in VC and queue is not empty
        if (!message.member.voice.channel) return message.channel.send("You have to be in a VC to stop the music!");
        if (!this.queue.get(serverId)) return message.channel.send("There is no song that I could stop!");
        this.queue.get(serverId).songs = [];
        this.queue.get(serverId).connection.dispatcher.end();
      }
    async play(guild, song) {
        //Get the server queue reference
        const q = this.queue.get(guild);
        if (!song && q !== undefined) {
          q.voiceChannel.leave();
          this.queue.delete(guild.id);
          return;
        }
        var that = this;
        const dispatcher = q.connection
            .play(ytdl(song.url))
            .on("finish", (that  = that, guild = guild, q = q) => {
                q.songs.shift();
                play(guild, q.songs[0]);
          })
          .on("error", error => console.error(error));
        
        dispatcher.setVolumeLogarithmic(q.volume / 5);
        q.textChannel.send(`Start playing: **${song.title}**`);
      }
    async find(message){
        const {stdout, stderr} = await exec("python src/findYTURL.py "+basicFunc.parseParams(message.content).join("%2137%")); 
        if(stderr !== "" ){
            console.log("PY error "+stderr);
        }
        if(stdout === undefined || stdout == "" || stdout === null){
            message.channel.send("Nothing found");
        }else{
            this.exec(message,stdout)
        }
    }
}

//////////////////////////////////////////////////////////////////
//Exports
//////////////////////////////////////////////////////////////////
module.exports = {
    YTMusic: YTMusic
};