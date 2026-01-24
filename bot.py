from telegram import Bot
import pathlib

TOKEN = "8587918469:AAG8eAN1UKQ48EZOpQ5ja-tXgG4JEiM4uYY"
CHAT_ID = "8045944797"

bot = Bot(TOKEN)
dosya = sorted(pathlib.Path("yayin").glob("*.txt"))[-1]
bot.send_message(chat_id=CHAT_ID, text=dosya.read_text()[:4000])
