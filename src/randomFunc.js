const dsc = require("discord.js");
const client = new dsc.Client();

module.exports = {
  dice: (channel, params) => {
    if (params.length == 0) {
      channel.send("How many sides has your dice?");
      return 0;
    } else if (isNaN(params[0])) {
      channel.send("Please, tell me the number ._.");
    } else if (parseInt(params[0]) <= 0) {
      channel.send("I never saw dice like this!");
    } else {
      channel.send(
        "I rolled... " + Math.round(Math.random() * params[0]) + "  !"
      );
    }
  }
};
