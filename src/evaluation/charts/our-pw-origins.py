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

fig, (ax, ax2) = plt.subplots(2,1, figsize=(10, 6))
ax.tick_params(axis='y', labelsize=14)
ax2.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='x', labelsize=13)
ax2.tick_params(axis='x', labelsize=13)

bar_width = 0.35
index = np.arange(len(df['Kategorie']))

bars1 = ax.barh(df["Kategorie"], df['leaked'], bar_width, label='kompromittiert', color='#1f77b4')
ax.set_xlabel("kompromittierte Passwörter",color='#1f77b4', fontsize=16)

bars2 = ax2.barh(df["Kategorie"], df['notLeaked'], bar_width, label='nicht kompromittiert', color='darkorange')
ax2.set_xlabel("nicht kompromittierte Passwörter",color='darkorange', fontsize=16)
ax2.get_xaxis().set_major_formatter(
    matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

plt.tight_layout()
plt.savefig("pics/our-pw-origins.png")
# plt.show()
