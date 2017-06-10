var User = require('../lib/mongo').User;

module.exports = {
  create: function create(user) {
    return User.create(user);
  },

  getUserByName: function getUserByName(name) {
    return User
      .findOne({ name: name });
  }
};
