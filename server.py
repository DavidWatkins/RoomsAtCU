from flask import jsonify
from flask import Flask
from flask import send_file
import os
import ast
import datetime

app = Flask(__name__)

def read_file_no_sp(filepath):
	lines = read_file(filepath)
	return ''.join(''.join(lines.split('\n')).split('\t'))


def read_file(filepath):
	infile = open(filepath, 'rU')
	return ''.join(infile.readlines())

def clean_list(list):
	if '.DS_Store' in list:
		list.remove('.DS_Store')
	return list

def log(string):
	logfile = open("log.txt", 'a')
	logfile.write(string)
	logfile.close()

@app.route('/getBuildings', methods = ['POST'])
def get_buildings():
	return str(clean_list(os.listdir('./buildings')))


@app.route('/getFloors/<building_name>', methods = ['POST'])
def get_floors(building_name):
	building_name = building_name.replace('%20', ' ')
	return str(clean_list(os.listdir('./buildings/' + building_name)))

@app.route('/getImage/<building_name>/<floor_number>', methods = ['GET'])
def get_image(building_name, floor_number):
	building_name = building_name.replace('%20', ' ')
	floor_number = floor_number.replace('%20', ' ')
	try:
		image_name = '/'.join(['buildings', building_name, floor_number, 'floor_plan.jpg'])
		return send_file(image_name)
	except:
		image_name = '/'.join(['buildings', 'floor_plan.jpg'])
		return send_file(image_name)


@app.route('/getRoom/<building_name>/<floor_number>/<room_number>', methods = ['POST'])
def get_room_reviews(building_name, floor_number, room_number):
	building_name = building_name.replace('%20', ' ')
	floor_number = floor_number.replace('%20', ' ')
	room_number = room_number.replace('%20', ' ')
	try:
		review_list = clean_list(os.listdir('./buildings/' + building_name \
							+ '/' + floor_number + '/' + \
							room_number))
		reviews = []
		for review in review_list:
			reviews.append(ast.literal_eval(read_file_no_sp('./buildings/' \
							+ building_name + '/' + floor_number + '/' + \
							room_number + '/' + review)))
		return str(reviews)
	except OSError:
		return '[]'

@app.route('/submit', methods = ['POST'])
def add_review():
	
	building_name = request.form('building_name')
	floor_number = request.form('floor_number')
	room_number = request.form('room_number')
	lottery_number = request.form('lottery_number')
	point_value = request.form('point_value')
	view = request.form('view')
	heat_cool = request.form('heat_cool')
	radiator_type = request.form('radiator_type')
	closet_type = request.form('closet_type')
	drawers = request.form('drawers')
	number_of_windows = request.form('windows')
	flooring_type = request.form('flooring')
	single_or_double = request.form('single_double')

	new_response = {'building_name':building_name, 'floor_number':floor_number,
					'room_number':room_number, 'lottery_number':lottery_number,
					'point_value':point_value, 'view':view,
					'heat_cool':heat_cool, radiator_type:'radiator_type',
					'closet_type':closet_type,'drawers':drawers,
					'number_of_windows':number_of_windows,
					'flooring_type':flooring_type,
					'single_or_double':single_or_double}

	log(new_response)

	outfile = open(str(datetime.datetime.now()), 'w')
	outfile.write(str(new_response))
	outfile.close()
	return read_file('view_room.html')

@app.route('/SubmitRoom.html')
def submit_room():
	return read_file('Views/SubmitRoom.html')

@app.route('/ViewRoom.html')
def view_room():
    return read_file('Views/ViewRoom.html')

@app.route('/')
def index():
    return read_file('Views/ViewRoom.html')

@app.errorhandler(404)
def page_not_found(error):
	return "404!\nThis is not the page you're looking for"

if __name__ == '__main__':
    app.run(debug = True)