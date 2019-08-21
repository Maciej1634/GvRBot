const dsc = require("discord.js");
const client = new dsc.Client();
const config = require("../config/config.js");
const randomFunc = require("../src/basicFunc"); // random-based functions
const basicFunc = require("../src/basicFunc.js"); // base functions

client.login(config.private.key);
client.on("message", msg => {
  //                 TEST MESSAGE

  let reg = new RegExp(`^${config.main.prefix}ping`);
  if (msg.content.match(reg)) {
    msg.channel.send("*pong!*");
  }
  //                   SHOW

  reg = new RegExp(`^${config.main.prefix}show`);
  if (msg.content.match(reg)) {
    basicFunc.show(msg, basicFunc.parseParams(msg.content));
    return 0;
  }
});
