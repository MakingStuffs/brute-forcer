const { spawn } = require("child_process");

const checkPassword = (filePath, password) =>
  new Promise((resolve, reject) => {
    let err, res;

    // Spawn a child process
    const child = spawn(
      "7z",
      ["-t7z", `e ${filePath}`, "-ooutput/extracted", `-p${password}`, "-aou"],
      { shell: true }
    );

    // Listen for data on the stdout stream
    // Will be executed if password is correct
    child.stdout.on("data", (data) => {
      console.log(data.toString());
      res = {
        status: "complete",
        message: "Password found!",
        filePath,
        passwordFound: true,
        passwordAttempted: password,
      };
    });

    // Listen for data on the stderr stream
    // Will find out if password is wrong here.
    child.stderr.on("data", (data) => {
      console.log(data.toString());
      err = {
        status: "complete",
        message: data.toString(),
        filePath,
        passwordFound: false,
        passwordAttempted: password,
      };
    });

    // If there is an error on the process thread
    child.on("error", (e) => {
      err = {
        status: "error",
        message: e.toString(),
        filePath,
        passwordFound: false,
        passwordAttempted: password,
      };
    });

    // Listen for the event
    child.on("close", (code) => {
      return code !== 0
        ? reject({
            ...err,
            code,
            pid: child.pid,
          })
        : resolve({
            ...res,
            code,
            pid: child.pid,
          });
    });
  });

module.exports = {
  checkPassword,
};
