from flask import Flask, request, render_template, jsonify
from sklearn.neighbors import KNeighborsClassifier
from random import randint

app = Flask(__name__)

things = []
traffic_val = []
dataset = []

for i in range(0, 50):
    thing = [randint(1, 10), randint(0, 3), randint(0, 6), randint(0, 23)]
    val = (thing[0] + thing[1] + thing[2] + thing[3]) % 10
    things.append(thing)
    traffic_val.append(val)
    dataset.append([thing[0], thing[1], thing[2], thing[3], val])

knn = KNeighborsClassifier()


@app.route('/')
def static_page():
    return render_template("index.html")


@app.route('/predict', methods=['GET'])
def predict_thing():
    road_id = request.args.get('id')
    direction = request.args.get('dir')
    dayOfWeek = request.args.get('day')
    timeOfDay = request.args.get('time')
    this_thing = [int(road_id), int(direction), int(dayOfWeek), int(timeOfDay)]

    knn.fit(things, traffic_val)
    prediction = knn.predict(this_thing)[0]

    return str(prediction)


@app.route('/insert', methods=['GET'])
def create_thing():
    road_id = request.args.get('id')
    direction = request.args.get('dir')
    dayOfWeek = request.args.get('day')
    timeOfDay = request.args.get('time')
    tval = request.args.get('tval')
    this_thing = [int(road_id), int(direction), int(dayOfWeek), int(timeOfDay)]
    traffic_val.append(int(tval))
    things.append(this_thing)
    dataset.append([this_thing[0], this_thing[1], this_thing[2], this_thing[3], int(tval)])
    temp = ["format: road_id, direction, dayOfWeek, timeOfDay, traffic value"]
    temp.append(dataset)
    return jsonify(results=temp)


if __name__ == '__main__':
    app.run(debug=True)