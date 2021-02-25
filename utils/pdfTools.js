const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");

const getLoadingDoc = (path, pw) =>
  pdfjsLib.getDocument({
    url: path,
    password: pw,
  });

const checkPassword = (filePath, password) => {
  const loadingDoc = getLoadingDoc(filePath, password);
  return loadingDoc.promise
    .then((doc) => {
      return {
        status: "complete",
        message: "Password found!",
        filePath,
        passwordFound: true,
        passwordAttempted: password,
      };
    })
    .catch((e) => {
      console.log(e.message);
      return {
        status: "complete",
        message: e.message,
        filePath,
        passwordFound: false,
        passwordAttempted: password,
      };
    });
};

module.exports = {
  checkPassword,
};
