import numpy as np
import pandas as pd

notLeaked = [5621, 1164459, 1203796]
leaked = [24379, 2206,2808]
index = ['Original', 'TDT-Methode', 'Guesser-Methode']
df = pd.DataFrame({'kompromittiert': leaked, 'nicht kompromittiert': notLeaked}, index=index)
ax = df.plot.bar(rot=0, logy=True)
fig = ax.get_figure()
fig.savefig("pics/overview.png")