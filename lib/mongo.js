var config = require('config-lite')
  , mongoose = require('mongoose-fill')
  , Schema = mongoose.Schema
  , moment = require('moment')
  , marked = require('marked')
  , objectIdToTimestamp = require('objectid-to-timestamp');

mongoose.connect(config.mongodb);
var UserSchema = new Schema({
  name: { type: String , unique: true, index: true},
  password: { type:  String},
  avatar: { type: String },
  gender: { type: String, enum: ['m', 'f', 'x'] },
  bio: { type: String }
});
UserSchema.virtual('created_at').get(function(){
  return moment(objectIdToTimestamp(this._id)).format('YYYY-MM-DD HH:mm')
});
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});
exports.User = mongoose.model('User', UserSchema);

var PostSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: { type: 'string' },
  content: { type: 'string', get: function(content) {
    return marked(content);
  } },
  pv: { type: 'number' }
});
PostSchema.virtual('created_at').get(function(){
  return moment(objectIdToTimestamp(this._id)).format('YYYY-MM-DD HH:mm');
});

PostSchema.fill('commentsCount', function(cb) {
   Comment.getCommentsCount(this._id).exec(cb);
});

PostSchema.index({ author: 1, _id: -1 });
PostSchema.set('toJSON', {
	getters: true,
	virtuals: true
});
var Post = mongoose.model('Post', PostSchema);
exports.Post = Post;

var CommentSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: 'string', get: function(content) {
    return marked(content);
  } },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});
CommentSchema.statics.getCommentsCount = function(postId) {
  return this.count({ postId: postId });
};
CommentSchema.virtual('created_at').get(function(){
  return moment(objectIdToTimestamp(this._id)).format('YYYY-MM-DD HH:mm')
});
CommentSchema.index({ postId: 1, _id: 1 });
CommentSchema.index({ author: 1, _id: 1 });
CommentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});
var Comment = mongoose.model('Comment', CommentSchema);
exports.Comment = Comment;