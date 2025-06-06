const fs = require("fs");
const { Bixby, isPrivate } = require("../lib");
const { gemini } = require("../lib/functions");
const { GEMINI_API } = require("../config"); 

Bixby(
  {
    pattern: "gemini",
    fromMe: isPrivate,
    desc: "Generate text with gemini",
  },
  async (message, match, m) => {
    if(GEMINI_API === false) return console.log("Please add GEMINI_API in config.js or Config Variables")
    match = match || message.reply_message.text;
    const id = message.participant;
    if (!match) return await message.reply("Provide a prompt");
    if (message.reply_message && message.reply_message.video)
      return await message.reply("I can't generate text from video");
    if (
      message.reply_message &&
      (message.reply_message.image || message.reply_message.sticker)
    ) {
      const image = await m.quoted.download();

      fs.writeFileSync("image.jpg", image);
      const text = await gemini(match, image, false, {
        id,
      });
      return await message.reply(text);
    }
    match = message.reply_message
      ? message.reply_message.text + `\n\n${match || ""}`
      : match;
    const text = await gemini(match, null, false, { id });
    return await message.reply(text);
  }
);