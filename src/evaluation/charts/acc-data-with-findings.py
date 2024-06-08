import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Kategorie'  :  [ "Testdatensatz A" , "Testdatensatz B" ],
    'TDT'        :  [ 1621,0],
    'Guesser'    :  [ 2227 ,0],
    'Our'        :  [ 3025, 3073],
}
df = pd.DataFrame(data)
fig, ax = plt.subplots(figsize=(10, 5))
ax.tick_params(axis='y', labelsize=14)

bar_width = 0.15
index = np.arange(len(df['Kategorie']))
middle = index + bar_width / 2


bars1 = plt.bar(middle + bar_width, df['TDT'], bar_width, label='TDT')
bars3 = plt.bar(middle , df['Guesser'], bar_width, label='Guesser')
bars4 = plt.bar(middle - bar_width, df['Our'], bar_width, label='Neuer Fuzzer')


plt.ylabel('Anzahl Anmeldedaten',fontsize=16)
plt.xticks(index + bar_width / 2, df['Kategorie'], fontsize=16)
plt.axhline(0, color='black', linewidth=0.8)
plt.legend(fontsize=14)
plt.tight_layout()

plt.savefig("pics/acc-data-with-findings.png")

# plt.show()
