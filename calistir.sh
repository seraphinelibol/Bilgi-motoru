#!/data/data/com.termux/files/usr/bin/bash
cd ~/bilgi_motoru
python motor.py >> log/motor.log 2>&1
git add .
git commit -m "otomatik guncelleme $(date)" >/dev/null 2>&1
python bot.py
