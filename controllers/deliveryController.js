// Temporary storage for testing
let deliveries = [];


// Get all deliveries
exports.getDeliveries = (req, res) => {
    res.status(200).json(deliveries);
};


// Record a new delivery
exports.addDelivery = (req, res) => {

    const { farmerId, litres } = req.body;

    // Validate farmer ID
    if (!farmerId) {
        return res.status(400).json({
            error: "Farmer ID is required"
        });
    }

    // Validate litres
    if (litres === undefined || litres === null ||
        litres === "" || !Number.isFinite(litres) || litres <= 0) {

        return res.status(400).json({
            error: "Litres must be a number greater than zero"
        });
    }

    const newDelivery = {
        id: deliveries.length + 1,
        farmerId,
        litres
    };

    deliveries.push(newDelivery);

    res.status(201).json({
        message: "Delivery saved successfully",
        delivery: newDelivery
    });
};