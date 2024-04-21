const { Products, Categories, Merchants } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

exports.addProduct = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    description: Joi.string().min(4).required(),
    price: Joi.alternatives().try(
      Joi.string().regex(/^\d+$/).min(5).required(),
      Joi.number().min(5).required()
    ),
    stock: Joi.number().required(),
    weight: Joi.number().required(),
    categoryId: Joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { name, description, price, stock, weight, categoryId } = req.body;

    const findProduct = await Products.findOne({
      where: {
        name: name,
      },
    });

    if (findProduct !== null) {
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "product already exist",
      });
    }

    const find = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });

    const body = {
      id: uuidv4(),
      name: name,
      description: description,
      price: price,
      stock: stock,
      weight: weight,
      photo: "uploads/products/" + req.files.imageProduct[0].filename,
      merchantId: find.id,
      categoryId: categoryId,
      userId: req.userid,
    };

    const data = await Products.create(body);

    return res.status(200).send({
      status: "SUCCESS",
      message: "create product success",
      data: data.name,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    const offset = page * limit;

    const products = await Products.findAll({
      order: [["name", "ASC"]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["name","icon"],
        },
        {
          model: Merchants,
          as: "merchant",
          attributes: ["merchant_name"],
        },
      ],
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "list products",
      data: {
        products: products,
        page: {
          offset: page,
          limit: limit,
          totalData: products.length,
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
