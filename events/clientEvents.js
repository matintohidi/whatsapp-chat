const { getMessagesOfContact , sendMedia } = require("../func/message");

const setupClientEvents = (client) => {
  client.on("qr", (qr) => {
    console.log("QR Received", qr);
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
    // send media
    // sendMedia(client , "989028427004@c.us" , "./downloads/1.pdf")
    try {
      const chats = await client.getChats();
      
      const messagesOfContacts = Promise.all(
        chats.map((chat) => getMessagesOfContact(client, chat.id._serialized , 1))
      );

      messagesOfContacts
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  });

  client.on("message", async (msg) => {
    try {
      const chats = await client.getChats();
      const messagesOfContacts = Promise.all(
        chats.map((chat) => getMessagesOfContact(client, chat.id._serialized , 1))
      );

      messagesOfContacts
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = setupClientEvents;