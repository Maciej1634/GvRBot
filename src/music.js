const cp = require("child_process");
const ytdl = require("ytdl-core");
const dsc = require("discord.js");
const apikey = require("../config/apikey.js");
const basicFunc = require("../src/basicFunc.js"); // base s
const util = require("util");
const YouTube = require('simple-youtube-api');
const ytapi = new YouTube(apikey.private.youtube);
const cookies = apikey.private.cookies;
require("http");
const exec = util.promisify(require('child_process').exec);
////////////////////////////////////////////////

class YTMusic{
    queue; // queues
    constructor(){
        this.queue = new Map();
    }
    async exec(message, songURL,playlist=false){
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
        
        //Save the song info
        const song = {
            //title: songInfo.videoDetails.title,
            // url: songInfo.videoDetails.video_url,
            url: songURL
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
            shuffling: false,
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
            if(this.queue.get(serverId).songs.playing == false){
                this.play(serverId,song)
            }
            else{
                this.queue.get(serverId).songs.push(song);
            }
            return playlist? 0: message.channel.send(`${song.title} has been added to the queue!`);
        }
    }
    async shuffle(message){
        const g = message.guild.id;
        if(this.queue.get(g).songs.length <= 1) return 0;
        this.queue.get(g).shuffling = true;
        for (let i = this.queue.get(g).songs.length - 1; i > 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.queue.get(g).songs[i];
            this.queue.get(g).songs[i] = this.queue.get(g).songs[j];
            this.queue.get(g).songs[j] = temp;
          }
          this.queue.get(g).shuffling = false;  
    }
    async skip(message) {
        //Get the server ID
        const serverId =message.guild.id;
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
        try{
        this.queue.get(serverId).connection.dispatcher.end();
        }catch(err){
            console.log(err);
            this.queue.get(serverId).connection.dispatcher = null;
        }
      }
    async play(guild, song) {
        //Get the server queue reference
        const q = this.queue.get(guild);
        if (!song && q !== undefined) {
            this.queue.get(guild).playing = false;
            this.queue.get(guild).voiceChannel.leave();
            this.queue.delete(guild);
            return;
        }
        var that = this;
        
        const dispatcher = q.connection
            .play(ytdl(song.url,  { filter: "audioonly",requestOptions: {headers: {cookie: cookies}}}))
            .on("finish", async (t  = that, g = guild, qu = q) => {
                while(t.queue.get(g).shuffling){
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(10)
                }
                t.queue.get(g).playing = true;
                q.songs.shift();
                t.play(g, qu.songs[0]);
          })
          .on("error", (error,t=that,g = guild,qu=q) => {
                console.error(error);
                // t.queue.get(g).channel.send("Error occured, skipping");
                t.queue.get(g).playing = true;
                q.songs.shift();
                t.play(g, qu.songs[0]);
            });
        
        dispatcher.setVolumeLogarithmic(q.volume / 5);
        //Get the song info
        const songInfo = await ytdl.getBasicInfo(q.songs[0].url);
        q.textChannel.send(`Start playing: **${songInfo.videoDetails.title}**`);
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

    findPlayList(msg, list){
        var that = this;
        var count = 0;
        ytapi.getPlaylist(list)
        .then(playlist => {
            playlist.getVideos()
                .then(videos => {
                    videos.forEach(element => {
                        if(element.title != 'Deleted video'){
                            that.exec(msg,"https://www.youtube.com/watch?v="+element.id,playlist = true);
                            count++;
                        }
                    })
                    msg.channel.send(`Added ${count} songs`);
                })
                .catch(console.log);
        })
        .catch(console.log);
       
    }
    
}

//////////////////////////////////////////////////////////////////
//Exports
//////////////////////////////////////////////////////////////////
module.exports = {
    YTMusic: YTMusic
};