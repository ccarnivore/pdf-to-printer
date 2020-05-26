"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const args = [];
  const {
    printer,
    unix,
    alternativeExecutable,
    alternativeUnix = []
  } = options;

  if (alternativeExecutable) {
    if (alternativeUnix) {
      if (!Array.isArray(alternativeUnix))
        throw "options.alternativeUnix should be an array";
    }

    alternativeUnix.map(arg => args.push(...arg.split(" ")));
    args.push(pdf);

    return execAsync(alternativeExecutable, args);
  }

  args.push(pdf);
  if (printer) {
    args.push("-d", printer);
  }

  if (unix) {
    if (!Array.isArray(unix)) throw "options.unix should be an array";
    unix.map(unixArg => args.push(...unixArg.split(" ")));
  }

  return execAsync("lp", args);
};

module.exports = print;
