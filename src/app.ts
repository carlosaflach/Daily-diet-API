import fastify from "fastify";

export const app = fastify();

app.get('/hello', (request, response) => {
   response.status(200).send({ message: 'Hello from the server'})
});
