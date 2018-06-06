'use strict';

var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        }
        // , password_hash: DataTypes.STRING
        // , password: {
        //     type: DataTypes.VIRTUAL,
        //     set: function (val) {
        //         this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
        //         this.setDataValue('password_hash', this.salt + val);
        //     },
        //     validate: {
        //         isLongEnough: function (val) {
        //             if (val.length < 7) {
        //                 throw new Error("Please choose a longer password")
        //             }
        //         }
        //     }
        // }
        ,
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        gender: { //male: false, female: true
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        role: {
            type: new DataTypes.VIRTUAL,
            get: function () {
                return 'USER';
            }
        },
        locale: {
            type: DataTypes.STRING(16),
            allowNull: false,
            defaultValue: 'ko'
        },
        fcm_token: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        apns_token: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        mi_token: {
            type: DataTypes.STRING(256),
            allowNull: false,
            defaultValue: ''
        },
        uuid: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        os: {
            type: DataTypes.ENUM('iOS', 'Android', 'Etc'),
            allowNull: true
        },
        os_ver: {
            type: DataTypes.STRING(16),
            allowNull: true
        },
        device: {
            type: DataTypes.STRING(16),
            allowNull: true
        },
        last_login_at: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
            get: function () {
                var convertTime = new Date(this.getDataValue('last_login_at'));
                return convertTime.getTime() / 1000;
            }
        }

    }, {
            classMethods: {},
            instanceMethods: {
                generateHash: function (password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                },
                validPassword: function (password) {
                    return bcrypt.compareSync(password, this.password);
                },
            },
            tableName: 'users',
            freezeTableName: true,
            underscored: false,
            timestamps: true
        });
};