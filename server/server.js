import express from "express";
import axios from "axios";

const PORT = 3000;
const API_URL = "http://localhost:4000/api";

const app = express();

app.set("views", "./server/views");

app.use("/static", express.static("server/public")); // <----- this path is relative to root as i am running api and server from root

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    ` > client made a "${req.method}" request on "${req.originalUrl}"`
  );
  next();
});

// this path request style.css at localhost:3000/test/static/style.css
app.get("/test/test", (req, res) => {
  // <--------- on this route style.css is not found
  // ERROR => test:14  Refused to apply style from 'http://localhost:3000/test/static/style.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
  res.render("home.ejs", { root: "." });
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/pens`);
    res.render("home.ejs", { pens: response.data.data });
  } catch (error) {
    res.render("home.ejs", { error: error });
  }
});

app.get("/write", (req, res) => {
  res.render("form.ejs");
});

app.post("/search", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

try {
  app.listen(PORT);
  console.log(`\n # server online and listening on http://localhost:${PORT}`);
} catch (error) {
  console.error(`---failed ${error}`);
}
