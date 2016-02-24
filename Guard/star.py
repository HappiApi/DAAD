import pdb

# colour_list
### Index of list is index of vertex
### Number in that index is the colour 
#

# colour_count
### Index of list is colour - 1
### Number in that index is number of vertices with that colour
#

# Given n vertices, index of vertices go from 0 to n-1


# Returns colour_count from colour_list
def get_colour_count(colour_list):
	colour_count = []
	# Colours are 1,2 and 3
	for c in range(1,4):
		colour_count.append(colour_list.count(c))
	return colour_count

# Gets colour with least number of vertices
def get_min_colour(colour_count):
	return colour_count.index(min(colour_count)) + 1

# Gets a list of the indices of the vertex that has the specified colour
def get_chosen_colour_list(colour_list, chosen_colour):
	ret = []
	for i, c in enumerate(colour_list):
		if c == chosen_colour:
			ret.append(i)
	return ret

# Given a vertex index, get list of index of vertex that makes star polygon
def find_polygons(chosen_colour_list, adj_matrix):
	polygons = []
	# pdb.set_trace()
	for index in chosen_colour_list:
		polygon_vertices = []
		polygon_vertices.append(index)
		for i, adj_vertex in enumerate(adj_matrix[index]):
			if adj_vertex:
				polygon_vertices.append(i)
		polygons.append(polygon_vertices)
	return polygons

ex = [1, 2, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 3]

