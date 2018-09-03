module.exports = function({type: t}) {
    return {
        visitor: { // AST树的遍历
            BinaryExpression (path, state) {
                if (path.node.operator !== "===") {
                    return;
                }
                path.node.left = t.identifier("leftOps");
                path.node.right = t.identifier("rightOps");
            }
        }
    }
}