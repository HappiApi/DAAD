import pulp
import math
import pdb

def isPointInShape(polygon, vertices, x, y):
	angle = 0.0

	# print(polygon)

	for j in range(0,len(polygon)):
			p1x = vertices[polygon[j]][0] - x
			p1y = vertices[polygon[j]][1] - y

			p2x = vertices[polygon[(j+1)%len(polygon)]][0] - x
			p2y = vertices[polygon[(j+1)%len(polygon)]][1] - y

			dtheta = 0.0
			theta1 = 0.0
			theta2 = 0.0

			theta1 = math.atan2(p1y, p1x)
			theta2 = math.atan2(p2y, p2x)
			dtheta = theta2 - theta1
			
			while dtheta > math.pi:
				dtheta -= math.pi*2
			pass

			while dtheta < -math.pi:
				dtheta += math.pi*2
			pass

			angle += dtheta
			#print(angle)
	pass


	isInsideShape = (angle/(math.pi*2) < 1.1) and (angle/(math.pi*2) > 0.9)
	# print(isInsideShape)
	return isInsideShape

# Adds inequality to problem object
# Doesn't deal with when gradient is infinite (line 242)
def createInequality(poly, vertices, x, y, prob):
	# Want i t slightly bigger than epsilon
	epsilon = 0.0000000001
	equal_epsilon = 0.0000000001
	p1_a = []
	p2_a = []
	midpoint_a = []
	p3_a = []
	isInShape_a = []
	normal_a = []
	gradient_a = []
	c_a = []
	for q in range(0,len(poly)):
		p1 = vertices[poly[q%len(poly)]]
		p2 = vertices[poly[(q+1)%len(poly)]]
		c = 0
		normal = 1
		gradient = 0
		if abs(p1[0] - p2[0]) < equal_epsilon:
			normal = 0
			pass
		else:
			gradient = (p1[1] - p2[1]) / (p1[0] - p2[0])
			c = p1[1] - (gradient*p1[0])

		yGrad = 1

		if gradient != 0:
			normal = -1/gradient
			pass
		else:
			yGrad = 0 

		dx = p1[0] - p2[0]
		dy = p1[1] - p2[1]

		# Check which side of line is inside the shape
		midpoint = [p2[0]+dx/2.0,p2[1]+dy/2.0]
		# print(midpoint)

		# epsilon is to move a tiny bit, too much outside shape
		# For 'normal' gradient
		p3 = [midpoint[0],midpoint[1]+epsilon]

		# if poly == [5,6,7] and abs(p1[0]-0.70710678) < 0.1:
		# 	pdb.set_trace()
		# For infinity gradient
		# IMPORTANT ORDER OF CHECKS MATTER
		if abs(p1[0] - p2[0]) < equal_epsilon:
			p3 = [midpoint[0]+epsilon, midpoint[1]]
		# For zero gradient
		elif gradient == 0:
			p3 = [midpoint[0], midpoint[1]+epsilon]

		#y = mx + c
		#c = y-mx
		# print("GRAD")
		# print(gradient)


		#print(p3[0],p3[1])

		isInShape =	isPointInShape(poly, vertices, p3[0],p3[1])



		# if isInShape:
		# 	if gradient <= 0:
		# 		prob += y - (gradient * x) >= c
		# 		pass
		# 	else:
		# 		prob += y - (gradient*x) <= c
		# else:
		# 	if gradient <= 0:
		# 		prob += y - (gradient * x) <= c
		# 		pass
		# 	else:
		# 		prob += y - (gradient*x) >= c
		# pass

		# print([isInShape, gradient])
		# pdb.set_trace()

		# Old Kinda works but not really
		# if isInShape:
		# 	if abs(p1[0] - p2[0]) < equal_epsilon:
		# 		# This is flipped
		# 		prob += x <= p1[0]
		# 	elif gradient == 0:
		# 		prob += y >= p1[1]
		# 	elif gradient > 0:
		# 		prob += y - (gradient*x) <= c
		# 	else:
		# 		prob += y - (gradient*x) >= c
		# else:
		# 	if abs(p1[0] - p2[0]) < equal_epsilon:
		# 		# This is flipped
		# 		prob += x >= p1[0]
		# 	elif gradient == 0:
		# 		prob += y <= p1[1]
		# 	elif gradient > 0:
		# 		prob += y - (gradient*x) >= c
		# 	else:
		# 		prob += y - (gradient*x) <= c

		if isInShape:
			if abs(p1[0] - p2[0]) < equal_epsilon:
				prob += x >= p1[0]
			elif gradient == 0:
				prob += y >= p1[1]
			elif gradient > 0:
				prob += y >= (gradient*x) + c
			else:
				prob += y >= (gradient*x) + c
		else:
			if abs(p1[0] - p2[0]) < equal_epsilon:
				prob += x <= p1[0]
			elif gradient == 0:
				prob += y <= p1[1]
			elif gradient > 0:
				prob += y <= (gradient*x) + c
			else:
				prob += y <= (gradient*x) + c

		p1_a.append(p1)
		p2_a.append(p2)
		midpoint_a.append(midpoint)
		p3_a.append(p3)
		isInShape_a.append(isInShape)
		normal_a.append(normal)
		gradient_a.append(gradient)
		c_a.append(c)
	prob.solve()
	# pdb.set_trace()
	if abs(pulp.value(x)) == 3000 or abs(pulp.value(y)) == 3000:
		print("Problem")
		print([pulp.value(x), pulp.value(y)])
		print(prob)
		print("poly", poly)
		print("p1", p1_a)
		print("p2", p2_a)
		print("midpoint", midpoint_a)
		print("p3", p3_a)
		print("isInShape", isInShape_a)
		print("normal", normal_a)
		print("gradient", gradient_a)
		print("c", c_a)

	return [pulp.value(x), pulp.value(y)]


# for x in range(0,len(starShapedPolygons)):
# 	#print(starShapedPolygons[x])

# 	#isPointInShape(starShapedPolygons[x], 14, 9)
# 	xG = pulp.LpVariable("x", 0.0, 3000.0)
# 	yG = pulp.LpVariable("y", 0.0, 3000.0)
# 	problem = pulp.LpProblem("prob", pulp.LpMaximize)
# 	createInequality(starShapedPolygons[x], verticesCoordinates, xG, yG, problem)
# 	status = problem.solve()
# 	# print(pulp.LpStatus[status])
# 	print("ANSWER")
# 	print([pulp.value(xG), pulp.value(yG)])
# 	# print(problem)

# 	pass

def kernel(polygon, vertices):
	xG = pulp.LpVariable("x", -3000.0, 3000.0)
	yG = pulp.LpVariable("y", -3000.0, 3000.0)
	problem = pulp.LpProblem("prob", pulp.LpMaximize)
	return createInequality(polygon, vertices, xG, yG, problem)
	# status = problem.solve()
	# print("ANSWER")
	# print([pulp.value(xG), pulp.value(yG)])
	# print(problem)
	# return [pulp.value(xG), pulp.value(yG)]

def kernels(polygons, vertices):
	positions = []
	for polygon in polygons:
		positions.append(kernel(polygon, vertices))
	return positions

