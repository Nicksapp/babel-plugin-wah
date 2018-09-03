NEJ.define([
    './global.js',
    '{platform}config.js'
], function (NEJ, _h, _p, _o, _f, _r) {
   
    _p._$getFrameProxy = function (_url) {
        var _host = _h.__url2host(_url);
        return _p._$get('frames')[_host] ||
            (_host + '/res/nej_proxy_frame.html');
    };
    
    _p._$getFlashProxy = function (_url) {
        return _p._$get('flashs')[_h.__url2host(_url)];
    };

    _p._$get = function (_key) {
        return _h.__get(_key);
    };

    if (CMPT) {
        NEJ.copy(NEJ.P('nej.c'), _p);
    }

    return _p;
});
