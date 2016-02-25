import pulp
import math

colourList = [1, 2, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 3]

graph = [[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], #1
		
		[1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], #2
		
		[0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #3
		
		[0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #4
		
		[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], #5
		
		[0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1], #6
		
		[0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #7
		
		[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #8
		
		[0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #9
		
		[0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], #10
		
		[0,0,0,0,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],#11
		
		[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],#12
		
		[0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],#13
		
		[0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],#14
		
		[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0],#15
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0], #16
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],#17
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0],#18
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0],#19
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],#20
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0],#21
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0],#22
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0],#23
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],#24
		
		[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0],#25
		
		[0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0],#26
		

		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0],#27
		
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],#28
		
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],#29
		
		[1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],#30
		
		]


colourCounts = [0,0,0]


verticesCoordinates = [[12,12],
					
					[11,5],
					
					[43,0],
					
					[44,8],
					
					[32,10],
					
					[23,18],
					
					[36,17],
					
					[35,13],
					
					[45,15],
					
					[48,27],
					
					[36,24],
					
					[31,33],
					
					[42,34],
					
					[44,39],
					
					[29,42],
					
					[27,53],
					
					[49,50],
					
					[55,57],
					
					[5,63],
					
					[0,57],
					
					[17,53],
					
					[19,42],
					
					[12,43],
					
					[10,36],
					
					[19,37],
					
					[24,26],
					
					[12,30],
					
					[6,24],
					
					[16,18],
					
					[21,11],
					]


def setupVars():
	for x in range(0,30):
		colourCounts[colourList[x]-1] += 1
	pass

	#print(colourCounts)

def createPolygons():
	indexToUse = 0
	if (colourCounts[0] < colourCounts[1]) and (colourCounts[0] < colourCounts[2]):
		indexToUse = 0
	pass

	if (colourCounts[1] < colourCounts[0]) and (colourCounts[1] < colourCounts[2]):
		indexToUse = 1
	pass

	if (colourCounts[2] < colourCounts[1]) and (colourCounts[2] < colourCounts[0]):
		indexToUse = 2
	pass

	arrayOfLeastColour = []
	for x in range(0,30):
		if colourList[x] == indexToUse+1:
			arrayOfLeastColour.append(x)
		pass
	pass

	print(arrayOfLeastColour)

	starShapedPolygons = []

	for x in range(0,colourCounts[indexToUse]):
		currentVertex = arrayOfLeastColour[x]


		starShapedPolygonVertexList = []

		

		for y in range(0,30):
			isConnected = graph[currentVertex][y]

			if isConnected == 1:
				starShapedPolygonVertexList.append(y)
			pass

			if currentVertex == y:
				starShapedPolygonVertexList.append(y)
			pass

		pass
		starShapedPolygons.append(starShapedPolygonVertexList)

	pass

	return starShapedPolygons

setupVars()
starShapedPolygons = createPolygons()

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
	# print(poly)
	
	for q in range(0,len(poly)):
		p1 = vertices[poly[q%len(poly)]]
		p2 = vertices[poly[(q+1)%len(poly)]]
		c = 0
		normal = 1
		gradient = 0
		if (p1[0] - p2[0]) == 0:
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
		# 0.1 is to move a tiny bit, too much outside shape
		p3 = [midpoint[0]+0.1,midpoint[1]+(0.1*normal)]

		if gradient == 0:
			p3 = [midpoint[0]-0.1, midpoint[1]]
			pass
		elif (p1[0] - p2[0]) == 0:
			p3 = [midpoint[0], midpoint[1]+0.1]

		#y = mx + c
		#c = y-mx
		# print("GRAD")
		# print(gradient)


		#print(p3[0],p3[1])

		isInShape =	isPointInShape(poly, vertices, p3[0],p3[1])



		if isInShape:
			if gradient <= 0:
				prob += y - (gradient * x) >= c
				pass
			else:
				prob += y - (gradient*x) <= c
		else:
			if gradient <= 0:
				prob += y - (gradient * x) <= c
				pass
			else:
				prob += y - (gradient*x) >= c
		pass

		print([isInShape, gradient])



for x in range(0,len(starShapedPolygons)):
	#print(starShapedPolygons[x])

	#isPointInShape(starShapedPolygons[x], 14, 9)
	xG = pulp.LpVariable("x", 0.0, 3000.0)
	yG = pulp.LpVariable("y", 0.0, 3000.0)
	problem = pulp.LpProblem("prob", pulp.LpMaximize)
	createInequality(starShapedPolygons[x], verticesCoordinates, xG, yG, problem)
	status = problem.solve()
	# print(pulp.LpStatus[status])
	print("ANSWER")
	print([pulp.value(xG), pulp.value(yG)])
	# print(problem)

	pass

def kernel(polygon, vertices):
	xG = pulp.LpVariable("x", -3000.0, 3000.0)
	yG = pulp.LpVariable("y", -3000.0, 3000.0)
	problem = pulp.LpProblem("prob", pulp.LpMaximize)
	createInequality(polygon, vertices, xG, yG, problem)
	status = problem.solve()
	print("ANSWER")
	print([pulp.value(xG), pulp.value(yG)])
	print(problem)
