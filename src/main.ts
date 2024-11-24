import express, { Express } from "express";
import client from "./client";
import setupClientEvents from "./events/clientEvents";

const app: Express = express();
const port: number = 3002;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

setupClientEvents(client);

client.initialize();
