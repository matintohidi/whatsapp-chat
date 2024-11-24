import { Client, LocalAuth } from "whatsapp-web.js";

const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
  }),
});

export default client;