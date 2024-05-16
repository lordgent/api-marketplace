const {
  Orders,
  OrderItems,
  Carts,
  Products,
  Merchants,
  TransactionStatus,
} = require("../../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

exports.checkOutCart = async (req, res) => {
  try {
    const findStatus = await TransactionStatus.findOne({
      where: {
        name: "WAITING PAYMENT",
      },
    });

    if (findStatus === null) {
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "Status Not Found",
      });
    }
    const findCart = await Carts.findAll({
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
          include: [
            {
              model: Merchants,
              as: "merchant",
              attributes: ["merchant_name", "id", "userId"],
            },
          ],
        },
      ],
    });

    const listTotal = [];
    for (let i = 0; i < findCart.length; i++) {
      const element = findCart[i];
      let totalPrd = element.qty * parseInt(element.product.price);
      listTotal.push(totalPrd);
    }

    const totalPrice = listTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const saveOrder = await Orders.create({
      id: uuidv4(),
      buyerId: req.userid,
      totalPrice: totalPrice,
      transactionStatusId: findStatus.id,
      code: getInv(),
    });

    let orders = [];

    for (let k = 0; k < req.body.cart.length; k++) {
      
      const element = req.body.cart[k];
      const cart = await Carts.findOne({
        where: {
          id: element,
        },
        include: [
          {
            model: Products,
            as: "product",
            attributes: ["merchantId", "id", "price"],
            include: [
              {
                model: Merchants,
                as: "merchant",
                attributes: ["merchant_name", "id"],
              },
            ],
          },
        ],
      });

      const totalPrice = parseInt(cart.product.price) * cart.qty;
      const saveItem = await OrderItems.create({
        id: uuidv4(),
        productId: cart.productId,
        buyerId: req.userid,
        sellerId: cart.product.merchant.id,
        totalPrice: totalPrice.toString(),
        orderId: saveOrder.id,
        qty: cart.qty,
        originalPrice: cart.product.price,
      });
      orders.push(saveItem);
    }

    if (saveOrder !== null) {
      for (let j = 0; j < req.body.cart.length; j++) {
        const element = req.body.cart[j];
        await Carts.destroy({
          where: {
            id: element,
          },
        });
      }
    }

    return res.status(200).send({
      status: "SUCCESS",
      message: "checkout success",
      data: orders,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.getUserOrder = async (req, res) => {
  try {
    const orders = [];

    const data = await Orders.findAll({
      where: {
        buyerId: req.userid,
      },
      include: [
        {
          model: TransactionStatus,
          as: "transactionStatus",
          attributes: ["name", "id"],
        },
      ],
    });

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const items = await OrderItems.findAll({
        where: {
          orderId: element.id,
        },
        include: [
          {
            model: Products,
            as: "product",
            attributes: ["merchantId", "id", "price", "name"],
            include: [
              {
                model: Merchants,
                as: "merchant",
                attributes: ["merchant_name", "id"],
              },
            ],
          },
        ],
      });
      let obj = {
        id: data[i].id,
        code: data[i].code,
        proofPayment: data[i].proofPayment,
        totalPrice: data[i].totalPrice,
        transactionstatus: data[i].transactionStatus,
        items: items,
      };
      orders.push(obj);
    }

    return res.status(200).send({
      status: "SUCCESS",
      message: "List Order",
      data: orders,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

function getFormattedDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).substr(-2);
  return day + month + year;
}

function getInv() {
  const formatNum = Math.floor(Math.random() * 900) + 100;
  const transactionId = `INV${getFormattedDate()}${formatNum}`;
  return transactionId;
}
