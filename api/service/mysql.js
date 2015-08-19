(function (module) {

    'use strict';

    var mysql = require('mysql');

    module.exports = function (app, config) {


        Object
            .keys(config)
            .forEach(function (key) {

                if (app.console[key]) {
                    config[key] = app.console[key];
                }

            });


        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });

        connection.connect();

        return connection;
    }


})(module);