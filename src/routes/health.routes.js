const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Endpoint de vérification de l’état du serveur
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
