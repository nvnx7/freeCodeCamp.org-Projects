/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const model = require('../models/project.js');
const Issue = model.Issue;
const Project = model.Project;

chai.use(chaiHttp);

const createTestIssue = (done, issue_title, cb) => {
  const projectName = 'test';

  const issue = {
    issue_title: issue_title,
    issue_text: 'test issue text',
    created_by: 'test',
    assigned_to: 'chai and mocha',
    open: true,
    status_text: 'test issue status'
  };

  Project.findOne({project_name: projectName}, (err, project) => {
    if (err) {
      console.log("ERROR:", err)
    } else {
      if (project == null) {
        console.log("Creating project apitest");
        var newProject = new Project({
          project_name: projectName,
          issues: []
        });
        newProject.issues.push(issue);
        newProject
        .save()
        .then((data) => {
          console.log('Inserted test issue');
          if (cb) cb(data.issues[data.issues.length-1]._id);
          done();
        });

      } else {
        project.issues.push(issue);
        project
        .save()
        .then((data) => {
          console.log('Inserted test issue');
          if (cb) cb(data.issues[0]._id);
          done();
        });
      }
    }
  });
}

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');

          done();
        });
      });

      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.notEqual(res.body.issue_title, '');
          assert.notEqual(res.body.issue_text, '');
          assert.notEqual(res.body.created_by, '');

          done();
        });
      });

      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'Missing required field');

          done();
        });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {
      var testId;

      before((done) => {
        createTestIssue(done, "test-issue", (issueId) => {
          testId = issueId;
        });
      });

      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
         _id: testId
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'no updated field sent');
          done();
        });
      });

      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
         _id: testId,
         issue_title: 'Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'successfully updated');
          done();
        });
      });

      test('Multiple fields to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId,
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'successfully updated');

          done();
        });
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      before((done) => {
        createTestIssue(done, "test-issue");
      });

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'test-issue'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'test-issue', created_by: 'test', open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {
      var testId;

      before((done) => {
        createTestIssue(done, 'test-issue', (issueId) => {
          testId = issueId;
          console.log("test id:", issueId);
        });
      });

      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test/')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'could not delete ' + undefined);
          done();
        });
      });

      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: testId})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'deleted ' + testId);
          done();
        })
      });

    });

});
