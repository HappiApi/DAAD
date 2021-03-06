There are different classes of polygons and there exists 'specialised algorithms' 
to solve specific classes better than the 'textbook' algorithm 

## Star-shaped polygons
the whole interior is visible from a single point, without crossing any edge. The polygon must be simple, and may be convex or concave.

Kernel is the the area of all the points in a star shaped polygon where you can 'see' everything (edges and vertices)

[Wikipedia](https://en.wikipedia.org/wiki/Star-shaped_polygon)

#### Decomposing Polygon to Star-shaped polygons
[Paper here](http://cgm.cs.mcgill.ca/~godfried/publications/star.pdf)

Can test if a polygon is star shaped and find a single point in kernal by formulating it as a linear program, can be done in linear time applying [these](https://www.inf.ethz.ch/personal/emo/PublFiles/SubexLinProg_ALG16_96.pdf) concepts

####[Algorithm](http://www.csee.wvu.edu/~ksmani/courses/sp06/cg/qen/hw2sol.pdf) 

for testing star shapeness

#### [Algorithm](http://link.springer.com/article/10.1007%2FBF01937271) 

for computing visibility polygon (correction of Lee's linear algorithm 1979, in 1987)

##### [Implementation](http://arxiv.org/abs/1403.3905)

#### Heuristic algorithm for vertex coloring of graphs  

[paper](http://arxiv.org/pdf/1210.5176.pdf)

#### Some other polygon stuff

Convex Polygon - No interior angle > 180 deg  
Concave Polygon - At least one interior angle > 180 deg  
Simple: the boundary of the polygon does not cross itself. All convex polygons are simple.

### Our Algorithm (so-far)

1.Triangulate The Polygon  (constrained delaunay triangulation)
2.Colour Vertices of Polygon  
3.Compute star-shaped polygon  
4.Find a point in Kernel of polygon  
5.For each star polygon find visibility polygon from the point found above  
6.If a visibility polygon is overlapped entirely (proper subset) then remove guard.   

