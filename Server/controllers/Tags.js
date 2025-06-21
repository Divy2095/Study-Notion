const Tag = require("../models/Tags");
exports.createTag = async (req,res) => {
    try {
        // Fetch Data
        const {name, description} = req.body;

        // Validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });
        console.log(tagDetails);

        // return res
        return res.status(200).json({
            success: true,
            message: "Tag created successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// getAlltags handler function
exports.showAlltags = async (req,res) => {
    try {
        const allTags = await Tag.find({}, {name:true, description:true});
        res.status(200).json({
            success: true,
            message: "All tags returned successfully.",
            allTags,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}