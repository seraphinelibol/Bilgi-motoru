#!/data/data/com.termux/files/usr/bin/bash
cd ~/bilgi_motoru
for i in {1..50}; do
  echo "Girdi $i — $(date)" >> girdi/yuk_$i.txt
done
