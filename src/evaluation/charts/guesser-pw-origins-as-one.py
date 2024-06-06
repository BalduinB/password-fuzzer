import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

data = {
    'Kategorie':  [ "Löschen" , "Großschreibung" , "Einfügen" , "Umkehren" , "Tastatur-Sequenzen" , "Sortierung" , "Leetspeak"  ],
    'notLeaked':  [ 92237 , 62942 , 836652 , 29367 , 11930 , 16584 + 16313 , 137771],
    'leaked'   :  [ 1005 , 784 , 581 , 266 , 86 , 49 + 15 , 22 ],
}

df = pd.DataFrame(data)

fig, ax = plt.subplots(figsize=(10, 4))
plt.xscale('log')

bar_width = 0.35
bar1 = plt.barh(df['Kategorie'], df["leaked"], bar_width,label='kompromittiert', color='#1f77b4')
bar2= plt.barh(df['Kategorie'], df["notLeaked"], bar_width,left=df["leaked"], label='nicht kompromittiert',color="darkorange")

ax.tick_params(axis='x', labelsize=13)
ax.tick_params(axis='y', labelsize=14)
ax.get_xaxis().set_major_formatter(
    matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

plt.xlabel("Anzahl Passwörter", fontsize=16)
plt.legend(fontsize=14)
plt.tight_layout()

# plt.savefig("pics/guesser-pw-origins-as-one.png")
plt.savefig("pics/tmp.png")
# plt.show()

# fig, (ax, ax2) = plt.subplots(2,1, figsize=(10, 6))

# bar_width = 0.35
# index = np.arange(len(df['Kategorie']))
# ax.tick_params(axis='y', labelsize=14)
# ax2.tick_params(axis='y', labelsize=14)
# ax.tick_params(axis='x', labelsize=13)
# ax2.tick_params(axis='x', labelsize=13)

# bars1 = ax.barh(df["Kategorie"], df['leaked'], bar_width, label='kompromittiert', color='#1f77b4')
# ax.set_xlabel("kompromittierte Passwörter",color='#1f77b4', fontsize=16)

# bars2 = ax2.barh(df["Kategorie"], df['notLeaked'], bar_width, label='nicht kompromittiert', color='darkorange')
# ax2.set_xlabel("nicht kompromittierte Passwörter",color='darkorange', fontsize=16)
# ax2.get_xaxis().set_major_formatter(
#     matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

# plt.tight_layout()
# plt.savefig("pics/guesser-pw-origins.png")
# # plt.show()
