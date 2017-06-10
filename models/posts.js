var marked = require('marked');
var Post = require('../lib/mongo').Post;
var CommentModel = require('./comments');


module.exports = {
  create: function create(post) {
    return Post.create(post);
  },

  getPostById: function getPostById(postId) {
    return Post
      .findOne({ _id: postId }).fill('commentsCount')
      .populate({ path: 'author', model: 'User' });
  },

  getPosts: function getPosts(author) {
    var query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query).fill('commentsCount')
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 });
  },

  incPv: function incPv(postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } });
  },

  getRawPostById: function getRawPostById(postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' });
  },

  updatePostById: function updatePostById(postId, author, data) {
    return Post.update({ author: author, _id: postId }, { $set: data });
  },

  delPostById: function delPostById(postId, author) {
    return Post.remove({ author: author, _id: postId })
      .then(function (res) {
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId);
        }
      });
  }
};