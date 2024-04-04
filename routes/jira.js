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
        const issuesURL = `${jiraBaseURL}/rest/agile/1.0/board/1/epic/none/issue`;
        const response = await axios.get(issuesURL, axiosConfig);

        res.json(response.data.issues);
    } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).send("Failed to fetch issues.");
    }
});

module.exports = router;
