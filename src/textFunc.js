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
  },
  //                    change message to cursive   TODO: sth interesting ;)
  story: msg => {
    let x = basicFunc.parseParams(msg.content).join(" ");
    msg.channel.send(`${msg.author}: *${x}*`);
    msg.delete();
  },
  //               TODD:      translate the message to pokemon language
  pokelang: msg => {
    const translate = {
      a: "@",
      b: "8",
      c: "(",
      d: "|]",
      e: "3",
      f: "|=",
      g: "6",
      h: "|-|",
      i: "1",
      j: "_|",
      k: "|<",
      l: "|_",
      m: "^^",
      n: "|\\|",
      o: "0",
      p: "|>",
      r: "\u02C5",
      s: "ⓢ",
      t: "+",
      u: "\\/",
      w: "\\/\\/",
      x: "><",
      y: "\\'",
      z: "5"
    };
    try{
    msg.channel.send(
      `${msg.author}: ${basicFunc
        .parseParams(msg.content)
        .join(" ")
        .toLowerCase()
        .split(" ")
        .map(a => translate[a.toLowerCase()])
        .join(" ")}`
        );
    msg.delete();
      }catch{
      
      }
  }
};
