// just a dummy for now until the website is finished
const express = require('express');
const router = express.Router();

// Game instances allocation maps
router.get('/v1/games/list', (req, res) => {
    res.status(200).json({ data: [] });
});

router.post('/v1/games/v1/request-game-job', (req, res) => {
    // Generates client boot configurations (joinScriptUrls)
    res.status(200).json({ joinScriptUrl: "https://api.ziptrii.xyz/game/join" });
});

module.exports = router;
