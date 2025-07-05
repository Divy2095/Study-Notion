const Category = require("../models/Category");
exports.createCategory = async (req,res) => {
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
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);

        // return res
        return res.status(200).json({
            success: true,
            message: "Category created successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// getAlltags handler function
exports.showAllcategory = async (req,res) => {
    try {
        const allcategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success: true,
            message: "All categorys returned successfully.",
            allcategory,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.categoryPageDetails=async(req,res)=>{
  try{
        const{categoryId}=req.body;
        //get courses for the specifie categiry
        const selectedCategory=await Category.findById(categoryId).populate("courses").exec();
        console.log(selectedCategory);
        if(!selectedCategory){
          console.log("Category not found");
          return res.status(404).json({success:false,
          message:"category not found"});
        }
        if(selectedCategory.courses.length===0){
           console.log("No courses found for the selected category");
           return res.status(404).json({
            success:false,
            message:"No courses found for the selected category",
           })
        }

        const selectedCourses=selectedCategory.courses;

        const categoriesExceptSelected=await Category.find({
          _id:{$ne:categoryId},

        }).populate("courses");
        let differentCourses=[];
        for(const category of categoriesExceptSelected){
          differentCourses.push(...category.courses);
        }
        //get top selling courses across all categories
        const allCategory=await Category.find().populate("courses");
        const allCourses=allCategory.flatMap((category)=>category.courses);
        const mostSellingCourses=allCourses
        .sort((a,b)=>b.sold-a.sold)
        .slice(0,10);

        res.status(200).json({
          selectedCourses:selectedCourses,
          differentCourses:differentCourses,
          mostSellingCourses:mostSellingCourses,
        });
  }
  catch(error){
      return res.status(500).json({
        success:false,
        message:"Internal server error",
        error:error.message,
      })
  }
}