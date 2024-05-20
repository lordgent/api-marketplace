const { Wishlist,Products,Merchants,ImageProducts,Categories } = require("../../models");
const { v4: uuidv4 } = require("uuid");

exports.createFavorite = async (req, res) => {
  try {
    const find = await Wishlist.findOne({
      where: {
        productId: req.body.productId,
        userId: req.userid,
      },
    });

    if (find !== null) {
      return res.status(200).send({
        status: "SUCCESS",
        message: "create success",
        data: find.id,
      });
    }

    const save = await Wishlist.create({
      id: uuidv4(),
      userId: req.userid,
      productId: req.body.productId,
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "create success",
      data: save.id,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.getUserWhistList = async(req,res) => {
    try{
        const findList = await Wishlist.findAll({
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
            message: "wishlist",
            data: findList,
          });

    }catch(error){
        return res.status(500).send({
            status: "INTERNAL SERVER ERROR",
            message: error.message,
          });
    }
}

exports.deleteFavorite = async (req, res) => {
  try {
    const find = await Wishlist.findOne({
      where: {
        id: req.body.id,
        userId: req.userid
      },
    });

    if (find === null) {
      return res.status(200).send({
        status: "BAD REQUEST",
        message: "not Found",
        data: req.body.id,
      });
    }

    await Wishlist.destroy({
      where: {
        id: req.body.id,
        userId: req.userid
      }
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "delete success",
      data: req.body.id,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
