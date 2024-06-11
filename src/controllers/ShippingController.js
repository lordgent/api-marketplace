require("dotenv").config();
const axios = require("axios");

const KEY_RAJAONGKIR = "9e45d45bcafdd9253be76bd1e1282958"

exports.getCity = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        headers: {
          key: KEY_RAJAONGKIR,
        },
      }
    );

    const data = response.data.rajaongkir.results;

    return res.status(200).send({
      status: "SUCCESS",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.cekCost = async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: req.body.origin,
        destination: req.body.destination,
        weight: req.body.weight,
        courier: req.body.courier,
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          key: KEY_RAJAONGKIR,
        },
      }
    );
    const data = response.data;

    return res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};
