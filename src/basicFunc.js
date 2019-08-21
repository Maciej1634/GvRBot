config = require("../config/config.js");

module.exports = {
  //                                          Show requested values
  show: (msg, params) => {
    if (params.length == 0) {
      msg.channel.send("What should i show you? Please tell me next time ><");
    } else if (params[0] == "prefix") {
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
