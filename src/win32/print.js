"use strict";

const path = require("path");
const fs = require("fs");
const execAsync = require("../execAsync");
const { fixPathForAsarUnpack } = require("../electron-util");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const args = [];
  const {
    printer,
    win32,
    alternativeExecutable,
    alternativeWin32 = []
  } = options;

  if (alternativeExecutable) {
    if (alternativeWin32) {
      if (!Array.isArray(alternativeWin32))
        throw "options.alternateWin32 should be an array";
    }

    alternativeWin32.map(arg => args.push(...arg.split(" ")));
    args.push(pdf);

    return execAsync(alternativeExecutable, args);
  }

  let file = path.join(__dirname, "SumatraPDF.exe");
  file = fixPathForAsarUnpack(file);

  if (printer) {
    args.push("-print-to", printer);
  } else {
    args.push("-print-to-default");
  }

  if (win32) {
    if (!Array.isArray(win32)) throw "options.win32 should be an array";
    win32.map(win32Arg => args.push(...win32Arg.split(" ")));
  }

  args.push("-silent", pdf);

  return execAsync(file, args);
};

module.exports = print;
