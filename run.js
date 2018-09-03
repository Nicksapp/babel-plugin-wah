var fs = require("fs");
var babel = require("babel-core");
var plugin = require("./src/index");

var fileName = process.argv[2];

fs.readFile(fileName, function (err, data) {
    if (err) throw err;

    // convert from a buffer to a string
    var src = data.toString();

    // use our plugin to transform the source
    var out = babel.transform(src, {
        presets: [
            ["env", {
                "targets": {
                    "browsers": ["last 2 versions", "IE 8-10"]
                }
            }]
        ],
        plugins: [[plugin, { mode: 'web' }]]
    });

    // print the generated code to screen
    console.log("===输出代码===")
    console.log(out.code);
})