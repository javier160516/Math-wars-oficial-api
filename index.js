import express from 'express';
// const dotenv = require("dotenv");
import dotenv from 'dotenv';
// const express = require("express");
import db from "./config/db.js";
// const { createServer } = require("http");
import { createServer } from 'http';
// const { Server } = require("socket.io");
import {Server} from 'socket.io';
import cors from 'cors';
// const roomHandler = require("./roomHandler");
import roomHandler from './roomHandler.js';
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();
const app = express();
app.use( cors() );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
} catch (error) {
  console.log(error);
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
app.use("/", gameRoutes);

const rooms = [];

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  roomHandler(io, socket, rooms);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
