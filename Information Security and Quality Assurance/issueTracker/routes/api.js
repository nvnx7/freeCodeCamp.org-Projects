/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const model = require('../models/project.js');
const Issue = model.Issue;
const Project = model.Project;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/projects')

    .get((req, res) => {
      Project.find({}, (err, projects) => {
        if (err) {
          console.log("Error:", err);
        } else {
          res.json(projects);
        }
      })
    })

    .post((req, res) => {
      var projectName = req.body.project_name;
      var newProject = new Project({
        project_name: projectName,
        issues: []
      });

      newProject.save()
      .then((data) => {
        res.json(data);
      });
  });

  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      var title = req.query.issue_title;
      var created_by = req.query.created_by;
      var assigned_to = req.query.assigned_to;
      var created_on = req.query.created_on;
      var updated_on = req.query.updated_on;
      var open = req.query.open;

      Project.findOne({project_name: project}, (err, project) => {
        if (err) {
          console.log("ERROR:", err);
        } else {
          var issues = project.issues;
          if (title) {
            issues = issues.filter((issue) => {
              return issue.issue_title === title;
            });
          }

          if (open) {
            issues = issues.filter((issue) => {
              return issue.open.toString() === open;
            });
          }

          if (created_by) {
            issues = issues.filter((issue) => {
              return issue.created_by === created_by;
            });
          }

          if (assigned_to) {
            issues = issues.filter((issue) => {
              return issue.assigned_to === assigned_to;
            });
          }

          if (created_on) {
            issues = issues.filter((issue) => {
              return (new Date(issue.created_on).toDateString()) == (new Date(created_on).toDateString());
            });
          }

          if(updated_on) {
            issues = issues.filter((issue) => {
              return (new Date(issue.updated_on).toDateString()) == (new Date(updated_on).toDateString());
            });
          }

          res.json(issues);
        }
      });
    })

    .post(function (req, res){
      var projectName = req.params.project;
      var title = req.body.issue_title;
      var text = req.body.issue_text;
      var created_by = req.body.created_by;
      var assigned_to = req.body.assigned_to;
      var status = req.body.status_text;
      var created_on = new Date().toLocaleString();
      var updated_on = new Date().toLocaleString();
      var open = true;

      var newIssue = new Issue({
        issue_title: title,
        issue_text: text,
        created_by,
        assigned_to,
        status_text: status,
        created_on,
        updated_on,
        open
      });

      if (title && text && created_by) {

        Project.findOne({project_name: projectName}, (err, project) => {
          if (err) {
            console.log("ERROR:", err);
          } else {
            if (project == null) {
              var newProject = new Project({
                project_name: projectName,
                issues: []
              });

              newProject.issues.push(newIssue);
              newProject
              .save()
              .then((data) => {
                res.json(newIssue);
              })
              .catch((err) => {
                console.log("error:", err);
              });

            } else {

              console.log('found project:', projectName);
              project.issues.push(newIssue);

              project
              .save()
              .then((data) => {
                res.json(newIssue);
              })
              .catch((err) => {
                console.log("error:", err);
              });
            }
          }
        });
      } else {
        res.json({message: 'Missing required field'});
      }
    })

    .put(function (req, res){
      var projectName = req.params.project;
      console.log("PUT Project details:", req.body);
      var id = req.body._id;
      var title = (req.body.issue_title) ? req.body.issue_title.trim() : req.body.issue_title;
      var text = (req.body.issue_text) ? req.body.issue_text.trim() : req.body.issue_text;
      var created_by = (req.body.created_by) ? req.body.created_by.trim() : req.body.created_by;
      var assigned_to = (req.body.assigned_to) ? req.body.assigned_to.trim() : req.body.assigned_to;
      var status = (req.body.status_text) ? req.body.status_text.trim() : req.body.status_text;
      var open = req.body.open;

      console.log("PUT open inp:", open);

      if (title || text || created_by || assigned_to || status || open) {

        Project.findOne({project_name: projectName}, (err, project) => {
          if (err) {
            console.log("ERROR:", err);
          } else  {
            var wasUpdated = false;

            for (var issue of project.issues) {
              if (issue._id == id) {
                issue.issue_title = title ? title : issue.issue_title;
                issue.issue_text = text ? text : issue.issue_text;
                issue.created_by = created_by ? created_by : issue.created_by;
                issue.assigned_to = assigned_to ? assigned_to : issue.assigned_to;
                issue.status_text = status ? status : issue.status_text;
                issue.updated_on = new Date().toLocaleString();
                issue.open = open ? false : true;

                wasUpdated = true;
                break;
              }
            }

            if (wasUpdated) {
              project
              .save()
              .then((data) => {
                res.json({message: 'successfully updated'});
              });
            } else {
              res.json({message: 'could not update ' + id});
            }
          }
        });
      } else {
        res.json({message: 'no updated field sent'});
      }

    })

    .delete(function (req, res){
      var projectName = req.params.project;
      var id = req.body._id;

      Project.findOne({project_name: projectName}, (err, project) => {
        if (err) {
          console.log("ERROR:", err);
        } else  {
          var wasRemoved = false;
          project.issues = project.issues.filter((issue) => {
            if (issue._id == id) {
              wasRemoved = true;
            }
            return issue._id != id;
          });

          if (wasRemoved) {
            project
            .save()
            .then((data) => {
              res.json({message: 'deleted ' + id});
            });

          } else {
            res.json({message: 'could not delete ' + id});
          }

        }
      });
    });
};
