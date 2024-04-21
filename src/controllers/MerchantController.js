const { Merchants, Users, AccessRoles, Roles } = require("../../models");
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
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { merchant_name, merchant_description, address, phone_number } =
      req.body;

    const findExist = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });

    if (findExist !== null) {
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "Merchant Already Exist",
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
      roleId: findRole.id,
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "create merchant success",
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

exports.getMerchantInfo = async (req, res) => {
  try {
    const data = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });
    return res.status(200).send({
      status: "SUCCESS",
      message: "profile merchant",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.updateMerchantInfo = async (req, res) => {

  const schema = Joi.object({
    merchant_name: Joi.string().min(4).required(),
    merchant_description: Joi.string().min(4).required(),
    imageMerchant: Joi.string().min(4).required(),
    address: Joi.string().min(4).required(),
    city: Joi.string().min(4).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {


    const merchant = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });

    if(merchant === null){
      return res.status(404).send({
        status: "NOT FOUND",
        message: "Merchant not found"
      });
    }

    merchant.merchant_name = req.body.merchant_name;
    merchant.merchant_description = req.body.merchant_description;
    merchant.phone_number = req.body.phone_number;
    merchant.address = req.body.address;
    merchant.city = req.body.city;
    merchant.icon = !req.files.imageMerchant.length ? null : "uploads/merchants/" + req.files.imageMerchant[0].filename,

    await merchant.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "update profile merchant success",
      data: merchant.merchant_name,
    });

  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
