require("dotenv").config();

const app = require("./app");

const Port = process.env.PORT || 5000;
const server = app.listen(Port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running on Port : ${Port}`);
  }
});

module.exports = server;
