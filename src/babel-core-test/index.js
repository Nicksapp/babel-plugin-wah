var babel = require('babel-core');
var t = require('babel-types');
const code = `import {uniq, extend, flatten, cloneDeep } from "lodash"`;
const visitor = {
    // Identifier(path) {
    //     console.log(path.node.name) // 每个节点进出时都会调用,遍历会有二次，一个是像下遍历进入，一个是像上遍历退出
    // }
    Identifier: {
        enter(path) {
            // console.log('enter: ' + path.node.name)
            if (path.node.name == "uniq") {
                var newIdentifier = t.identifier('_uniq')
                path.replaceWith(newIdentifier)
            }
        },
        exit(path) {
            // console.log('exit: ' + path.node.name)
        }
    }
}
const result = babel.transform(code, {
    plugins: [{
        visitor: visitor
    }]
})

console.log(result.code)