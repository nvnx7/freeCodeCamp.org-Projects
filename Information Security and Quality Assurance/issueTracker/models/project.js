const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
    min: 1,
    max: 40
  },

  issue_text: {
    type: String,
    required: true,
    min: 1,
    max: 500
  },

  created_by: {
    type: String,
    required: true
  },

  assigned_to: String,
  status_text: String,

  created_on: {
    type: String,
    default: new Date().toLocaleString()
  },

  updated_on: {
    type: String,
    default: new Date().toLocaleString()
  },

  open: Boolean
});

const projectSchema = new Schema({
  project_name: {
    type: String,
    required: true,
    min: 1,
    max: 50
  },

  issues: [issueSchema]
});

const Issue = mongoose.model('Issue', issueSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = {Issue, Project};
