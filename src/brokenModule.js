const t = require("babel-types");

/**
 * 
 * @param {array}  
 * 
 * @return {ArrayExpression} deps 所有引入模块路径
 *  @param
 */
module.exports = function ([deps, cb]) {
    // let hasFindCb = true;
    if (!cb) {
        cb = deps;
        deps = []
    } else {
        deps = deps.node; // ArrayExpression define(['','',''])定义部分
    }

    if (deps && deps.elements) {
        if (deps.elements.length) {
            deps = deps.elements.map(ele => {
                return ele.value; // "base/klass"
            });
        } else {
            deps = [];
        }
    }

    if (t.isIdentifier(cb)) { // 声明变量判断
        return {
            deps,
            cb: cb.node.name,
            hasFindCb: false
        }
    }

    if (t.isFunctionExpression(cb)) { // 函数类型判断
        return {
            deps,
            cb,
            hasFindCb: true
        }
    }

    return {
        deps: [],
        cb: null,
        hasFindCb: false
    }
}