import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak", "Nummern", "Großschr. & Nummern"],
    'notLeaked':  [ 48281 , 107136 , 222741 , 29376 , 17811 , 14070 + 4491 , 5146, 117860, 60308],
    'leaked':[ 1028 , 1318 , 597 , 269 , 147 , 51 + 5 , 6, 773, 63],
}
df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 4))
plt.xscale('log')

bar_width = 0.35
bar1 = plt.barh(df['Kategorie'], df["leaked"], bar_width,label='kompromittiert', color='#1f77b4')
bar2= plt.barh(df['Kategorie'], df["notLeaked"], bar_width,left=df["leaked"], label='nicht kompromittiert',color="darkorange")


ax.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='x', labelsize=13)
ax.get_xaxis().set_major_formatter(
    matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

plt.xlabel("Anzahl Passwörter", fontsize=16)
plt.legend(fontsize=14)
plt.tight_layout()
plt.savefig("pics/our-pw-origins-as-one.png")
# plt.savefig("pics/tmp.png")
# plt.show()
