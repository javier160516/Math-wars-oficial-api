// const shortId = require("shortid");
import shortId from "shortid";
import { Problema, Respuestas, Categorias } from "./models/index.js";

const roomHandler = (io, socket, rooms) => {
  const create = (payload, callback) => {
    if (payload.type === "stranger") {
      const index = rooms.findIndex(
        (room) => room.vacant === true && room.private === false
      );
      if (index >= 0) {
        const room = rooms[index];
        room.players[socket.id] = {
          option: null,
          optionLock: false,
          score: 0,
        };
        room.vacant = false;
        socket.join(room.roomId);
        io.to(room.roomId).emit("room:get", room);
        callback(null, room.roomId);
      } else {
        const room = {
          roomId: shortId.generate(),
          players: {
            [socket.id]: {
              option: null,
              optionLock: false,
              score: 0,
            },
          },
          vacant: true,
          private: false,
          type: payload.type,
        };
        rooms.push(room);
        socket.join(room.roomId);
        io.to(room.roomId).emit("room:get", room);
        callback(null, room.roomId);
      }
    } else {
      const room = {
        roomId: shortId.generate(),
        players: {
          [socket.id]: {
            option: null,
            optionLock: false,
            score: 0,
          },
        },
        vacant: true,
        private: true,
        type: payload.type,
      };
      rooms.push(room);
      socket.join(room.roomId);
      io.to(room.roomId).emit("room:get", room);
      callback(null, room.roomId);
    }
  };

  /**
   * SE MANDA A LLAMAR A LA FUNCION CUANDO LOS 2 JUGADORES YA ESTAN EN LA SALA
   * @param {*} payload
   * @param {*} callback
   * @returns
   */
  const join = async (payload, callback) => {
    const index = rooms.findIndex((room) => room.roomId === payload.roomId);
    if (index >= 0) {
      const room = rooms[index];
      if (room.players[socket.id]) return callback(null);

      if (room.vacant && room.private) {
        room.players[socket.id] = {
          option: null,
          optionLock: false,
          score: 0,
        };

        room.vacant = false;
        rooms.push(room);
        socket.join(room.roomId);

        const problemas = await Problema.findAll({
          include: [
            { model: Respuestas },
            { model: Categorias, where: { playing: 1 } },
          ],
        });
    
        const arrayQuestions = []
        problemas.forEach((question) => {
          let newQuestion = {
            id: question.id,
            planteamiento: question.planteamiento,
            incisos: question.opciones,
            respuestaCorrecta: question.Respuesta.opcion,
            categoria: question.categoria.nombre,
          };
          arrayQuestions.push(newQuestion);
        });

        const random = Math.floor(Math.random() * arrayQuestions.length)

        room.problemas = arrayQuestions[random];
        
        io.to(room.roomId).emit("room:get", room);
        callback(null, room);
      } else {
        callback({ error: true });
      }
    } else {
      callback({ error: true });
    }
  };

  const update = (payload) => {
    const index = rooms.findIndex((room) => room.roomId === payload.roomId);
    if (index >= 0) {
      rooms[index] = payload;
      io.to(payload.roomId).emit("room:get", payload);
    }
  };

  const getProblemas = async () => {
    
    return arrayQuestions;
    // io.to(room.roomId).emit("room:getProblemasClient", { problemas });
  };

  socket.on("room:create", create);
  socket.on("room:join", join);
  socket.on("room:update", update);
  // socket.on("room:getProblemas", getProblemas);
};

export default roomHandler;
