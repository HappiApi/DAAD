import parse
import json
import pprint

import pdb

from scipy.spatial import Delaunay
import triangle
import triangle.plot
import numpy as np
import math
import matplotlib.pyplot as plt

polygons = json.loads(parse.getJSON('guards.pol.txt'))

#triangulate and returns (orginal, triangulated) tuple
def triangulate(points_array):

	def ccw_segments(points_array):
		length = len(points_array) -1
		ret = [ [x, x+1] for x in range(length)]
		ret.append([length, 0])
		return ret

	input_dict = dict(vertices=np.array(points_array), segments=ccw_segments(points_array))
	tri = triangle.triangulate(input_dict, 'p')

	return {'original':input_dict, 'tri':tri}

def show_tri(dic):
	triangle.plot.compare(plt, dic['original'], dic['tri'])
	plt.show()

def t(polygon_no):
	show_tri(triangulate(polygons[str(polygon_no)]))

