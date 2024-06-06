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

fig, ax = plt.subplots(figsize=(10, 4))
plt.xscale('log')

bar_width = 0.35
bar1 = plt.barh(df['Kategorie'], df["leaked"], bar_width,label='kompromittiert', color='#1f77b4')
bar2= plt.barh(df['Kategorie'], df["notLeaked"], bar_width,left=df["leaked"], label='nicht kompromittiert',color="darkorange")

ax.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='x', labelsize=13)
ax.get_xaxis().set_major_formatter(
    matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))


plt.legend(fontsize=14)
plt.xlabel("Anzahl Passwörter", fontsize=16)
plt.tight_layout()

# plt.savefig("pics/tmp.png")
plt.savefig("pics/overview-as-one.png")
# plt.show()
