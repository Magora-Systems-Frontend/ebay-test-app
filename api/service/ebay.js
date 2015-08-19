(function (module) {

    'use strict';

    var ebay = require('ebay-api');

    module.exports = function (app, config) {
        return {
            getCategories: function (params, cb) {
                ebay.ebayApiPostXmlRequest({
                    serviceName : 'Trading',
                    opType : 'GetCategories',

                    devName: config.devName,
                    cert: config.cert,
                    appName: config.appName,

                    sandbox: true,

                    params: {
                        'authToken': config.eBayAuthToken,
                        //'CategoryParent': params.categoryParent,
                        'CategorySiteID': 0,
                        'ViewAllNodes': 'True',
                        'DetailLevel': 'ReturnAll'
                    }

                }, cb);
            }
        }
    }


})(module);