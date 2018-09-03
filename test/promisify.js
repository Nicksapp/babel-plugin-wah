const {promisify} = require("util");

const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

const filePath = process.argv[2];

/** 初始用法
 fs.readFile(filePath, {
     encoding: 'utf8'
 }, function (err, text) {
     if (err) {
         console.log("ERROR: ", err);
     } else {
         console.log("ORIGIN CONTENT: ", text);
     }
 })
 */

// Promise 用法
// readFileAsync(filePath, {encoding: "utf8"})
//     .then(text => {
//         console.log("CONTENT: ", text);
//     })
//     .catch(err => {
//         console.log("ERROR: ", err);
//     })


// Async 用法
async function getFileContent() {
    try {
        const text = await readFileAsync(filePath, {encoding: "utf8"});
        console.log("CONTENT: ", text);
    } catch (err) {
        console.log("ERROR: ", err);
    }
}

getFileContent();

