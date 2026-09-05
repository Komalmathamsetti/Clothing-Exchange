const { calculateClothingValue } = require("../services/valueCaluculator");
exports.calculateValue = (req,res)=>{
    try{
        const{
            category_id,
            brand,
            clothing_condition
        } = req.body;
        if(!category_id){
            return res.status(403).json({
                success:false,
                message:"Category is required"
            });
        }
        if(!clothing_condition){
            return res.status(403).json({
                success:false,
                message:"Clothing condition is required"
            });
        }
        const result = calculateClothingValue({
            categoryId: category_id,
            brand,
            condition: clothing_condition
        });
        return res.status(200).json({
            success:true,
            value: result.estimatedValue,
            breakdown:{
                baseValue: result.baseValue,
                brandMultiplier: result.brandMultiplier,
                conditionMultiplier: result.conditionMultiplier
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};