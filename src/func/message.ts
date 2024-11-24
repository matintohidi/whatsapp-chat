import fs from 'fs';
import { MessageMedia, Client, Message } from 'whatsapp-web.js';

export const createMedia = async (
  mediaMessage: Message,
  contactId: string
): Promise<void> => {
  const media = await mediaMessage.downloadMedia();

  if (!media) {
    throw new Error("Failed to download media.");
  }

  const extension = media.mimetype.split('/')[1];
  const filename = `./downloads/media_${contactId}.${extension}`;

  const directory = './downloads';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(filename, media.data, { encoding: "base64" });
};

export const sendMedia = async (
  client: Client,
  contactId: string,
  mediaPath: string
): Promise<void> => {
  const media = MessageMedia.fromFilePath(mediaPath);
  await client.sendMessage(contactId, media);
};

export const getMessagesOfContact = async (
  client: Client,
  contactId: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<{
  id: string;
  messages: (string | Message)[];
}> => {
  const chat = await client.getChatById(contactId);

  const requiredMessages = pageNumber * pageSize;
  const allMessages = await chat.fetchMessages({ limit: requiredMessages });
  const paginatedMessages = allMessages.slice(0, pageSize);

  return {
    id: contactId,
    messages: paginatedMessages.map((msg) => {
      if (msg.hasMedia) {
        createMedia(msg, contactId);
        return msg;
      } else {
        return msg.body;
      }
    }),
  };
};
