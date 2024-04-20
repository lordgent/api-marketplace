const { Merchants, Users,AccessRoles,Roles } = require("../../models");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

exports.createMerchant = async (req, res) => {
  const schema = Joi.object({
    merchant_name: Joi.string().min(4).required(),
    merchant_description: Joi.string().min(4).required(),
    phone_number: Joi.string().min(4).required(),
    address: Joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const { merchant_name, merchant_description, address, phone_number } =
      req.body;

      const findExist = await Merchants.findOne({
        where:{
          userId: req.userid,
        }
      })

      if(findExist !== null){
        return res.status(400).send({
          status: "BAD REQUEST",
          message: "Merchant Already Exist"
        });
      }

    const data = await Merchants.create({
      id: uuidv4(),
      merchant_name: merchant_name,
      merchant_description: merchant_description,
      phone_number: phone_number,
      address: address,
      userId: req.userid,
    });

    const findRole = await Roles.findOne({
      where: {
        name: "merchant",
      },
    });


    await AccessRoles.create({
      userId: req.userid,
      roleId: findRole.id
    })

    return res.status(200).send({
      status: "success",
      data: {
        merchant: data.merchant_name,
      },
    });

  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
