var expect = require('chai').expect,
    Article = require('../models/article');
/**
 *
 * Start here!
 *
 * These tests describe the model that you'll be writing in models/article.js
 *
 */

describe('Articles', function () {

    var fullText = 'The South African cliff swallow (Petrochelidon spilodera), also known as the South African swallow, is a species of bird in the Hirundinidae family.';

    /**
     * Your model should have two fields (both required): `title` and `content`.
     *
     * http://mongoosejs.com/docs/api.html#schematype_SchemaType-required
     */
    it('has title and content fields of type String', function (done) {

        var article = new Article({
            title: 'Migratory Birds',
            content: fullText
        });

        article.save().then(function (savedArticle) {
            expect(savedArticle.title).to.equal('Migratory Birds');
            expect(savedArticle.content).to.equal(fullText);
            done();
        }).then(null, done);

    });

    xit('requires content', function (done) {

        var article = new Article({
            title: 'My Second Article'
        });

        article.validate(function (err) {
            expect(err).to.be.an('object');
            expect(err.message).to.equal('Article validation failed');
            done();
        });

    });

    xit('requires title', function (done) {

        var article = new Article({
            content: 'Some more wonderful text'
        });

        article.validate(function (err) {
            expect(err).to.be.an('object');
            expect(err.message).to.equal('Article validation failed');
            done();
        });

    });

    xit('has lastUpdatedAt field that is originally the time at creation', function (done) {

        var timestampJustBeforeCreation = Date.now();

        var article = new Article({
            title: 'Ada Lovelace',
            content: 'World\'s first computer programmer, predated any *actual* computer.'
        });

        article.save().then(function (createdArticle) {

            var lastUpdatedAt = createdArticle.lastUpdatedAt;

            expect(lastUpdatedAt).to.exist;
            expect(lastUpdatedAt).to.be.an.instanceOf(Date);

            expect(Number(lastUpdatedAt)).to.be.closeTo(timestampJustBeforeCreation, 5);

            setTimeout(function () {
                // should still be the same as before, seeing as we have not resaved
                expect(createdArticle.lastUpdatedAt).to.equal(lastUpdatedAt);
                done();
            }, 50);

        }).then(null, done);

    });

    /**
     * Set up a virtual field (check out mongoose virtuals) called `snippet`
     * that returns the first 23 characters of the content followed by "...".
     *
     * http://mongoosejs.com/docs/guide.html#virtuals
     */
    xit('has a virtual 23-character snippet field appended with "..."', function (done) {

        Article.findOne({ title: 'Migratory Birds' }).exec().then(function (article) {
            expect(article.content).to.equal(fullText);
            expect(article.snippet).to.equal('The South African cliff...');
            done();
        }).then(null, done);

    });

    /**
     * Set up an instance method (check out mongoose .methods) called `truncate`
     * that will permanently shorten the article content to a passed-in length.
     *
     * http://mongoosejs.com/docs/guide.html#methods
     */
    xit('has an instance method to truncate the content', function (done) {

        Article.findOne({ title: 'Migratory Birds' }).exec().then(function (article) {
            expect(article.content).to.equal(fullText);
            article.truncate(12);
            expect(article.content).to.equal('The South Af');
            done();
        }).then(null, done);

    });

    xit('content truncation accepts any length', function (done) {

        Article.findOne({ title: 'Migratory Birds' }).exec().then(function (article) {
            var randLength = Math.ceil(Math.random() * 20);
            expect(article.content).to.equal(fullText);
            article.truncate(randLength);
            expect(article.content).to.have.length(randLength);
            // not saving the article, so the change won't persist to the next test.
            done();
        }).then(null, done);

    });

    /**
     * Set up a static method called findByTitle that's a convenience
     * method to find a *single* document by its title.
     *
     * There are specs for a vanilla callback version and a promise
     * version. It'd be great if you could get both to work, but even
     * just one is solid.
     *
     * http://mongoosejs.com/docs/guide.html#statics
     */

    xit('static method findByTitle can work with vanilla callbacks', function (done) {

        Article.findByTitle('Migratory Birds', function (err, article) {
            if (err) return done(err);
            expect(article).not.to.be.an.instanceof(Array);
            expect(article.content).to.equal(fullText);
            done();
        });

    });

    xit('static method findByTitle can work with promise style', function (done) {

        Article.findByTitle('Migratory Birds')
            .then(function (article) {
                expect(article).not.to.be.an.instanceOf(Array);
                expect(article.content).to.equal(fullText);
                done();
            })
            .then(null, done);

    });

    /**
     * Remember mongoose hooks?
     */

    xit('recalculates lastUpdatedAt field before every save', function (done) {

        Article.findOne({ title: 'Migratory Birds' }).exec().then(function (article) {

            var prevArticle = article.toObject();
            var timestampJustBeforeSave = Date.now();

            article.content = 'The barn swallow is a bird of open country that normally uses man-made structures to breed and consequently has spread with human expansion.';

            return article.save().then(function (updatedArticle) {
                expect(updatedArticle.lastUpdatedAt).to.be.above(prevArticle.lastUpdatedAt);
                expect(Number(updatedArticle.lastUpdatedAt)).to.be.closeTo(timestampJustBeforeSave, 5);
                done();
            });

        }).then(null, done);

    });


    /** EXTRA CREDIT
     * Your Article model should have a tag field that's an array, but when we
     * access it, we should get one string: the tags joined by a comma and space
     *
     * Look at Schema getters:
     * http://mongoosejs.com/docs/api.html#schematype_SchemaType-get
     *
     * To activate this spec, change `xit` to `it`
     */
    xit('has a tags field with a custom getter', function () {
        var article = new Article({title: 'Taggy', content: 'So Taggy'});
        article.tags = ['tag1', 'tag2', 'tag3'];
        expect(article.tags).to.equal('tag1, tag2, tag3');
    });

});
