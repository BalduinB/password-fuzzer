import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

data = {
    'Kategorie':  ['Original', 'TDT-Methode', 'Guesser-Methode'],
    'notLeaked':  [5621, 1164459, 1203796],
    'leaked'   :  [24379, 2206,2808],
}
df = pd.DataFrame(data)

pd.options.display.float_format = '{:.2f}'.format
fig, (ax, ax2) = plt.subplots(2,1, figsize=(12, 6))
ax.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='x', labelsize=13)
ax2.tick_params(axis='y', labelsize=14)
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
plt.savefig("pics/overview.png")
# plt.show()
