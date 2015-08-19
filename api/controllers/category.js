(function (module) {

    'use strict';

    var async = require('async'),
        fs = require('fs');

    module.exports = {

        rebuildAction: function (app, params, next) {

            app
                .ebay
                .getCategories(params, function (err, results) {

                    if (!err) {

                        app.mysql.query("DROP TABLE `category`;", function () {


                            app
                                .mysql
                                .query(
                                "CREATE TABLE `category` (`CategoryID` int(11) NOT NULL, " +
                                " `CategoryName` varchar(45) NOT NULL," +
                                " `CategoryLevel` int(11) NOT NULL DEFAULT '1'," +
                                " `BestOfferEnabled` tinyint(4) NOT NULL DEFAULT '1'," +
                                " `CategoryParentID` int(11) DEFAULT NULL," +
                                "PRIMARY KEY (`CategoryID`)," +
                                "UNIQUE KEY `Id_UNIQUE` (`CategoryID`)" +
                                ") ENGINE=InnoDB DEFAULT CHARSET=utf8;", function (err) {

                                    if (!err) {

                                        async
                                            .eachSeries(results.CategoryArray.Category, function iterator(item, done) {
                                                app
                                                    .mysql
                                                    .query('INSERT INTO `category` SET ? ', {
                                                        CategoryID: item['CategoryID'],
                                                        CategoryName: item['CategoryName'],
                                                        CategoryLevel: item['CategoryLevel'],
                                                        BestOfferEnabled: item['BestOfferEnabled'] === 'true',
                                                        CategoryParentID: item['CategoryParentID'] === item['CategoryID'] ? 0 : item['CategoryParentID']
                                                    }, done);

                                            }, next);
                                    } else {
                                        console.log(err);
                                    }
                                });
                        });


                    } else {
                        console.log(err);
                    }
                }
            );

        },

        list: function (items) {


            var html = '<ul>',
                ctrl = this;

            items
                .forEach(function (item) {

                    html += '<li>' + item.CategoryID + ', ' + item.CategoryName + ', ' + item.CategoryLevel + '</li>';

                    if (item['childs'] && item['childs'].length) {
                        html += ctrl.list(item['childs']);
                    }

                });

            html += '</ul>';

            return html;


        },

        indexAction: function (app, params, next) {

            var ctrl = this,
                parentId = app.console.render;


            if (!parentId) {

                console.log('Parent id empty');
                next();

            } else {

                parentId = parseInt(parentId);

                app
                    .mysql
                    .query('SELECT * FROM `category` WHERE CategoryID = ? LIMIT 1', [parentId], function (err, items) {

                        if (!err && items.length) {

                            app
                                .mysql
                                .query('SELECT * FROM `category` WHERE CategoryParentID=? OR CategoryID=? OR CategoryLevel>?',
                                [items[0]['CategoryParentID'], items[0]['CategoryID'], items[0]['CategoryLevel']],

                                function (err, items) {

                                    if (!err && items.length) {

                                        var map = {};
                                        var newItems = [];

                                        items
                                            .forEach(function (item) {
                                                map['id-' + item['CategoryID']] = item;
                                                item['childs'] = [];
                                            });

                                        Object
                                            .keys(map)
                                            .forEach(function (key) {
                                                var item = map[key];

                                                if (map['id-' + item['CategoryParentID']]) {
                                                    map['id-' + item['CategoryParentID']].childs.push(item);
                                                } else if (item['CategoryID'] === parentId) {
                                                    newItems.push(item)
                                                }
                                            });


                                        var html = ctrl.list(newItems);

                                        fs.writeFile("./" + parentId + '.html', html, function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }

                                            next();

                                        });

                                    } else {

                                        next();
                                    }


                                });
                        }
                        else {
                            console.log('No category with ID: ' + parentId)
                        }

                    });
            }


        }
    }


})(module);