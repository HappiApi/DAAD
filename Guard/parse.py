# Takes text file for polygon and returns a JSON

import json

def getJSON(path):

	def conv_str(string):
		return list(map(lambda x: tuple(map(float, x.strip('() ').split(','))), string.replace('),', ')#').split('#')) )
	

	with open(path, 'r') as f:
		text = f.read().split('\n')
		obj = { x[0]: conv_str(x[1]) for x in map(lambda x: x.replace(' ','').split(':'), text) }
		return json.dumps(obj, sort_keys=True)

