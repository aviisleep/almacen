
const Bay = require('../models/Bay'); // Assuming you have a Bay model

// Controller to handle bay-related operations
const baysController = {
    // Get all bays
    getAllBays: async (req, res) => {
        try {
            const bays = await Bay.find();
            res.status(200).json(bays);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bays', error });
        }
    },

    // Get a single bay by ID
    getBayById: async (req, res) => {
        try {
            const bay = await Bay.findById(req.params.id);
            if (!bay) {
                return res.status(404).json({ message: 'Bay not found' });
            }
            res.status(200).json(bay);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bay', error });
        }
    },

    // Create a new bay
    createBay: async (req, res) => {
        try {
            const newBay = new Bay(req.body);
            const savedBay = await newBay.save();
            res.status(201).json(savedBay);
        } catch (error) {
            res.status(500).json({ message: 'Error creating bay', error });
        }
    },

    // Update a bay by ID
    updateBay: async (req, res) => {
        try {
            const updatedBay = await Bay.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedBay) {
                return res.status(404).json({ message: 'Bay not found' });
            }
            res.status(200).json(updatedBay);
        } catch (error) {
            res.status(500).json({ message: 'Error updating bay', error });
        }
    },

    // Delete a bay by ID
    deleteBay: async (req, res) => {
        try {
            const deletedBay = await Bay.findByIdAndDelete(req.params.id);
            if (!deletedBay) {
                return res.status(404).json({ message: 'Bay not found' });
            }
            res.status(200).json({ message: 'Bay deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting bay', error });
        }
    },
};

module.exports = baysController;