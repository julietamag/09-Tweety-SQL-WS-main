const express = require("express");
const usersRouter = express.Router();
const client = require('../db/index');


//Escribí acá la ruta para obtener los tweets de un usuario en particular
usersRouter.get("/:user", (req, res, next) => {
    const userReq = req.params.user;
    client.query("SELECT *, tweets.id as tid FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE users.name = $1", [userReq],(err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweets = result.rows;
      res.status(200).send(tweets);
    });
  });


module.exports = usersRouter;

