const dsc = require("discord.js");
const client = new dsc.Client();
const config = require("../config/config.js");
const randomFunc = require("../src/randomFunc"); // random-based functions
const basicFunc = require("../src/basicFunc.js"); // base functions

client.login(config.private.key);

const baseReg = new RegExp(`${config.main.prefix}`);

client.on("message", msg => {
  if (msg.content.match(baseReg)) {
    //                 TEST MESSAGE

    let reg = new RegExp(`^${config.main.prefix}ping`);
    if (msg.content.match(reg)) {
      msg.channel.send("*pong!*");
      return 0;
    }
    //                   SHOW

    reg = new RegExp(`^${config.main.prefix}show`);
    if (msg.content.match(reg)) {
      basicFunc.show(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }

    //                      DICE
    reg = new RegExp(`^${config.main.prefix}dice`);
    if (msg.content.match(reg)) {
      randomFunc.dice(msg.channel, basicFunc.parseParams(msg.content));
      return 0;
    }
  }
});
