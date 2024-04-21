const { Users, Roles, AccessRoles } = require("../../models");

exports.updateProfile = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.userid } });
    const { address, postalCode, city } = req.body;

    user.address = address;
    user.city = city;
    user.postalCode = postalCode;

    const save = await user.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "update profile success",
      data: save.email,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
