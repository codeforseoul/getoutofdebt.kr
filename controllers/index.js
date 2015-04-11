/**
 * do something with the user model
 * var User = require('../models/user');
 */

var Municipality = require("../models/municipality");
var Enterprise = require("../models/enterprise");

var controller = module.exports = {};

controller.index = function (req, res) {
  Municipality.find({year: 2013, cat: 'province'}, function (err, result) {
    var localgov = result;
    Enterprise.find({year: 2013, cat: 'province'}, function (err, result) {
      res.render('index', {
        title: '전국 채무 비율',
        gov: localgov,
        enterprise: result
      })
    });
  });
  ;
};

controller.local = function (req, res) {
  Municipality.find({cat: 'municipal', code: req.params.id}, function (err, municipalities) {
    var localgov = municipalities;
    Enterprise.find({cat: 'municipal', code: req.params.id}, function (err, enterprises) {
      res.render('local_map', {
        title: '지방 재정 비교',
        gov: localgov,
        enterprise: enterprises,
        id: req.params.id
      });
    })
  })

};
