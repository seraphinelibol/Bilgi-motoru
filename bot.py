from telegram import Bot
import pathlib

TOKEN = "BOT_TOKEN"
CHAT_ID = "KANAL_ID"

bot = Bot(TOKEN)
dosya = sorted(pathlib.Path("yayin").glob("*.txt"))[-1]
bot.send_message(chat_id=CHAT_ID, text=dosya.read_text()[:4000])
