const { Roles } = require("../../models");
const { v4: uuidv4 } = require("uuid");

exports.addRole = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      id: uuidv4(),
    };
    const data = await Roles.create(body);

    return res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "SERVER ERROR",
      message: error.message,
    });
  }
};
