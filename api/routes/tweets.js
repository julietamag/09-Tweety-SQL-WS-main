const express = require("express");
const client = require("../db/index");
const tweetsRouter = express.Router();

//Escribí acá la ruta para obtener todos los tweets
tweetsRouter.get("/", (req, res, next) => {
  client.query(
    "SELECT *, tweets.id as tid FROM tweets INNER JOIN users ON users.id = tweets.user_id",
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweets = result.rows;
      res.status(200).send(tweets);
    }
  );
});

//Escribí acá la ruta para obtener un tweet en particular
tweetsRouter.get("/:id", (req, res, next) => {
  const idReq = req.params.id;
  client.query(
    "SELECT *, tweets.id as tid FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = $1",
    [idReq],
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweets = result.rows[0];
      res.status(200).send(tweets);
    }
  );
});

//Escribí acá la ruta para eliminar un tweet
tweetsRouter.delete("/:id", (req, res, next) => {
  const idReq = req.params.id;
  let tweet;
  client.query(
    "SELECT *, tweets.id as tid FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = $1",
    [idReq],
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      tweet = result.rows[0];
    }
  );
  client.query(
    "DELETE FROM tweets WHERE tweets.id = $1",
    [idReq],
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      res.status(202).send(tweet);
    }
  );
});

//Escribí acá la ruta para crear un tweet
tweetsRouter.post("/", (req, res, next) => {
  const { name, content, img } = req.body;
  client.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING id",
    [name],
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const userId = result.rows[0].id;
      client.query(
        "INSERT INTO tweets (user_id, content, imgurl) VALUES ($1, $2, $3) RETURNING id",
        [userId, content, img],
        (err, result) => {
          if (err) return next(err); // pasa el error a Express
          const tweetId = result.rows[0].id;
          client.query(
            "SELECT *, tweets.id as tid FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = $1",
            [tweetId],
            (err, result) => {
              if (err) return next(err); // pasa el error a Express
              res.status(201).send(result.rows[0]);
            }
          );
        }
      );
    }
  );
});

module.exports = tweetsRouter;
