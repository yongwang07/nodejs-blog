var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

module.exports = {
  create: function create(comment) {
    return Comment.create(comment);
  },

  delCommentById: function delCommentById(commentId, author) {
    return Comment.remove({ author: author, _id: commentId });
  },

  delCommentsByPostId: function delCommentsByPostId(postId) {
    return Comment.remove({ postId: postId });
  },

  getComments: function getComments(postId) {
    return Comment
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 });
  },
};
