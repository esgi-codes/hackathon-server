var express = require('express');
var router = express.Router();
const axios = require("axios");

const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_API_TOKEN;
const jiraBaseURL = process.env.JIRA_BASE_URL;

const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;

const axiosConfig = {
  headers: {
    Authorization: authHeader,
    Accept: "application/json",
  },
};

router.get("/project/:projectId", async (req, res) => {
  try {
    const projectURL = `${jiraBaseURL}/rest/api/2/project/${req.query.projectId}`; // Corrected dynamic variable insertion
    const response = await axios.get(projectURL, axiosConfig);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching project data:", error);
    if (error.response.status === 404) {
      return res.status(404).send("Project not found.");
    }
    res.status(500).send("Failed to fetch project data.");
  }
});

router.get("/", async (req, res) => {
  try {
    const issuesURL = `${jiraBaseURL}/rest/agile/1.0/board/1/epic/none/issue?expand=names&fields=summary,assignee,status,customfield_10060`;
    const response = await axios.get(issuesURL, axiosConfig);

    res.json(response.data.issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).send("Failed to fetch issues.");
  }
});

router.get("/issues/unassigned", async (req, res) => {
  try {
    const issueURL = `${jiraBaseURL}/rest/agile/1.0/board/1/epic/none/issue?jql=assignee=null`;
    const response = await axios.get(issueURL, axiosConfig);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    if (error.response.status === 404) {
      return res.status(404).send("Assignee not found.");
    }
    res.status(500).send("Failed to fetch issues.");
  }
});

router.post("/issues/unassign", async (req, res) => {
  try {
    const unassignURL = `${jiraBaseURL}/rest/api/3/issue/${req.body.issueId}/assignee`;
    const response = await axios.put(unassignURL, { name: null }, axiosConfig);

    res.status(204).send();
  } catch (error) {
    console.error("Error unassigning issue:", error.message);
    if (error.response.status === 404) {
      return res.status(404).send("Issue not found.");
    }
    res.status(500).send("Failed to unassign issue.");
  }
});

router.post("/issues/assign", async (req, res) => {

  if (!req.body.assignee) {
    return res.status(400).send("Assignee is required.");
  }

  if (!req.body.issueId) {
    return res.status(400).send("Issue ID is required.");
  }

  try {
    const unassignURL = `${jiraBaseURL}/rest/api/3/issue/${req.body.issueId}/assignee`;
    const response = await axios.put(unassignURL, { accountId: req.body.assignee }, axiosConfig);

    res.status(204).send();
  } catch (error) {
    console.error("Error assigning issue:", error.message);
    if (error.response.status === 404) {
      return res.status(404).send("Issue not found.");
    }
    res.status(500).send("Failed to assign issue.");
  }
});

router.get("/issues/assigned/:assignee", async (req, res) => {
  try {
    const issueURL = `${jiraBaseURL}/rest/agile/1.0/board/1/epic/none/issue?jql=assignee=${req.params.assignee}`;
    const response = await axios.get(issueURL, axiosConfig);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    if (error.response.status === 404) {
      return res.status(404).send("Assignee not found.");
    }
    res.status(500).send("Failed to fetch issues.");
  }
});

module.exports = router;


// router.get('/', function (req, res, next) {
//   // OK to act as a health check for aws  
//   res.send('OK');
// });

// router.get('/health', function (req, res, next) {
//   res.send('OK');
// });

// module.exports = router;
