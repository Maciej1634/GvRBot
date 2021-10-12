const cp = require("child_process");
const basicFunc = require("../src/basicFunc.js"); // base functions
module.exports = {
    play: msg =>{

    },
    find: (query, callback = null, serverQueue)=>{
        let r = "";
        cp.exec("python src/findYTURL.py "+basicFunc.parseParams(query.content).join("%2137%"),(ex,out,err)=>{
                query.channel.send("Found: "+out);
                if (callback!==null){
                    play(query,out,serverQueue);
                }
        });
        return r;
    },
    execute: (msg, queue)=>execute(msg,queue),
    play: (msg, queue)=>play(msg,song, queue),
    skip: (msg, queue)=>skip(msg,queue),
    stop: (msg, queue)=>stop(msg,queue)
};
////////////////////////////////////////////////

