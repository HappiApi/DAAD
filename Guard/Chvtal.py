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

import colour

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

# Get adjacency matrix for one polygon
def adj_matrix(tri_data):
	triangles = tri_data['tri']['triangles']
	vertices_no = len(tri_data['tri']['vertices'])
	adj_mat = []

	def constr_adjrow(adjVertIndices):
		init_list = [0] * vertices_no
		for index in adjVertIndices:
			init_list[index] = 1
		return init_list
	# For each vertex index
	for vertex_index in range(vertices_no):
		adj_vertices = set()
		# Get all triangles containing vertex index 
		for triangle in triangles:
			if vertex_index in triangle:
				# Each vertex index in triangle
				for index in triangle :
					if vertex_index != index:
						adj_vertices.add(index)

		adj_mat.append(constr_adjrow(adj_vertices))

	return adj_mat

am = adj_matrix(triangulate(polygons['3']))
