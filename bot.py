import requests

TOKEN = "8587918469:AAG8eAN1UKQ48EZOpQ5ja-tXgG4JEiM4uYY"
CHAT_ID = "8045944797"
mesaj = "Test mesajı"

url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
payload = {"chat_id": CHAT_ID, "text": mesaj}
r = requests.post(url, data=payload)
print(r.json())