#!/data/data/com.termux/files/usr/bin/bash
cd ~/bilgi_motoru

# kritik dosyalar
for f in motor.py calistir.sh; do
  if [ ! -f "$f" ]; then
    git checkout -- .
    break
  fi
done
