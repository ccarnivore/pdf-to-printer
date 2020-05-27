"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");

const printManual = (executable, pdf, parameter = []) => {
  if (!executable) throw "No executable specified";
  if (!pdf) throw "No PDF specified";
  if (!parameter || !Array.isArray(parameter)) {
    throw "parameter has be an array";
  }

  if (!fs.existsSync(pdf)) throw "No such file to print";
  if (!fs.existsSync(executable)) throw "No such file to execute";

  const args = [];
  parameter.map(arg => args.push(...arg.split(" ")));
  args.push(pdf);

  return execAsync(executable, args);
};

module.exports = printManual;
