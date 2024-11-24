import { Client, Message } from "whatsapp-web.js";
import { getMessagesOfContact, sendMedia } from "../func/message";

const setupClientEvents = (client: Client): void => {
    client.on("qr", (qr: string) => {
        console.log("QR Received", qr);
    });

    client.on("ready", async () => {
        console.log("Client is ready!");

        // sendMedia(client, "989028427004@c.us", "./downloads/1.pdf");

        try {
            const chats = await client.getChats();

            const messagesOfContacts = Promise.all(
                chats.map((chat) =>
                    getMessagesOfContact(client, chat.id._serialized, 1)
                )
            );

            messagesOfContacts
                .then((res) => console.log(res))
                .catch((err) => console.error(err));
        } catch (err) {
            console.error(err);
        }
    });

    client.on("message", async (msg: Message) => {
        try {
            const chats = await client.getChats();
            const messagesOfContacts = Promise.all(
                chats.map((chat) =>
                    getMessagesOfContact(client, chat.id._serialized, 1)
                )
            );

            messagesOfContacts
                .then((res) => console.log(res))
                .catch((err) => console.error(err));
        } catch (err) {
            console.error(err);
        }
    });
};

export default setupClientEvents;
