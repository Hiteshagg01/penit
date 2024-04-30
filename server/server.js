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
app.post("/write", async (req, res) => {
  try {
    await axios.post(`${API_URL}/pens`, req.body);
  } catch (error) {
    console.error(`Failed ${error}`);
  }
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/pens/${req.params.id}`);
    res.render("form.ejs", { pen: response.data.data[0] });
  } catch (error) {
    res.render("home.ejs", { error: error });
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/pens/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (error) {
    res.render("home.ejs", { error: error });
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/pens/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.render("home.ejs", { error: error });
  }
});

app.post("/search", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/pens/${req.body.search}`);
    res.render("home.ejs", { pens: response.data.data });
  } catch (error) {
    res.render("home.ejs", { error: error });
  }
});

try {
  app.listen(PORT);
  console.log(`\n # server online and listening on http://localhost:${PORT}`);
} catch (error) {
  console.error(`---failed ${error}`);
}
