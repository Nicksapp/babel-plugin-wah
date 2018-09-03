/**
 * NEJ 的模块依赖，类似于 AMD 类型
 * 
 * 文件依赖 url，支持参数 pro/{mode}/base;
 * 支持 text,css,regular 等拓展关键字来引入不同类型的文件 text!./web/component.html;
 * 模块会自动注入4个参数，p: 输出结果集控件, o: 一个空对象, t: 一个 return false 的函数; r:一个空数组;
 * 
 * 目标：找出 NEJ 的私有模块依赖系统与标准的模块系统之间的不同之处，并将其进行转化为标准的 AMD/CMD/CommonJs/ES6 module 系统，使 NEJ 模块也可以被其他类型的模块进行引用。
 */

module.exports = function ({ types: t }) {
    const isNejModule = require("./judgeModule");
    const brokenModule = require('./brokenModule');
    const buildUtil = require('./buildUtil');
    const brokenDeps = require('./brokenDeps');
    const TEMPLATE = require('./TEMPLATE');

    return {
        visitor: {
            Program(path, state) {
                const modules = [];
                const { opts } = state;

                // 顶层遍历收集 nej 模块文件
                path.get('body').forEach(stat => {
                    let isModule = false, node = stat.node;
                    if (node && node.expression && node.expression.callee) {
                        isModule = isNejModule(node.expression.callee)
                        if (isModule) {
                            modules.push(stat.get('expression'))
                        }
                    }
                })

                // 遍历项目中所有含有 nej 模块的文件
                modules.forEach(module => {
                    // 从 module.arguments 获取依赖列表和回调函数
                    const callbackVisitor = {
                        VariableDeclarator (path) {
                            if (t.identifier(path.node.id.name) && path.node.id.name === this.param) {
                                realCallback = path.get('init'); // 顶层 AST
                            }
                        }
                    }

                    // 处理 return
                    const returnVisitor = {
                        ReturnStatement (path) {
                            const funcParent = path.getFunctionParent();
                            let funcName;
                            try {
                                // funcParent.node.id => { type: 'Identifier', name: 'nejModule' }
                                if (funcParent && funcParent.node && funcParent.node.id && (funcParent.node.id.name === 'nejModule')) {
                                    // TODO: path.getSibling
                                    const preSibling = path.key > 0 ? path.getSibling(path.key - 1).node : null;
                                    // 已经转换过则跳过
                                    if (preSibling && preSibling.expression && preSibling.expression.left && preSibling.expression.left.object && preSibling.expression.left.property && preSibling.expression.left.object.name === 'module' && preSibling.node.expression.left.property.name === 'exports') {
                                        return;
                                    }
                                    // 对 return 进行 export 转换
                                    let ret = path.node.argument;
                                    const exportStat = buildUtil.buildExport(ret);
                                    path.replaceWithMultiple(exportStat);
                                    hasReturn = true;
                                }
                            } catch (e) {}
                        }
                    }

                    const outputResultVisitor = {
                        Identifier (path) {
                            const funcParent = path.getFunctionParent();
                            let funcName;
                            try {
                                if (funcParent && funcParent.node && funcParent.node.id && (funcParent.node.id.name === 'nejModule')) {
                                    if (path.node.name === this.outputResult) {
                                        path.node.name = 'exports';
                                    }
                                }
                            } catch (e) {}
                        },
                        AssignmentExpression (path) {
                            const node = path.node;
                            if (node.operator === '=' && node.left && node.left.object && node.left.property && node.left.object.name === 'module' && node.left.property.name === 'exports' && node.right && node.right.name === this.outputResult) {
                                node.right.name = 'exports';  
                            }
                        }
                    }

                    const moduleNode = module.node;
                    let hasReturn = false, realCallback;
                    /**
                     * deps: [  'base/klass',
                                'base/element',
                                'base/event',
                                'util/template/tpl',
                                '{pro}module/module.js' ]
                     */
                    // 获得引用、AST、是否存在回调
                    let { deps, cb, hasFindCb } = brokenModule(module.get('arguments'));
                    
                    // 如果找不到(当传入的回调函数为参数时，需要继续寻找其值)
                    if (!hasFindCb) {
                        // 只寻找同层代码
                        module.parentPath.parentPath.traverse(callbackVisitor, { param: cb })
                        if (realCallback) {
                            cb = realCallback;
                        } else {
                            return;
                        }
                    }
                    
                    // 为回调函数命名 nejModule。return语句和其对应的函数确认的信号，用来定位回调函数的 return 和输出结果集空间的变动，并进行追踪修改。
                    cb.node.id = t.identifier('nejModule'); 
                    // return 处理
                    cb.traverse(returnVisitor);

                    const cbStats = cb.node.body.body;
                    // 形参集合
                    const depsVal = cb.node.params.map(param => {
                        return param.name
                    })
                    //  格式化后的 define 引用模块参数, 文本型模块定义, 非引用空参的转换, 非引用空参集合
                    const { requireStats, txtModuleInitStats, injectParamStats, outputResult } = brokenDeps(deps, depsVal, opts);
                    if (outputResult !== 'exports') {
                        cb.traverse(outputResultVisitor, { outputResult });
                    }

                    let stats = requireStats.concat(txtModuleInitStats).concat(injectParamStats).concat(cbStats)

                    // 最后的 匿名自执行函数包裹，并指定上下文为 window
                    const rootFunc = TEMPLATE.IEFFStat({
                        STATEMENTS: stats
                    });

                    realCallback && realCallback.parentPath.remove();

                    module.replaceWith(rootFunc);
                })

            }
        }
    }
};