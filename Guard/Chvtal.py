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

#triangulate and display comparison before and after
def t(points_array):

	def ccw_segments(points_array):
		length = len(points_array) -1
		ret = [ [x, x+1] for x in range(length)]
		ret.append([length, 0])
		return ret

	A = dict(vertices=np.array(points_array), segments=ccw_segments(points_array))
	B = triangle.triangulate(A, 'p')
	# pdb.set_trace()
	triangle.plot.compare(plt, A, B)
	plt.show()

def triangulate(polygon_no):
	t(polygons[str(polygon_no)])

