const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES //

//create an note
app.post("/todo", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Description cannt be empty." });
    }

    const newNote = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get all note
app.get("/todo", async (req, res) => {
  try {
    const allNotes = await pool.query("SELECT * FROM todo ");
    res.json(allNotes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get an note
app.get("/todo/:id", async (req, res) => {
  try {
    //
    const { id } = req.params;
    const notes = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(notes.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update an note
app.put("/todo/:id", async (req, res) => {
  try {
    //
    const { id } = req.params;
    const { description } = req.body;

    const updateNote = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    console.log("Note was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete an note
app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNote = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    res.json(deleteNote.rows[0]);
    console.log("Note was deleted.");
  } catch (err) {
    console.log(err.message);
  }
});

//CRUD Operations for User

//create a user
app.post("/users", async (req, res) => {
  try {
    const { username, email, full_name, password_hash } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (username, email, full_name, password_hash) VALUES ($1,$2,$3,$4) RETURNING *",
      [username, email, full_name, password_hash]
    );

    res.json(newUser.rows[0]);

  } catch (err) {

    console.error(err.message);

  }
});
//retrieve a user

//retrieve all users
app.get("/users", async (req, res) => {
  try {

    const allUsers = await pool.query(
      "SELECT * FROM users;"
    );

    res.json(allUsers.rows);

  } catch (err) {

    console.error(err.message);

  }
});

//update a user
//delete a user

//create an account
app.post("/accounts", async (req, res) => {
  try {
    const { type, user_id, group_id, name } = req.body;

    const newAccount = await pool.query(
      "INSERT INTO accounts (type, current_balance, user_id, group_id, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *",
      [type, current_balance, user_id, group_id]
    );

    res.json(newAccount.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all accounts
app.get("/accounts", async (req, res) => {
  try {
    const allAccounts = await pool.query("SELECT * FROM accounts");

    res.json(allAccounts.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//get an account
app.get("/accounts/:id", async (req, res) => {
  try {
    //
    const { id } = req.params;
    const account = await pool.query("SELECT * FROM accounts WHERE id = $1", [
      id,
    ]);
    res.json(account.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update an account
app.put("/accounts/:id", async (req, res) => {
  try {
    //
    const { id } = req.params;
    const { type, current_balance, user_id, group_id } = req.body;

    const updateAccount = await pool.query(
      "UPDATE accounts SET type = $1, current_balance = $2 WHERE id = $3",
      [type, current_balance, id]
    );
    res.json("Account was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete an account
app.delete("/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNode = await pool.query(
      "DELETE FROM accounts WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(deleteNode.rows[0]);
    console.log("Account was deleted.");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
