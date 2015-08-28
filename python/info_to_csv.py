import csv
import os
import ast

with open('rooms.csv', 'w') as csvfile:
	fieldnames = ['building', 'floor', 'room', 'type', 'area', 'closet_type']
	room_writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

	room_writer.writeheader()

	buildings = os.listdir('buildings')
	for building in buildings:
		if building == '.DS_Store':
			continue
		floors = os.listdir('buildings/' + building)
		for floor in floors:
			if floor == '.DS_Store':
				continue
			rooms = os.listdir('buildings/' + building + '/' + floor)
			for room in rooms:
				if room == '.DS_Store' or room == 'floor_plan.jpg':
					continue
				with open('/'.join(['buildings', building, floor, room, 'info.json'])) as infile:
					try:
						room_info = ast.literal_eval(''.join(infile.readlines()).replace('\n', ''))
					except:
						print('Failed on', building, floor, room)
						room_info = {}
				room_dict = {
					'building': building,
					'floor': floor,
					'room': room,
					'type': '' if room_info.get('type') == None else room_info.get('type'),
					'area': 0 if room_info.get('area') == None else room_info.get('area'),
					'closet_type': '' if room_info.get('closet_type') == None else room_info.get('closet_type')
				}
				room_writer.writerow(room_dict)