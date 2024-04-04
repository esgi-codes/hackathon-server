var express = require("express");
var router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            "https://jira-mon.atlassian.net/rest/api/2/project/JI",
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        "EMAIL:API_KEY",
                    ).toString("base64")}`,
                    Accept: "application/json",
                },
            },
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Failed to fetch data");
    }
});

module.exports = router;
