const router = require('express').Router();

router.post('/issue-created', (req, res) => {
    console.log('####################### HEADERS #######################')
    console.log(req.headers);
    console.log('####################### BODY #######################')
    console.log(req.body);
    res.send(req.headers);

});

module.exports = router;