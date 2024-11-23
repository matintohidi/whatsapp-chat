const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

const createMedia = async (
  mediaMessage,
  contactId
) => {
  const media = await mediaMessage.downloadMedia();

  const extension = media.mimetype.split('/')[1];
  const filename = `./downloads/media_${contactId}.${extension}`;

  fs.writeFileSync(filename, media.data, { encoding: "base64" });
}

const sendMedia = async (
  client,
  contactId,
  mediaPath
) => {
  const media = MessageMedia.fromFilePath(mediaPath);
  await client.sendMessage(contactId , media);
}

const getMessagesOfContact = async (
    client,
    contactId,
    pageNumber = 1,
    pageSize = 10
) => {
    const chat = await client.getChatById(contactId);
    
    const requiredMessages = pageNumber * pageSize;
    const allMessages = await chat.fetchMessages({ limit: requiredMessages });
    const paginatedMessages = allMessages.slice(0 , pageSize);

    return {
        id: contactId,
        messages: paginatedMessages.map(msg => {
          if(msg.hasMedia) {
            createMedia(msg , contactId);
            return msg
          } else {
            return msg.body
          }
        }),
    }
}

module.exports = { getMessagesOfContact , sendMedia };
