import { initServer } from "./app";

async function init() {
  const PORT = process.env.PORT || 8000;
  const app = await initServer();
  app.listen(PORT, () => {
    console.log("server started successfully");
  });
}

init();
