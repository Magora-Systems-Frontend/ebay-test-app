(function () {

    'use strict';

    var requireDir = require('require-dir'),
        configs = requireDir('./config'),
        services = requireDir('./api/service'),
        categoryCtrl = require('./api/controllers/category'),
        app = {
            console: {}
        };

    process.argv.splice(2, 1)
        .forEach(function (item) {
            var data = item.replace('--', '').split('=');
            app.console[data[0]] = data.length === 1 ? data[0] : data[1];
        });


    Object
        .keys(services)
        .forEach(function (serviceName) {
            var config = configs[serviceName] ? configs[serviceName] : {};
            app[serviceName] = services[serviceName](app, config);
        });


    if (app.console['rebuild']) {
        categoryCtrl
            .rebuildAction(app, {}, function () {
                process.exit([0]);
            });
    } else {
        categoryCtrl
            .indexAction(app, {}, function () {
                process.exit([0]);
            });
    }


//


})();