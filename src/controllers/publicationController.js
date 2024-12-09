const Publication = require('../models/Publication');

exports.createPublication = async (req, res) => {
    try {
        const publication = new Publication({
            ...req.body,
            user: req.user.userId
        });
        await publication.save();
        res.status(201).json(publication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllPublications = async (req, res) => {
    try {
        const publications = await Publication.find().populate('user', 'name').populate('category', 'name');
        res.json(publications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPublicationById = async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id).populate('user', 'name').populate('category', 'name');
        if (!publication) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json(publication);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePublication = async (req, res) => {
    try {
        const publication = await Publication.findOne({ _id: req.params.id, user: req.user.userId });
        if (!publication) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'location', 'category', 'isAvailable', 'review'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        updates.forEach(update => publication[update] = req.body[update]);
        await publication.save();

        res.json(publication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePublication = async (req, res) => {
    try {
        const publication = await Publication.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!publication) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};