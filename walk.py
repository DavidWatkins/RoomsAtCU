import os
import shutil
import webbrowser
import json
import pprint
rooms = []


#For each building
	#For each floor
		#Show the image for the floor
		#Enter in information for each room until the user enters 0
		#Record info in giant list of dictionaries
		#Copy image to imgs with name: "Building-Floor.jpg"
			#Replace underscores

#Print list

buildings = {}

building_index = 0
all_buildings = sorted(os.listdir('buildings'))
print(all_buildings)
for building in all_buildings:
	
	cur_building = {}
	all_floors = sorted(os.listdir('buildings/' + building))
	for floor in all_floors:
		cur_floor = {"roomNo": {"numWindows": 0, "roomType": "single", "isStandingCloset": True, "reviews": []}}
		cur_building[floor] = cur_floor

	buildings[building] = cur_building
	building_index += 1

	if(os.path.isdir('buildings/' + building)):
		for floor in os.listdir('buildings/' + building):
			try:
				imgurl = 'buildings/' + building + '/' + floor + "/floor_plan.jpg"
				shutil.copyfile(imgurl, 'floor_plans/' + building.replace(' ', '_') + '-' + floor + '.jpg')
			except:
				print("Unable to copy: " + 'buildings/' + building + '/' + floor + "/floor_plan.jpg")

f = open('outfile.txt', 'w')

pp = pprint.PrettyPrinter(indent=4)
# pprint.pprint(json.dumps(buildings), f)

f.write(json.dumps(buildings))
f.close()