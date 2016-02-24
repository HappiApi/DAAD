import parse
import json
import pprint
import sys

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

# def add_colours(tri_data):
# 	colours = colour.colourVertices(adj_matrix(tri_data), 3)
# 	pdb.set_trace() 

# 	vertices = tri_data['tri']['vertices'].tolist()
# 	for vertex,c in zip(vertices, colours):
# 			vertex = {'coord':vertex, 'colour': c}

def min_colour(colours):
	c_options = set(colours)
	count = sys.maxsize
	colour = None
	for c in c_options:
		if colours.count(c) < count:
			count = colours.count(c)
			colour = c
	return c

def getGuards(polygon_no):
	positions = []
	data = triangulate(polygons[str(polygon_no)])
	adj_m = adj_matrix(data)
	colours = colour.colourVertices(adj_m, 3)
	c = min_colour(colours)
	for co, v in zip(colours, data['tri']['vertices']):
		if co ==c:
			# print(c,v)
			positions.append(v.tolist())
	return positions
	# pdb.set_trace()

def output(data):
	with open('test2.pol', 'w') as f:
		for i in range(1,31):
			s = str(i) + ": " + ', '.join(map(str,getGuards(i))).replace('[','(').replace(']',')')
			# pdb.set_trace()
			f.write(s+'\n')
		

# getGuards(3)
