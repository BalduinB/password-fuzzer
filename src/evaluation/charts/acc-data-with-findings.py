import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Kategorie'  :  [ "Testdatensatz A" , "Testdatensatz B" ],
    'TDT'        :  [ 1621,0],
    'Guesser'    :  [ 2227 ,0],
    'Guesser+TDT':  [ 2828 ,0],
    'Our'        :  [ 3025, 3073],
}
df = pd.DataFrame(data)
fig, ax = plt.subplots(figsize=(10, 6))
ax.tick_params(axis='y', labelsize=14)

bar_width = 0.15
index = np.arange(len(df['Kategorie']))


bars1 = plt.bar(index + 2*bar_width, df['TDT'], bar_width, label='TDT')
bars3 = plt.bar(index + bar_width, df['Guesser'], bar_width, label='Guesser')
bars1 = plt.bar(index , df['Guesser+TDT'], bar_width, label='TDT oder Guesser')
bars4 = plt.bar(index - bar_width, df['Our'], bar_width, label='Unser Fuzzer')


plt.ylabel('Anzahl Anmeldedaten',fontsize=16)
plt.xticks(index + bar_width / 2, df['Kategorie'], fontsize=16)
plt.axhline(0, color='black', linewidth=0.8)
plt.legend(fontsize=14)
plt.tight_layout()

plt.savefig("pics/acc-data-with-findings.png")

# plt.show()
