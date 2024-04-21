const {Users,Roles,AccessRoles} = require('../../models');
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.auth = async (req,res,next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1]; 
        if (!token) {
            return res.status(401).send({
            status: "FORBIDDEN", 
            message: "Access Denied",
            });
          }
          
          const verified = jwt.verify(token, process.env.SECRET_KEY);
         
          req.userid = verified.id;
          next();
    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            status: "error",
            message: "Invalid token",
       });
    }
}

exports.AuthAdm = async (req, res, next) => {
    try {
        
      const id = req.userid

      const cekstatus = await AccessRoles.findOne({
        where: {
            userId: id,
        },
        include: [
            {
                model: Roles,
                as: 'roles',
                where: {
                    name: 'admin',
                },
            },
        ],
    });

    if (!cekstatus) { 
        return  res.status(403).send({
            status: "Forbidden", 
            message: "Access Denied",
          })
    }

    next();
    } catch (error) {
      res.status(500).send({
        status: "SERVER ERROR",
        message: "Invalid token"
      });
    }
  };

  exports.AuthMerchant = async (req, res, next) => {
    try {
        const id = req.userid
        console.log(id);
        const cekstatus = await AccessRoles.findOne({
            where: {
                userId: id,
            },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    where: {
                        name: 'merchant',
                    },
                },
            ],
        });
        
        if (!cekstatus) { 
            return  res.status(403).send({
                status: "Forbidden", 
                message: "Access Denied",
              })
        }
        
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "SERVER ERROR",
            message: "Invalid token",
        });
    }
};