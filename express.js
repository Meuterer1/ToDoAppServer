const express = require("express");
const bodyParser = require("body-parser");
const AddToDataBase = require("./addToDataBase");
const cors = require("cors");
const getTasks = require("./getTasks");
const deleteTask = require("./deleteTask");
const updateTask = require("./updateTask");
const { ObjectId } = require("mongodb");
const path = require("path");

const port = process.env.PORT || 3001;

// const corsOptions = {
//   origin: "https://verdant-daifuku-5168ae.netlify.app/",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

const api = express();
api.use(cors());
//api.use(cors(corsOptions));
api.use(bodyParser.json());

//api.use(express.static(path.join(__dirname, "../client/build")));

api.all("/addtask", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");

  const taskData = res.data;
  console.log("res.data: ", res.data, "req.body: ", req.body);

  AddToDataBase(taskData)
    .then(() => {
      res.status(200).json(`Zadanie dodane do bazy danych: ${taskData.task}`);
      next();
    })
    .catch((err) => {
      res.status(500).json(`Bład dodawania do bazy danych: ${err}`);
      next();
    });
});

api.get("/", async (req, res) => {
  console.log("get /");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  try {
    console.log("try /");
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania zadań: " + error.message });
  }
});

api.post("/delete", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  const deletedItems = req.body;

  deleteTask(deletedItems)
    .then(res.status(200).json({ success: true }))
    .catch((err) => {
      res.status(500).json({ err: "Bład usuwania z bazy: " + err });
    });
});

api.post("/edit", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  const taskBody = req.body;
  const validTaskBody = taskBody.filter((item) => {
    return ObjectId.isValid(item._id);
  });

  console.log("validTaskBody: ", validTaskBody);
  Promise.all(updateTask(validTaskBody))
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Dane zaktualizowane pomyślnie." });
    })
    .catch((err) => {
      res.status(500).json({ err: "Bład edycji zadania " + err });
    });
});

api.all("/all", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  res.status(200).json({ success: true });
});

api.listen(port, () => {
  console.log(`Server działa na porcie ${port}`);
});

//api.use(express.static(path.join(__dirname, "../client/build")));

// api.use("/.netlify/api_node/express", router);
// module.exports.handler = serverless(api);
