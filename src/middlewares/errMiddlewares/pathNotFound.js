const pathNotFound = (req,res) =>{
    res.status(404).json({message:"Path Not found"})
}

module.exports = pathNotFound; 