const { Users, Roles,AccessRoles } = require("../../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.signIn = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { email, password } = req.body;

    const data = await Users.findOne({
      where: {
        email: email,
      },
    });

    const validd = await bcrypt.compare(password, data.password);
    const SECRET_KEY = "akasdefiweof23ferwg4gwef23fwegfwgw34"

    if (!validd) {
      return res.status(400).send({
        status: "Failed",
        message: "username/password incorrect",
      });
    }
    const token = jwt.sign({ id: data.id }, SECRET_KEY);
    const access = await AccessRoles.findOne({
        where: {
          userId: data.id
        },
        include: [
          {
          model: Roles,
          as: 'roles',
          }
        ]
      })

    return res.status(200).send({
      status: "SUCCESS",
      message: 'login successfully',
      data: {
        email: data.email,
        token: token,
        role: access.roles.name
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  const Schema = Joi.object({
    fullname: Joi.string().min(4).required(),
    email: Joi.string().min(4).required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = Schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { fullname, email, password } = req.body;

    const cekmail = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (cekmail) {
      return res.status(400).send({
        status: "Bad Requests",
        message: "email/fullname is already",
      });
    }

    const findRole = await Roles.findOne({
      where: {
        name: "user",
      },
    });

    if (!findRole) {
      return res.status(404).send({
        status: "error",
        message: "role not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const data = await Users.create({
      id: uuidv4(),
      fullname: fullname,
      email: email,
      password: hashed,
      roleId: findRole.id,
    });

    await AccessRoles.create({
      id: uuidv4(),
      userId: data.id,
      roleId: findRole.id
    })

    return res.send({
      status: "SUCCESS",
      message: "register success",
      data:{
        user: data.email,
        role: findRole.name
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
