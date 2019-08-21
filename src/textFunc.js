const basicFunc = require("../src/basicFunc.js"); // base functions
module.exports = {
  //             updown   M a K e S  M e S s A g E  F u N n I e R
  upDown: msg => {
    let x = basicFunc
      .parseParams(msg.content)
      .join(" ")
      .toUpperCase()
      .split("")
      .map((t, i) => {
        if (i % 2 == 1) {
          return t.toLowerCase();
        } else return t;
      })
      .join(" ");
    msg.channel.send(`${msg.author}: ${x}`);
    msg.delete();
  }
};
