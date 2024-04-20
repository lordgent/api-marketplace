const { Carts,Products,Categories,Merchants } = require("../../models");
const { v4: uuidv4 } = require("uuid");

exports.addToCart = async (req, res) => {
  try {
    const body = {
      id: uuidv4(),
      userId: req.userid,
      productId: req.body.productId,
      qty: req.body.qty,
    };

    const findProduct = await Carts.findOne({
      where: {
        userId: req.userid,
        productId: req.body.productId,
      },
    });

    if (findProduct !== null) {
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "product already exist",
      });
    }

    const data = await Carts.create(body);
    return res.status(200).send({
      status: "success",
      message: "add to cart success",
      data: data.id,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const data = await Carts.findAll({
      where: {
        userId: req.userid,
      },
      include: [
        {
          model: Products,
          as: "product",
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
          ]
        },
      ],
    });

    return res.status(200).send({
      status: "success",
      message: "List cart",
      data: {
        carts: data,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
