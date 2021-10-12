import requests
import sys
import re
query = 'https://www.youtube.com/results?search_query='+str.replace(sys.argv[1],"%2137%","+")
with open("queries.txt","a") as f:
    f.write(query+"\t")
r = requests.get(query)
match = re.findall(r"watch\?v=(\S{11})",r.text)
print("https://www.youtube.com/watch?v="+match[0])
with open("queries.txt","a") as f:
    f.write("https://www.youtube.com/watch?v="+match[0]+"\n")
sys.stdout.flush()