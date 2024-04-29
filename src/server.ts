import { app } from "./app";
import { env } from "./env";


const PORT = env.PORT

app.listen({
  port: PORT,
}).then(() => console.log(`HTTP Server Running on port ${PORT}`))