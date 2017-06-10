var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});

router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  var gender = req.fields.gender;
  var bio = req.fields.bio;
  var avatar = req.files.avatar.path.split(path.sep).pop();
  var password = req.fields.password;
  var repassword = req.fields.repassword;

  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('name lenght in 1 to 10');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('gender in m、f or x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('bio  1-30 char');
    }
    if (!req.files.avatar.name) {
      throw new Error('avator empty');
    }
    if (password.length < 6) {
      throw new Error('password must more than 6 char');
    }
    if (password !== repassword) {
      throw new Error('password in-consistent');
    }
  } catch (e) {
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  password = sha1(password);

  var user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };
  UserModel.create(user)
    .then(function (result) {
      user = result;
      delete user.password;
      req.session.user = user;
      req.flash('success', 'sigin success');
      res.redirect('/posts');
    })
    .catch(function (e) {
      fs.unlink(req.files.avatar.path);
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', 'user name occupy');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
