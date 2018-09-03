
const TEMPLATE = require('./TEMPLATE');
const buildUtil = require('./buildUtil');
const t = require('babel-types');

/**
 * 返回格式化后的 define 引用模块参数
 * @param {object} nejDeps  模块引用路径与形参键值对
 * @param {object} opts 用户配置
 * 
 * @return {object}
 *  @param {object} requires 格式化后的参数
 *  @param {array} txtModuleParam 文本类型模块集合 css/text
 */
const normalizeDeps = function (nejDeps, opts) {
    const deps = Object.keys(nejDeps); // 模块引用集合
    const requires = {};
    const txtModuleParam = [];

    // 去掉模块引用路径中的文本前缀
    function dropPrefix(dep, nejDep) {
        const [prefix, rawDep] = dep.split('!');

        // prefix -> 路径、css、text
        if (prefix === 'css') {
            txtModuleParam.push(nejDeps[nejDep]);
        }

        if (prefix === 'text' && rawDep.indexOf('.css') > -1) {
            txtModuleParam.push(nejDeps[nejDep]);
        }

        dep = rawDep ? rawDep : prefix;

        return dep;
    }
    // 去掉引用 .js 的后缀
    function dropJSExt(dep) {
        const [fileName, fileExt] = dep.split('/').reverse()[0].split('.');

        if (fileExt === 'js') {
            dep = dep.replace('.js', '');
        }
        return dep;
    }
    // 对于特定路径头的处理
    function assignMode(dep) {
        return dep.replace('{mode}', opts.mode);
    }

    function processPlatform(dep) {
        return dep.replace('{platform}', './{platform}');
    }
    // { } 大括号的转换
    function dropBracket(dep) {
        const leftPos = dep.indexOf('{'),
            rightPos = dep.indexOf('}');

        if (leftPos >= 0) {
            if (rightPos > 0 && dep[rightPos + 1] !== '/') {
                dep = dep.replace('}', '/');
            } else {
                dep = dep.replace('}', '');
            }

            dep = dep.replace('{', '');
        }
        return dep;
    }

    deps.forEach(dep => {
        const nejDep = dep;

        dep = dropPrefix(dep, nejDep);
        dep = dropJSExt(dep);
        dep = assignMode(dep);
        dep = processPlatform(dep);
        dep = dropBracket(dep);

        requires[dep] = nejDeps[nejDep];
    });
    return {
        requires,
        txtModuleParam
    }

}

/**
 * 
 * @param { array } deps 引用模块路径
 * @param { array } depsVal  形参集合
 * @param { objext } opts 用户配置
 */
module.exports = function (deps, depsVal, opts) {
    const nejDeps = {}; // 引用模块路径 与 形参 键值对
    deps.forEach((dep, idx) => {
        nejDeps[dep] = depsVal[idx] || `randomVal${idx}`;
    });
    const { txtModuleParam, requires } = normalizeDeps(nejDeps, opts); //json、text、css方式引入的依赖，都按照nej的模式处理为空字符串

    // 非引用空参集合 pro、o、f、r 部分的exports处理
    const injectParams = depsVal.splice(deps.length); 
    // let outputResultExportStat = [];
    let injectParamStats = [], outputResult;
    if (injectParams.length) {
        outputResult = injectParams[0];
        injectParamStats = buildUtil.buildInjectParams(injectParams);
    }
    // 对文本型模块进行空参定义, 初始化 css 文件为空字符串，以兼容 NEJ 对 css 的处理
    const txtModuleInitStats = buildUtil.buildEmptyStrings(txtModuleParam);
    // 对于格式化后的 define 引用模块参数的转换
    const requireStats = buildUtil.buildRequires(requires);

    return { requireStats, txtModuleInitStats, injectParamStats, outputResult };
}