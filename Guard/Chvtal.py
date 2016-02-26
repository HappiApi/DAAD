# combo's : 4, 5, 6, 7, 9, 25
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
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
# Written Libraries
import colour
import star
import starise

# Get polygons 
polygons = json.loads(parse.getJSON('guards.pol.txt'))

def ccw_segments(points_array):
	length = len(points_array) -1
	ret = [ [x, x+1] for x in range(length)]
	ret.append([length, 0])
	return ret

#triangulate and returns dict for 'original' and 'tri' (triangulated) polygons
def triangulate(points_array):

	input_dict = dict(vertices=np.array(points_array), segments=ccw_segments(points_array))
	tri = triangle.triangulate(input_dict, 'p')

	return {'original':input_dict, 'tri':tri}

# Get adjacency matrix for one polygon (2D array)
# !! Important, doesn't add itself to the adjacency matrix
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

def star_poly_array(star_data, vertices):
	polygons = []
	for poly in star_data:
		polygon = []
		for vertex in poly:
			polygon.append(vertices[vertex])
		polygons.append(np.array(polygon))
	return polygons

# Return 2D array of position of guards
def getGuards(polygon_no):
	positions = []
	data = triangulate(polygons[str(polygon_no)])
	vertices = data['tri']['vertices']
	colours = get_colour(data)
	min_c = get_min_colour(colours)
	stars = get_stars(data)
	star_polygons = star_poly_array(stars, vertices)
	# print(stars)
	# print(star_polygons)
	# print(vertices)
	# print(min_c)
	adj = adj_matrix(data)
	# print(adj[24])
	# print(adj[33])
	# print(adj[60])
	# pdb.set_trace()

	def compare(plt, A, B): 
	    ax1 = plt.subplot(121, aspect='equal')
	    triangle.plot.plot(ax1, **A)
	    ax2 = plt.subplot(122, sharex=ax1, sharey=ax1)
	    triangle.plot.plot(ax2, **B)
	    return (ax1, ax2)

	ax1, ax2 = compare(plt, data['original'], data['tri'])

	# Colour polygons
	patches = []
	for polygon in star_polygons:
		p = Polygon(polygon, True)
		patches.append(p)
	p = PatchCollection(patches, cmap=matplotlib.cm.jet)
	plt.gca().add_collection(p)

	# Label vertex indices
	for i, v in enumerate(vertices):
		ax1.text(v[0], v[1], str(i))

	for c, v in zip(colours, vertices):
		if c == min_c:
			positions.append(v.tolist())
		plt.annotate(c, xy=tuple(v), color='darkblue')

	# positions = starise.kernels(stars, vertices)

	# Plot kernel points
	ax1.plot(*zip(*positions), marker='^', color='g', ls='')

	# Set colours and config for plot
	colors = range(0,1000, int(1000/len(patches)))
	p.set_array(np.array(colors))	
	plt.subplots_adjust(left=0, bottom=0, right=1, top=1,
                wspace=0, hspace=0)
	plt.show()
	# pdb.set_trace()
	return positions

def getGuardsk(polygon_no):
	isStar = starise.kernel(list(range(len(polygons[str(polygon_no)]))), polygons[str(polygon_no)])
	print(isStar[0])
	if isStar[0]+1:
		return [isStar[1]]
	else:
		positions = []
		data = triangulate(polygons[str(polygon_no)])
		vertices = data['tri']['vertices']
		colours = get_colour(data)
		min_c = get_min_colour(colours)
		stars = get_stars(data)
		star_polygons = star_poly_array(stars, vertices)
		# print(stars)
		# print(star_polygons)
		# print(vertices)
		# print(min_c)
		adj = adj_matrix(data)
		# print(adj[24])
		# print(adj[33])
		# print(adj[60])
		# pdb.set_trace()

		def compare(plt, A, B): 
		    ax1 = plt.subplot(121, aspect='equal')
		    triangle.plot.plot(ax1, **A)
		    ax2 = plt.subplot(122, sharex=ax1, sharey=ax1)
		    triangle.plot.plot(ax2, **B)
		    return (ax1, ax2)

		ax1, ax2 = compare(plt, data['original'], data['tri'])

		# Colour polygons
		patches = []
		for polygon in star_polygons:
			p = Polygon(polygon, True)
			patches.append(p)
		p = PatchCollection(patches, cmap=matplotlib.cm.jet)
		plt.gca().add_collection(p)

		# Label vertex indices
		for i, v in enumerate(vertices):
			ax1.text(v[0], v[1], str(i))

		for c, v in zip(colours, vertices):
			# if c == min_c:
				# positions.append(v.tolist())
			plt.annotate(c, xy=tuple(v), color='darkblue')

		positions = starise.kernels(stars, vertices)

		# Plot kernel points
		ax1.plot(*zip(*positions), marker='^', color='g', ls='')

		# Set colours and config for plot
		colors = range(0,1000, int(1000/len(patches)))
		p.set_array(np.array(colors))	
		plt.subplots_adjust(left=0, bottom=0, right=1, top=1,
	                wspace=0, hspace=0)
		# plt.show()
		# pdb.set_trace()
		return positions

def show_tri(dic):
	triangle.plot.compare(plt, dic['original'], dic['tri'])
	plt.show()

def t(polygon_no):
	show_tri(triangulate(polygons[str(polygon_no)]))

def output():
	with open('test3.pol', 'w') as f:
		for i in range(1,31):
			s = str(i) + ": " + ', '.join(map(str,getGuardsk(i))).replace('[','(').replace(']',')')
			f.write(s+'\n')


