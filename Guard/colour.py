
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

def colourVertices(adjMat, numOfColours):
	# Needs to be the number of vertices.
	# Should work now
	numberOfVertices = len(adjMat) 
	colours = [0] * numberOfVertices

	def isSafe(vertexToColour, adjMat, colours, colour):
		for x in range(0,numberOfVertices):
			if adjMat[vertexToColour][x]:
				if colour == colours[x]:
					return False
					pass
				pass
			pass

		return True

	def doIt(adjMat, numOfColours, colours, vertexToColour):
		if (vertexToColour == numberOfVertices):
			return True
			pass

		for x in range(1, numOfColours+1):
			if isSafe(vertexToColour, adjMat, colours, x):
				colours[vertexToColour] = x

				if doIt(adjMat, numOfColours, colours, vertexToColour+1) == True:
					return True
					pass

				colours[vertexToColour] = 0
				pass
			pass

		return False


	if doIt(adjMat, numOfColours, colours, 0) != True:
		print("Didn't work")
		return False
		pass
	else:
		print(colours)
		return True

	return colours

colourVertices(graph, 3)
