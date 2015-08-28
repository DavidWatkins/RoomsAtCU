import csv
import os

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
				room_dict = {
					'building': building,
					'floor': floor,
					'room': room,
					'type': '',
					'area': 0,
					'closet_type': ''
				}
				room_writer.writerow(room_dict)