# Standard Libraries
import parse
import json
import pprint
import sys
import math
import pdb
# Dependency Libraries
import triangle
import triangle.plot
import numpy as np
import matplotlib.pyplot as plt
# Written Libraries
import colour
import star

# Get polygons 
polygons = json.loads(parse.getJSON('guards.pol.txt'))

#triangulate and returns dict for 'original' and 'tri' (triangulated) polygons
def triangulate(points_array):

	def ccw_segments(points_array):
		length = len(points_array) -1
		ret = [ [x, x+1] for x in range(length)]
		ret.append([length, 0])
		return ret

	input_dict = dict(vertices=np.array(points_array), segments=ccw_segments(points_array))
	tri = triangle.triangulate(input_dict, 'p')

	return {'original':input_dict, 'tri':tri}

# Get adjacency matrix for one polygon (2D array)
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

# Get array of colours, index in array is index of vertex, value is colour
def get_colour(tri_data):
	return colour.colourVertices(tri_data['tri']['triangles'], 3, len(tri_data['tri']['vertices']))

# Returns minimum colour from colour list
def get_min_colour(colour_list):
	return star.get_min_colour(star.get_colour_count(colour_list))

# Return 2D array of star polygon, each being index of vertices of ach polygon
def get_stars(tri_data):
	colours = get_colour(tri_data)
	stars = star.find_polygons(star.get_chosen_colour_list(colours, get_min_colour(colours)), adj_matrix(tri_data))
	return stars

# Return 2D array of position of guards
def getGuards(polygon_no):
	positions = []
	data = triangulate(polygons[str(polygon_no)])
	colours = get_colour(data)
	min_c = get_min_colour(colours)
	for c, v in zip(colours, data['tri']['vertices']):
		if c == min_c:
			positions.append(v.tolist())
	return positions

def show_tri(dic):
	triangle.plot.compare(plt, dic['original'], dic['tri'])
	plt.show()

def t(polygon_no):
	show_tri(triangulate(polygons[str(polygon_no)]))

def output():
	with open('test3.pol', 'w') as f:
		for i in range(1,31):
			s = str(i) + ": " + ', '.join(map(str,getGuards(i))).replace('[','(').replace(']',')')
			f.write(s+'\n')


