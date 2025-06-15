import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

dotenv.config();
const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT: number | string = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
// membuat endpoint baru untuk register
app.use("/register", async (req, res) => {
  const { name, email, address, password } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: hasedPassword,
    },
  });
  res.json({
    data: result,
    message: "success register",
  });
});

// membuat logic login menggunakan password yang sudah di hash
app.use("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.status(404).json({
      message: "user not found",
    });
  }
  if (!user?.password) {
    res.status(404).json({
      message: "password not set",
    });
  }
  if (user && typeof user.password === "string") {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).json({
        data: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          address: user?.address,
        },
      });
    } else {
      res.status(404).json({
        message: "password not valid",
      });
    }
  }
});

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
