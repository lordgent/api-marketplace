const {
  Products,
  Categories,
  Merchants,
  ImageProducts,
  OrderItems
} = require("../../models");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const { Op } = require("sequelize");

exports.addProduct = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    description: Joi.string().min(4).required(),
    price: Joi.alternatives().try(
      Joi.string().regex(/^\d+$/).min(5).required(),
      Joi.number().min(5).required()
    ),
    stock: Joi.number().required(),
    weight: Joi.number().required(),
    categoryId: Joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { name, description, price, stock, weight, categoryId } = req.body;

    const findProduct = await Products.findOne({
      where: {
        name: name,
      },
    });

    if (findProduct !== null) {
      return res.status(400).send({
        status: "BAD REQUEST",
        message: "product already exist",
      });
    }

    const find = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });

    const body = {
      id: uuidv4(),
      name: name,
      description: description,
      price: price,
      stock: stock,
      weight: weight,
      merchantId: find.id,
      categoryId: categoryId,
      userId: req.userid,
      isDelete: 0,
    };

    const data = await Products.create(body);

    if (req.files.imageProduct && req.files.imageProduct.length > 0) {
      req.files.imageProduct.reverse();
    
      for (let i = 0; i < req.files.imageProduct.length; i++) {
        let image = req.files.imageProduct[i].filename;
        let bodyImage = {
          id: uuidv4(),
          productId: data.id,
          indexValue: i,
          userId: req.userid,
          image: "uploads/products/" + image,
        };
        await ImageProducts.create(bodyImage);
      }
    }
    return res.status(200).send({
      status: "SUCCESS",
      message: "create product success",
      data: data.name,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.getAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const type = parseInt(req.query.type);

        let products;
        let totalData;

        if (type === 0) {
            const findOrder = await OrderItems.findAll({
                attributes: ['productId'],
                raw: true,
                group: ['productId']
            });

            const distinctProductIds = findOrder.map(order => order.productId);

            products = await Products.findAll({
                where: {
                    id: {
                        [Op.in]: distinctProductIds
                    },
                    isDelete: 0,
                    ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                    ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
                },
                order: [["name", "ASC"]],
                limit: limit,
                offset: page * limit,
                include: [
                    {
                        model: Categories,
                        as: "category",
                        attributes: ["name", "icon"],
                    },
                    {
                        model: Merchants,
                        as: "merchant",
                        attributes: ["merchant_name", "id", "userId"],
                    }
                ],
            });

            totalData = products.length;
        } else if(type === 1){
          products = await Products.findAll({
            where: {
                isDelete: 0,
                ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
            },
            order: [["name", "ASC"], ["createdAt", "DESC"]],
            limit: limit,
            offset: page * limit,
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ["name", "icon"],
                },
                {
                    model: Merchants,
                    as: "merchant",
                    attributes: ["merchant_name", "id", "userId"],
                }
            ],
        });

        totalData = await Products.count({
            where: {
                isDelete: 0,
                ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
            }
        });
        } 
         else {
            products = await Products.findAll({
                where: {
                    isDelete: 0,
                    ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                    ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
                },
                order: [["name", "ASC"]],
                limit: limit,
                offset: page * limit,
                include: [
                    {
                        model: Categories,
                        as: "category",
                        attributes: ["name", "icon"],
                    },
                    {
                        model: Merchants,
                        as: "merchant",
                        attributes: ["merchant_name", "id", "userId"],
                    }
                ],
            });

            totalData = await Products.count({
                where: {
                    isDelete: 0,
                    ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                    ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
                }
            });
        }

        const datas = await Promise.all(products.map(async (element) => {
          const image = await ImageProducts.findOne({
              where: {
                  productId: element.id,
              },
          });
      
          return {
              id: element.id,
              name: element.name,
              price: element.price,
              stock: element.stock,
              photo: image ? image.image : "", 
              description: element.description,
              weight: element.weight,
              isDelete: element.isDelete,
              merchant: element.merchant,
              category: element.category,
              createdAt: element.createdAt,
              updatedAt: element.updatedAt,
          };
      }));
        return res.status(200).send({
            status: "SUCCESS",
            message: "List products",
            data: {
                products: datas,
                page: {
                    offset: page,
                    limit: limit,
                    totalData: totalData,
                },
            },
        });
    } catch (error) {
        return res.status(500).send({
            status: "INTERNAL SERVER ERROR",
            message: error.message,
        });
    }
};


exports.getAllProductMerchant = async (req, res) => {
  try {
      const page = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const type = parseInt(req.query.type);

      let products;
      let totalData;

      const merchant = await Merchants.findOne({
        where:{
          userId: req.userid
        }
      })

      if (type === 0) {
          const findOrder = await OrderItems.findAll({
              attributes: ['productId'],
              raw: true,
              group: ['productId']
          });

          const distinctProductIds = findOrder.map(order => order.productId);

          products = await Products.findAll({
              where: {
                  merchantId: merchant.id,
                  id: {
                      [Op.in]: distinctProductIds
                  },
                  isDelete: 0,
                  ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                  ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
              },
              order: [["name", "ASC"]],
              limit: limit,
              offset: page * limit,
              include: [
                  {
                      model: Categories,
                      as: "category",
                      attributes: ["name", "icon"],
                  },
                  {
                      model: Merchants,
                      as: "merchant",
                      attributes: ["merchant_name", "id", "userId"],
                  }
              ],
          });

          totalData = products.length;
      } else if(type === 1){
        products = await Products.findAll({
          where: {
            merchantId: merchant.id,
              isDelete: 0,
              ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
              ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
          },
          order: [["name", "ASC"], ["createdAt", "DESC"]],
          limit: limit,
          offset: page * limit,
          include: [
              {
                  model: Categories,
                  as: "category",
                  attributes: ["name", "icon"],
              },
              {
                  model: Merchants,
                  as: "merchant",
                  attributes: ["merchant_name", "id", "userId","phone_number", "address"],
              }
          ],
      });

      totalData = await Products.count({
          where: {
              isDelete: 0,
              ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
              ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
          }
      });
      } 
       else {
          products = await Products.findAll({
              where: {
                merchantId: merchant.id,
                  isDelete: 0,
                  ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                  ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
              },
              order: [["name", "ASC"]],
              limit: limit,
              offset: page * limit,
              include: [
                  {
                      model: Categories,
                      as: "category",
                      attributes: ["name", "icon"],
                  },
                  {
                      model: Merchants,
                      as: "merchant",
                      attributes: ["merchant_name", "id", "userId"],
                  }
              ],
          });

          totalData = await Products.count({
              where: {
                  isDelete: 0,
                  ...(req.query.name ? { name: { [Op.like]: `%${req.query.name}%` } } : {}),
                  ...(req.query.categoryId ? { categoryId: { [Op.like]: `%${req.query.categoryId}%` } } : {}),
              }
          });
      }

      const datas = await Promise.all(products.map(async (element) => {
        const image = await ImageProducts.findOne({
            where: {
                productId: element.id,
            },
        });
    
        return {
            id: element.id,
            name: element.name,
            price: element.price,
            stock: element.stock,
            photo: image ? image.image : "", 
            description: element.description,
            weight: element.weight,
            isDelete: element.isDelete,
            merchant: element.merchant,
            category: element.category,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
        };
    }));
      return res.status(200).send({
          status: "SUCCESS",
          message: "List products",
          data: {
              products: datas,
              page: {
                  offset: page,
                  limit: limit,
                  totalData: totalData,
              },
          },
      });
  } catch (error) {
      return res.status(500).send({
          status: "INTERNAL SERVER ERROR",
          message: error.message,
      });
  }
};


exports.getDetailProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        isDelete: 0,
        id: req.params.id,
      },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["name", "icon","id"],
        },
        {
          model: Merchants,
          as: "merchant",
          attributes: ["merchant_name", "id", "userId"],
        },
      ],
    });

    const images = await ImageProducts.findAll({
      where: {
        productId: product.id,
      },
      order: [["indexValue", "ASC"]],
    });

    const obj = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      weight: product.weight,
      isDelete: product.isDelete,
      merchant: product.merchant,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images: images,
    };

    return res.status(200).send({
      status: "SUCCESS",
      message: "detail product",
      data: obj,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        isDelete: 0,
        id: req.params.id,
      },
    });

    if (product === null) {
      return res.status(404).send({
        status: "BAD REQUEST",
        message: "product not found",
      });
    }

    product.isDelete = 1;

    await product.save();

    return res.status(200).send({
      status: "SUCCESS",
      message: "delete product success",
      data: product.name,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const imageProduct = await ImageProducts.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (imageProduct === null) {
      return res.status(404).send({
        status: "BAD REQUEST",
        message: "product image not found",
      });
    }

    await ImageProducts.destroy({
      where: {
        id: imageProduct.id,
      },
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "delete product image success",
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const schema = Joi.object({
    id:Joi.string().min(4).required(),
    name: Joi.string().min(4).required(),
    description: Joi.string().min(4).required(),
    price: Joi.alternatives().try(
      Joi.string().regex(/^\d+$/).min(5).required(),
      Joi.number().min(5).required()
    ),
    stock: Joi.number().required(),
    weight: Joi.number().required(),
    categoryId: Joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "BAD REQUEST",
      message: error.details[0].message,
    });
  }

  try {
    const { name, description, price, stock, weight, categoryId } = req.body;

    const findProduct = await Products.findOne({
      where: {
        id: req.body.id
      },
    });

    if (findProduct === null) {
      return res.status(404).send({
        status: "BAD REQUEST",
        message: "product not found",
      });
    }

    const find = await Merchants.findOne({
      where: {
        userId: req.userid,
      },
    });

    findProduct.name = name;
    findProduct.description = description;
    findProduct.price = price;
    findProduct.stock = stock;
    findProduct.weight = weight;
    findProduct.merchantId = find.id;
    findProduct.categoryId = categoryId;
    findProduct.userId = req.userid;
    findProduct.isDelete = 0;

    await findProduct.save();

    if (req.files.imageProduct && req.files.imageProduct.length > 0){

      req.files.imageProduct.reverse();

      for (let i = 0; i < req.files.imageProduct.length; i++) {
        let image = req.files.imageProduct[i].filename;
        let bodyImage = {
          id: uuidv4(),
          productId: findProduct.id,
          indexValue: i,
          userId: req.userid,
          image: "uploads/products/" + image,
        };
        await ImageProducts.create(bodyImage);
      }
    }

   

    return res.status(200).send({
      status: "SUCCESS",
      message: "update product success",
      data: findProduct.name,
    });
  } catch (error) {
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
};


exports.getProductImage = async (req,res) => {
  try{

    const images = await ImageProducts.findAll({
      where: {
        productId: req.params.id,
      },
    });

    return res.status(200).send({
      status: "SUCCESS",
      message: "list image product success",
      data: images,
    });
  }catch(error){
    return res.status(500).send({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
    });
  }
}