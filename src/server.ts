import express from "express";
import { routes } from "./routes";
import { appErrors } from "./errors/appErrors";
import { sqliteConnection } from "./databases";
import { runMigrations } from "./databases/migrations";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(routes);

app.use(appErrors);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

sqliteConnection()
  .then(() => {
    console.log("Database is connected!");
  })
  .catch((error) => {
    console.log("Database ERROR - ", error);
  });

runMigrations();
