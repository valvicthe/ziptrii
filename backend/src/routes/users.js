const express = require('express');
const router = express.Router();

// Contextual profile processing engines
router.get('/v1/users/:userId', (req, res) => {
    res.status(200).json({
        id: req.params.userId,
        name: "Player",
        displayName: "ZiptriiUser",
        description: "Welcome to Ziptrii 2020.",
        created: new Date().toISOString()
    });
});

module.exports = router;
