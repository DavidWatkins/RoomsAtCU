from __future__ import print_function
from os import listdir
import json

building_dict = {}

for building in listdir('buildings'):
	if building == '.DS_Store':
		continue
	floor_dict = {}
	for floor in listdir('buildings/' + building):
		if floor == '.DS_Store':
			continue
		room_list = listdir('buildings/' + building + '/' + floor)
		if 'floor_plan.jpg' in room_list:
			room_list.remove('floor_plan.jpg')
		if '.DS_Store' in room_list:
			room_list.remove('.DS_Store')
		floor_dict[floor] = room_list
	building_dict[building] = floor_dict

js = json.JSONEncoder().encode(building_dict)

print(str(js))