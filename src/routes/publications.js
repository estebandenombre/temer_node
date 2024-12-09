const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const auth = require('../middleware/auth');

router.post('/', auth, publicationController.createPublication);
router.get('/', publicationController.getAllPublications);
router.get('/:id', publicationController.getPublicationById);
router.put('/:id', auth, publicationController.updatePublication);
router.delete('/:id', auth, publicationController.deletePublication);

module.exports = router;