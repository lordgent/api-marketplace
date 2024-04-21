const { Product,Categories } = require("../../models");

const { v4: uuidv4 } = require("uuid");

exports.addCategory = async (req, res) => {

  try {

    const body = {
      name: req.body.name,
      icon: "uploads/categories/" + req.files.iconCategory[0].filename,
      id: uuidv4(),
    };
    
    const data = await Categories.create(body);

    return res.status(200).send({
      status: "SUCCESS",
      message: 'add category success',
      data: data,
    });
  
  } catch (error) {
    return res.status(500).send({
      status: "SERVER ERROR",
      message: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      order: [['name', 'ASC']], 
    });


    return res.status(200).send({
      status: "SUCCESS",
      message: "list category",
      data: categories,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
