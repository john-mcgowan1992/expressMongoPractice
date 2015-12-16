// Make sure your `mongod` process is running!
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assessjs');
mongoose.connection.on('error', console.error.bind(console, 'MongoDb connection error: '));
//---------VVVV---------  your code below  ---------VVV----------

var articleSchema = new mongoose.Schema({

});

//---------^^^---------  your code above  ---------^^^----------
var Article = mongoose.model('Article', articleSchema);
module.exports = Article;
