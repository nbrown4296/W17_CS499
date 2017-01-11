#!/usr/bin/python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return "This is the main page \n <p>Click <a href=\"/aboutme\">here</a> to go to the aboutme page.</p>" 

@app.route('/aboutme')
def welcome():
    return render_template('aboutme.html')  # render a template

# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True)

