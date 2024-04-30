import express from "express";

const PORT = 4000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    ` > client made a "${req.method}" request on "${req.originalUrl}"`
  );
  next();
});

app.get("/api/pens", (req, res) => {
  res.json({
    total: pens.length,
    data: pens,
  });
});

app.get("/api/pens/:id", (req, res) => {
  const foundPen = pens.find((pen) => pen.id === parseInt(req.params.id));

  if (foundPen) {
    res.json({ data: [foundPen] });
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/pens", (req, res) => {
  if (req.body.title && req.body.content) {
    const d = new Date();
    const newPen = {
      id: pens.slice(-1)[0].id + 1,
      title: req.body.title,
      content: req.body.content,
      author: req.body.user || "anonymous",
      date: d.toLocaleString(),
      category: req.body.category || "uncategorised",
    };

    pens.push(newPen);
    res.status(201).json(newPen);
  } else {
    res.status(400), json({ error: "Missing Parameters" });
  }
});

app.patch("/api/pens/:id", (req, res) => {
  const penIdx = pens.findIndex((pen) => pen.id == req.params.id);

  if (penIdx !== -1) {
    if (Object.keys(req.body).length !== 0) {
      const d = new Date();
      const updatedPen = {
        id: pens[penIdx].id,
        title: req.body.title || pens[penIdx].title,
        content: req.body.content || pens[penIdx].content,
        author: req.body.author || pens[penIdx].author,
        date: d.toLocaleString(),
        category: req.body.category || pens[penIdx].category,
      };
      pens[penIdx] = updatedPen;
      res.status(200).json(updatedPen);
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } else {
    res.status(404).json({ error: "no record found. no changes were made" });
  }
});

app.delete("/api/pens/:id", (req, res) => {
  const penIdx = pens.findIndex((pen) => pen.id == req.params.id);

  if (penIdx !== -1) {
    pens.splice(penIdx, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: "no record found. no changes were made" });
  }
});

try {
  app.listen(PORT);
  console.log(` \n # server online and listening on http://localhost:${PORT}`);
} catch (error) {
  console.error(`---failed to setup server ${error}`);
}

var pens = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "8/1/2023, 3:30:00 PM",
    category: "Tech",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
    category: "Tech",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
    category: "Climate",
  },
];
var users = [];
