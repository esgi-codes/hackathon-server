const express = require("express");
const axios = require("axios");
const router = express.Router();

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

router.get("/issues", async (req, res) => {
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
