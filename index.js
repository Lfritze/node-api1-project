// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

//Parse JSON from body
server.use(express.json());

// POST REQUEST Create user using the info sent inside the request body
server.post("/api/users", (req, res) => {
  const dbData = req.body;

  if (!dbData.name || !dbData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(dbData)
      .then(thingPost => {
        res.status(201).json({ ...thingPost, ...dbData });
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The users information could not be retrieved." });
      });
  }
});

// GET USERS Returns array of all user objects contained inside db.
server.get("/api/users", (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

// GET Users based on specified ID.

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(thing => {
      if (thing) {
        res.status(200).json(thing);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

// DELETE Removes the user with the specified id and returns deleted user.
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(202).json({ message: "Successfully deleted user" });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// PUT Request updates the user with specified ID, using data from the request body. Reuturns the modified document.
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  db.findById(id).then(users => {
    if (!users) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  });
  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  } else {
    db.update(id, userData)
      .then(change => {
        console.log(change);
        db.findById(id).then(user => {
          res.status(200).json(user);
        });
        // res.status(200).json({ user: `user ${id} was updated` });
      })
      .catch(err => {
        console.log("Error on PUT /users/:id", err);
        res
          .status(500)
          .json({ error: "The user information could not be modified " });
      });
  }
});

//Set up port
const port = 8000;
server.listen(port, () => console.log(`\n API running on port ${port}\n`));
