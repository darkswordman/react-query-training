const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let posts = [
  {
    id: 1,
    title: "first",
    body: "Lorem ipsum",
  },
  {
    id: 2,
    title: "second",
    body: "Lorem ipsum",
  },
  {
    id: 3,
    title: "third",
    body: "Lorem ipsum",
  },
];

let currentId = 3;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/** This request is paginated with pageSize and pageOffset */
app.get("/posts", (req, res) => {
  const { pageSize, pageOffset } = req.query;

  // Lets assume that these 2 are numbers
  const valPageSize = Number(pageSize);
  const valPageOffset = Number(pageOffset);

  if (pageSize === undefined || pageOffset === undefined) {
    return res.send(posts);
  }

  const totalPages = Math.ceil(posts.length / valPageSize);

  const data = posts.slice(
    valPageSize * valPageOffset,
    (valPageOffset + 1) * valPageSize
  );

  res.send({
    items: data,
    nextPageOffset: totalPages - 1 > valPageOffset ? valPageOffset + 1 : null,
    pages: totalPages,
  });
});

app.get("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const post = posts.find((item) => item.id == postId);

  if (!post) {
    return res.status(404).send("Not found");
  }

  res.send(post);
});

app.post("/posts", (req, res) => {
  const { title, body } = req.body || {};

  if (!title || !body) {
    return res.status(400).send("Bad body");
  }

  if (title.toLowerCase().includes("bad word")) {
    return res.status(400).send("BAD WORD!!!!");
  }

  currentId++;

  const newPost = {
    id: currentId,
    title,
    body,
  };

  posts.push(newPost);

  res.send(newPost);
});

app.patch("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { title, body } = req.body || {};

  if (!title || !body) {
    return res.status(400).send("Bad body");
  }

  if (title.toLowerCase().includes("bad word")) {
    return res.status(400).send("BAD WORD!!!!");
  }

  const post = posts.find((item) => item.id == postId);

  if (!post) {
    return res.status(404).send("Not found");
  }

  post.title = title;
  post.body = body;

  res.send(post);
});

app.get("/posts/gen/:qty", (req, res) => {
  const { qty } = req.params;

  const valQty = Number(qty);

  if (typeof valQty !== "number" || valQty < 1) {
    return res.status(400).send("Needs to send a positive integer");
  }

  posts = Array.from({ length: valQty }, (v, k) => {
    return {
      id: k,
      title: `Post ${k}`,
      body: "Lorem ipsum",
    };
  });

  res.send(`Generated ${valQty} successfully`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
