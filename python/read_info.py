from __future__ import print_function
import sys
from os import listdir
import json
import ast

args = sys.argv

with open('/'.join(['buildings', args[1], args[2], args[3], 'info.json'])) as infile:
	try:
		room_info = ast.literal_eval(''.join(infile.readlines()).replace('\n', ''))
	except:
		room_info = {}
		
js = json.JSONEncoder().encode(room_info)

print(str(js))