const express = require("express");
const { Client, LocalAuth, MessageAck } = require("whatsapp-web.js");

const app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
});

const allSessionObject = {};

const client = new Client({
    puppeteer: {
        headless: false,
    },
    authStrategy: new LocalAuth({
        clientId: "YOUR_CLIENT_ID",
    }),
});

client.on("qr", (qr) => {
    console.log("QR Received", qr);
});

const getMessagesOfContact = async (contactId) => {
  const chat = await client.getChatById(contactId);

  const messages = (await chat.fetchMessages({ limit: 20 })).map(message => message.body);

  return {
    id: contactId,
    messages
  }
}

client.on("ready", async () => {
    console.log("Client is ready!");
    
    try {
      const messagesOfContacts = (await client.getChats()).map(chat => getMessagesOfContact(chat.id._serialized))

      Promise.all(messagesOfContacts)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    } catch (err) {
      next(err);
    }
});

client.on("message", (msg) => {
    if (msg.body == "!ping") {
        msg.reply("pong");
    }
});

client.initialize();
