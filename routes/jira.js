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
                        "abdoudu78130@gmail.com:ATATT3xFfGF0evmNNi9svxdq_rhkF0o2JO68peR4AOBD53q2dNkM4mUa1kXoMJeiA72-IQuautzEvkMXaCXxiYGHJ_fa3Z1YJy8iZd0zxYMaznZq-sRfjffiDPi-K_AdHxI58mVDvAlks0O4QOAtklkg-_LNhaVcgzgMexFIFv4uOOxxDj94jMs=BE6DCD71",
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
