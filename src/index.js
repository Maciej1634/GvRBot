const dsc = require("discord.js");
const config = require("../config/config.js");
const randomFunc = require("../src/randomFunc"); // random-based functions
const basicFunc = require("../src/basicFunc.js"); // base functions
const textFunc = require("../src/textFunc.js"); // text functions
const client = new dsc.Client();
client.login(config.private.key);

const baseReg = new RegExp(`${config.main.prefix}`);
client.once("ready", () => {
  client.user.setActivity(config.main.activityText, {
    type: `${config.main.activityType}`
  });
});

client.on("message", msg => {
  if (msg.content.match(baseReg)) {
    //                 TEST MESSAGE

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
    //         UP AND DOWN
    reg = new RegExp(`^${config.main.prefix}updown`);
    if (msg.content.match(reg)) {
      textFunc.upDown(msg);
    }
  }
});
