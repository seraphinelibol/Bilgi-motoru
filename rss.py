import glob, datetime

items = sorted(glob.glob("cikti/*.txt"))[-10:]
rss = ["<?xml version='1.0'?>",
"<rss version='2.0'><channel>",
"<title>Bilgi Akışı</title>"]

for f in items:
    with open(f, encoding="utf-8") as x:
        c = x.read()[:300]
    rss.append(f"<item><title>{f}</title><description>{c}</description></item>")

rss.append("</channel></rss>")

with open("yayin/akim.xml","w",encoding="utf-8") as o:
    o.write("\n".join(rss))
