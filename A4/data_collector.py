import requests, time, json
from datetime import datetime as date
from elasticsearch import Elasticsearch

client = Elasticsearch([{'host':'search-random-numbers-6cvzjgoroom3t5elffvahpx5uy.us-west-2.es.amazonaws.com', 'port':80}])

i = 1
r = requests.get('http://ec2-35-167-208-193.us-west-2.compute.amazonaws.com:3000/')
while r.status_code == 200:
	r = requests.get('http://ec2-35-167-208-193.us-west-2.compute.amazonaws.com:3000/')
	temp = r.content
	print temp
	t = time.strftime("%d-%m-%Y")
	print t
	client.index(index='index-'+str(i), doc_type='date', id=i, body=json.loads(temp))
	i = i + 1
	time.sleep(5)

