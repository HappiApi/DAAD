# Takes text file for polygon and returns a JSON

import json

def getJSON(path):

	def conv_str(string):
		str_tup = list( map(lambda x: tuple(x.strip('()')), string.replace('),', ')#').split('#')) )
		return [(float(x[0]),float(x[2])) for x in str_tup]

	with open(path, 'r') as f:
		text = f.read().split('\n')[0:2]
		obj = { x[0]: conv_str(x[1]) for x in map(lambda x: x.replace(' ','').split(':'), text) }
		return json.dumps(obj, sort_keys=True)

