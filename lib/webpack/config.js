'use strict';

const fs = require('fs');
const path = require('path');
const makeConfig = require('./makeConfig');

// 自定义配置
const USER_CONFIG_FILE = path.join(
    process.cwd(),
    'wah.config.js'
);

let config = {};

if (fs.existsSync(USER_CONFIG_FILE)) {
    config = require(USER_CONFIG_FILE);
}

module.exports = makeConfig(config);