'use strict';

var fs = require('fs');
var path = require('path');

var conf = require('../conf');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(conf.dbConnectString, {
    define: {
        hooks: {
            beforeCreate: function () {
                console.log('global hooks');
                //TODO: global hooks before create
            }
        }
    }
    // ,timezone: '+09:00'
    ,logging: conf.debug
});

/*var sequelize = new Sequelize('sequelize', 'sequelize', '1234', {
 host: 'localhost',
 dialect: 'postgres'
 }); */
var db = {};

var config = {
    initAssociations: function (db) {
      //    db.Publisher.hasMany(db.Books, {foreignKey: 'pub_id'});
      //    db.Books.belongsTo(db.Publisher, {foreignKey: 'pub_id', targetKey: 'pub_id'});
      //    db.RentHistory.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'user_id'});
      //    db.RentHistory.belongsTo(db.Books, {foreignKey: 'book_id', targetKey: 'book_id'});
      // db.CookMenu.belongsTo(db.Cardnews, {
      //   foreignKey: 'cardnews_id'
      // });
      console.log('initAssociations');
    },
    initHooks: function (db) {
      // db.User.hook('beforeCreate', function () {
      //   //TODO; create작업 전에 해야할 사항들.
      // });
  
      // db.User.beforeCreate(function () {
      //   //TODO; create작업 전에 해야할 사항들.
      // });
    }
  };

//db['Publisher'] = sequelize.import(path.join(__dirname, 'publisher.js'));

fs.readdirSync(__dirname)
    .filter(function (file) {
        // return (file.indexOf('.') !== 0) && (file !== 'index.js' && file !== 'config.js');
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
        
    });

// db.User.hasMany(db.User, {foreignKey: 'parent_id'});
// db.User.hasMany(db.User, {foreignKey: 'teacher_id'});
// db.User.hasMany(db.User, {foreign'TAKey: 'school_id'});

// db.Parent.hasMany(db.Child, {foreignKey: 'parent_id'});
// db.Child.hasMany(db.RawAddiction, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawFat, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSight, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawStrength, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSociality, {foreignKey: 'child_id'});
// db.RawSociality.hasMany(db.RawSocialityResult, {foreignKey: 'row_sociality_id'});

//로그 - 메시지 전송 히스토리, 전문가 연결,


// db.Parent.belongsToMany(db.Child, {through: 'rel_family'}); //가족
// db.Teacher.belongsToMany(db.Child, {through: 'rel_class'}); //반
// db.School.hasMany(db.Teacher, {foreignKey: 'teacher_id'});
// db.Child.hasMany(db.RawAddiction, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawFat, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSight, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawStrength, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSociality, {foreignKey: 'child_id'});


config.initAssociations(db);
//config.initHooks(db); hooks설정시 주석을 제거한다

//db.Publisher.sync();
//db.Publisher.drop();
//db.Publisher.sync({force: true});

// db.Parent.hasMany(db.Child, {foreignKey: 'parent_id'});
// db.Child.hasMany(db.RawAddiction, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSociality, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawFat, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawSight, {foreignKey: 'child_id'});
// db.Child.hasMany(db.RawStrength, {foreignKey: 'child_id'});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


//
//var User = sequelize.define('user', {
//  firstName: {
//    type: Sequelize.STRING
//  },
//  lastName: {
//    type: Sequelize.STRING
//  }
//});
//
//// force: true will drop the table if it already exists


//sequelize
//  .authenticate()
//  .then(function(err) {
//    console.log('Connection has been established successfully.');
//  })
//  .catch(function (err) {
//    console.log('Unable to connect to the database:', err);
//  });

module.exports = db;