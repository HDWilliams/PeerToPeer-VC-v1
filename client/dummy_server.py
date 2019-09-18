from flask import Flask, request, jsonify
from random import choice
import random

'''
	A dummy server meant to assist in client side development
'''

app = Flask(__name__)

users = []
user_list = []
convos = []
@app.route('/')
def hello():
	return "Hello World, this is the web server. The client is not here"

@app.route('/login', methods=['GET'])
def login():
	return jsonify({"user": "RandomUser42"})

if __name__ == '__main__':
	# initialize test data now
	test_adjectives = "Cool Smart Curious Perilous".split()
	test_baseNames = "John Pavan Rohun Hugh Mark".split()
	users = [adj + name + str(random.randint(10,100)) for adj in
		test_adjectives for name in test_baseNames]
	user_list = [(i, users[i]) for i in range(0, len(users))]
	random.shuffle(user_list)
	n = len(user_list)
	pos = 0

	while n:
		group_size = random.randint(1, n)
		convo = (len(convos) + 1, [user_list[i] for i in range(pos, pos + group_size)])
		convos.append(convo)
		n -= group_size
		pos += group_size

	for convo in convos:
		print(convo)
	app.run()
