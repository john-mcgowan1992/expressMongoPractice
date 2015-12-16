var mongoose = require('mongoose'),
  Article = mongoose.model('Article');

/**
 * Clear database
 *
 */

exports.clearDb = function () {
  return Article.remove({}).exec();
};
