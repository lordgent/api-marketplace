const { Categories } = require("../../models");

const { v4: uuidv4 } = require("uuid");

exports.addCategory = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      icon: "uploads/categories/" + req.files.iconCategory[0].filename,
      id: uuidv4(),
      isDelete: 0,
    };

    const data = await Categories.create(body);

    return res.status(200).send({
      status: "SUCCESS",
      message: "add category success",
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
      where: {
        isDelete: 0,
      },
      order: [["name", "ASC"]],
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "list category",
      data: categories,
    });
    
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.getDetailCategory = async (req, res) => {
  try {
    const categories = await Categories.findOne({
      where: {
        isDelete: 0,
        id: req.params.id
      }
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "detail category",
      data: categories,
    });
    
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Categories.findOne({
      where: {
        id: req.body.id
      }
    });

    category.name = req.body.name;
    category.icon = !req.files.iconCategory.length ? null : "uploads/categories/" + req.files.iconCategory[0].filename;

    const save = await category.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "update category success",
      data: save.name,
    });

  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.isDeleteCategory = async (req, res) => {
  try {
    
    const category = await Categories.findOne({
      where: {
        id: req.params.id
      }
    });

    category.isDelete = 1;

    const save = await category.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "update category success",
      data: save.name,
    });

  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


