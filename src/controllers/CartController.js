const { Carts, Products, Categories, Merchants,  ImageProducts, } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

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

    if (findProduct) {

      findProduct.qty = findProduct.qty + 1;
      findProduct.save();
      return res.status(200).send({
        status: "SUCCESS",
        message: "success",
        data: findProduct.id,
      });

    }

    const data = await Carts.create(body);
    return res.status(200).send({
      status: "SUCCESS",
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
              attributes: ["name", "icon"],
            },
            {
              model: Merchants,
              as: "merchant",
              attributes: ["merchant_name"],
            },
            {
              model: ImageProducts,
              as: "imageProduct",
            },
            
          ],
        },
      ],
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "List cart",
      data: {
        carts: data,
        total: data.length
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.addQtyCart = async (req,res) => {
  try{

    const findCart = await Carts.findOne({
      where: {
        id: req.body.cartId,
        userId: req.userid,
      },
    });

    if(findCart === null){
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "Cart Not Found",
      });
    }

    findCart.qty = req.body.qty;
    findCart.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "update qty cart",
      data: findCart.id,
    });

  }catch(error){
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
}


exports.deleteCart = async ( req,res) => {
  try{
    const findCart = await Carts.findOne({
      where: {
        id: req.body.cartId,
        userId: req.userid,
      },
    });
    
    if(findCart === null){
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "Cart Not Found",
      });
    }

    
    findCart.destroy();

    return res.status(200).send({
      status: "SUCCESS",
      message: "delete cart success",
      data: req.body.cartId,
    });

  }catch(error){
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
}

exports.totalPrice = async (req, res) => {
  try {
    const data = await Carts.findAll({
      where: {
        userId: req.userid,
        id: {
          [Op.in]: req.body.cart,
        },
      },
      include: [
        {
          model: Products,
          as: "product",
        },
      ],
    });

    const listTotal = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let totalPrd = element.qty * parseInt(element.product.price);
      listTotal.push(totalPrd);
    }

    const totalPrice = listTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return res.status(200).send({
      status: "SUCCESS",
      message: "Total price",
      data: totalPrice,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
