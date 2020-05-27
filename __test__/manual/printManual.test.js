"use strict";

import { existsSync } from "fs";
import execAsync from "../../src/execAsync";
import printManual from "../../src/manual/printManual";

jest.mock("fs");
jest.mock("path");
jest.mock("../../src/execAsync");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  // restore the original implementations
  existsSync.mockRestore();
  execAsync.mockRestore();
});

test("throws if no executable specified", () => {
  const noExecutableSpecified = () => printManual();
  expect(noExecutableSpecified).toThrowError(
    new Error("No executable specified")
  );
});

test("throws if no PDF specified", () => {
  const noPdfSpecified = () => printManual("executable");
  expect(noPdfSpecified).toThrowError(new Error("No PDF specified"));
});

test("throws if parameter invalid", () => {
  const invalidParam = () =>
    printManual("executable", "assets/pdf-sample.pdf", "-param1 -param2");
  expect(invalidParam).toThrowError(new Error("parameter has be an array"));
});

test("throws if PDF doesn't exist", () => {
  const noSuchFile = () => printManual("/usr/bin/lp", "assets/pdf-sample.pdf");
  existsSync.mockImplementation(() => false);
  expect(noSuchFile).toThrowError(new Error("No such file to print"));
});

test("throws if executable doesn't exist", () => {
  const noSuchFile = () => printManual("/usr/bin/lp", "assets/pdf-sample.pdf");
  existsSync.mockImplementationOnce(() => true).mockImplementation(() => false);
  expect(noSuchFile).toThrowError(new Error("No such file to execute"));
});

test("sends the PDF file to executable", () => {
  const executable = "/usr/bin/lp";
  const filename = "assets/pdf-sample.pdf";
  return printManual(executable, filename).then(() => {
    expect(execAsync).toHaveBeenCalledWith(executable, [filename]);
  });
});

test("sends the PDF file to executable with parameter", () => {
  const executable = "/usr/bin/lp";
  const filename = "assets/pdf-sample.pdf";
  const parameter = ["-o landscape"];
  return printManual(executable, filename, parameter).then(() => {
    expect(execAsync).toHaveBeenCalledWith(executable, [
      "-o",
      "landscape",
      filename
    ]);
  });
});
