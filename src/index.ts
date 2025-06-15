import express, { Application } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT: number | string = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
// get a list of users
app.get("/users", async (req, res) => {
  const result = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      address: true,
    },
  });
  res.json({
    data: result,
    message: "success get all users",
  });
});

// get user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.findUnique({
    // where untuk mencari data berdasrkan id
    where: {
      id: Number(id),
    },
  });
  res.json({
    data: result,
    message: "success get user by id",
  });
});

// create a new user
app.post("/users", async (req, res) => {
  const { name, email, address, password } = req.body;
  const result = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password,
    },
  });
  res.json({
    data: result,
    message: "success create user",
  });
});

// update a user
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, address, password } = req.body;
  const result = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email,
      address,
      password,
    },
  });
  res.json({
    data: result,
    message: "success update user",
  });
});

// delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({
    message: `success delete ${result.name} user`,
  });
});
