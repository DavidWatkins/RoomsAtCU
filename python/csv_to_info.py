import csv

fields = ['area', 'type', 'closet_type']

with open('rooms.csv') as csvfile:
	room_reader = csv.DictReader(csvfile)
	for row in room_reader:
		filename = '/'.join(['buildings', row['building'], row['floor'], row['room'], 'info.json'])
		with open(filename, 'w') as info_file:
			info_file.write(str(row))