var expect = require('chai').expect,
    request = require('supertest'),
    app = require('../app'),
    Article = require('../models/article'),
    agent = request.agent(app);

/**
 *
 * Article Route Tests
 *
 * Do these after you finish the Article Model tests
 *
 */
describe('Articles Route:', function () {

    /**
     * First we clear the database before beginning each run
     */
    before(function (done) {
        require('./helper').clearDb().then(function () {
            done();
        }, done);
    });

    describe('GET /articles', function () {
        /**
         * Problem 1
         * We'll run a GET request to /articles
         *
         * 1.  It should return JSON (i.e., use res.json)
         * 2.  Because there isn't anything in the DB, it should be an empty array
         *
         * **Extra Credit**: Consider using app.param to automatically load
         * in the Article whenever a param :id is detected
         */
        xit('responds with an array via JSON', function (done) {

            agent
                .get('/articles')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    // res.body is the JSON return object
                    expect(res.body).to.be.an.instanceOf(Array);
                    expect(res.body).to.have.length(0);
                })
                .end(done);

        });

        /**
         * Problem 2
         * Save an article in the database using our model and then retrieve it
         * using the GET /articles route
         *
         */
        xit('returns an article if there is one in the DB', function (done) {

            var article = new Article({
                title: 'Test Article',
                content: 'Test body'
            });

            article.save().then(function () {

                agent
                    .get('/articles')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body).to.be.an.instanceOf(Array);
                        expect(res.body[0].content).to.equal('Test body');
                    })
                    .end(done);

            }).then(null, done);

        });

        /**
         * Problem 3
         * Save a second article in the database using our model, then retrieve it
         * using the GET /articles route
         *
         */
        xit('returns another article if there is one in the DB', function (done) {

            var article = new Article({
                title: 'Another Test Article',
                content: 'Another test body'
            });

            article.save().then(function () {

                agent
                    .get('/articles')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body).to.be.an.instanceOf(Array);
                        expect(res.body[0].content).to.equal('Test body');
                        expect(res.body[1].content).to.equal('Another test body');
                    })
                    .end(done);

            }).then(null, done);

        });

    });

    /**
     * Search for articles by ID
     */
    describe('GET /articles/:id', function () {

        var article;

        // create another article for test
        before(function (done) {

            article = new Article({
                title: 'Second Article',
                content: 'This article is good'
            });

            article.save().then(function () {
                done();
            }, done);

        });

        /**
         * This is a proper GET /articles/ID request
         * where we search by the ID of the article created above
         */
        xit('returns the JSON of the article based on the id', function (done) {
            agent
                .get('/articles/' + article._id)
                .expect(200)
                .expect(function (res) {
                    if (typeof res.body === 'string') {
                        res.body = JSON.parse(res.body);
                    }
                    expect(res.body.title).to.equal('Second Article');
                })
                .end(done);
        });

        /**
         * Here we pass in a bad ID to the URL, we should get a 500 error
         */
        xit('returns a 500 error if the ID is not correct', function (done) {
            agent
                .get('/articles/' + '821083012083012983')
                .expect(500)
                .end(done);
        });

    });

    /**
     * Series of tests to test creation of new Articles using a POST
     * request to /articles
     */
    describe('POST /articles', function () {

        /**
         * Test the creation of an article
         * Here we don't get back just the article, we get back a Object
         * of this type:
         *
         * {
     *   message: 'Created successfully'
     *   article: {
     *     _id: ...
     *     title: ...
     *   }
     * }
         */
        xit('creates a new article', function (done) {
            agent
                .post('/articles')
                .send({
                    title: 'Awesome POST-Created Article',
                    content: 'Can you believe I did this in a test?'
                })
                .expect(200)
                .expect(function (res) {
                    expect(res.body.message).to.equal('Created successfully');
                    expect(res.body.article._id).to.not.be.an('undefined');
                    expect(res.body.article.title).to.equal('Awesome POST-Created Article');
                })
                .end(done);
        });

        // This one should fail with a 500 because we don't set the article.body
        xit('does not create a new article without a body', function (done) {
            agent
                .post('/articles')
                .send({
                    title: 'This Article Should Not Be Allowed'
                })
                .expect(500)
                .end(done);
        });

        // Check if the articles were actually saved to the database
        xit('saves the article to the DB', function (done) {

            Article.findOne({
                title: 'Awesome POST-Created Article'
            }).exec().then(function (article) {
                expect(article).to.exist;
                expect(article.content).to.equal('Can you believe I did this in a test?');
                done();
            }).then(null, done);

        });

    });

    /**
     * Series of tests to test updating of Articles using a PUT
     * request to /articles/:id
     */
    describe('PUT /articles/:id', function () {

        var article;

        before(function (done) {

            Article.findOne({
                title: 'Awesome POST-Created Article'
            }).exec().then(function (_article) {
                article = _article;
                done();
            }).then(null, done);

        });

        /**
         * Test the updating of an article
         * Here we don't get back just the article, we get back a Object
         * of this type:
         *
         * {
     *   message: 'Updated successfully'
     *   article: {
     *     _id: ...
     *     title: ...
     *   }
     * }
         */
        xit('updates an article', function (done) {

            agent
                .put('/articles/' + article._id)
                .send({
                    title: 'Awesome PUT-Updated Article'
                })
                .expect(200)
                .expect(function (res) {
                    expect(res.body.message).to.equal('Updated successfully');
                    expect(res.body.article._id).to.not.be.an('undefined');
                    expect(res.body.article.title).to.equal('Awesome PUT-Updated Article');
                    expect(res.body.article.content).to.equal('Can you believe I did this in a test?');
                })
                .end(done);

        });

        xit('saves updates to the DB', function (done) {

            Article.findOne({
                title: 'Awesome PUT-Updated Article'
            }).exec().then(function (article) {
                expect(article).to.exist;
                expect(article.title).to.equal('Awesome PUT-Updated Article');
                done();
            }).then(null, done);

        });

        xit('gets 500 for invalid update', function (done) {
            agent
                .put('/articles/' + article._id)
                .send({
                    title: ''
                })
                .expect(500)
                .end(done);
        });

    });

});
