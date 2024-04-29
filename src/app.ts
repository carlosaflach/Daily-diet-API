import fastify from "fastify";
import cookie from '@fastify/cookie'

export const app = fastify();

app.register(cookie);

app.get('/hello', (request, response) => {
   response.status(200).send({ message: 'Hello from the server'})
});
