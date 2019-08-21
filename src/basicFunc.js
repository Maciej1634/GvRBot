config = require("../config/config.js");

module.exports = {
  //                                          Show required values
  show: (msg, params) => {
    if (params[0] == "prefix") {
      msg.channel.send(config.main.prefix);
    } else if (params[0] == "middlefinger") {
      msg.channel.send(".!.");
    }
  },
  //                                                Parse the params
  parseParams: txt => {
    let x = txt.split(" ");
    x.shift();
    return x;
  }
};
