var canvas;
var gl;

var NumVertices = 36; // 6 faces, 2 triangles per face, 3 vertices per triangle

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = xAxis; // Default rotation axis
var theta = [30, 30, 30];

var thetaLoc;
var positionLoc;

var position = [0, 0, 0];


document.getElementById("xSlider").oninput = function(event) {
    position[xAxis] = event.target.value;
};
document.getElementById("ySlider").oninput = function(event) {
    position[yAxis] = event.target.value;
};
document.getElementById("zSlider").oninput = function(event) {
    position[zAxis] = event.target.value;
};


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Create a color buffer and load it with the color data
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Bind the color buffer, set its pointer and enable the color attribute
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Create a vertex buffer and load it with the vertex data
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    // Bind the vertex buffer, set its pointer and enable the vertex attribute
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    positionLoc = gl.getUniformLocation(program, "position");

    // Event listeners for buttons that set the rotation axis
    document.getElementById("xButton").onclick = function() {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function() {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function() {
        axis = zAxis;
    };

    render();
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}



function quad(a, b, c, d) {
    var vertexColors = [
        [1.0, 0.0, 0.0, 1.0],  // red
        [1.0, 1.0, 0.0, 1.0],  // yellow
        [0.0, 1.0, 0.0, 1.0],  // green
        [0.0, 0.0, 1.0, 1.0],  // blue
        [1.0, 0.0, 1.0, 1.0],  // magenta
        [0.0, 1.0, 1.0, 1.0],  // cyan
        [0.5, 0.5, 0.5, 1.0],  // white
        [0.0, 0.0, 0.0, 1.0]   // black
    ];

    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0)
    ];

    var indices = [a, b, c, a, c, d];
  
    var colorGradient = [
        vertexColors[a],
        vertexColors[b],
        vertexColors[c],
        vertexColors[a],
        vertexColors[c],
        vertexColors[d]
    ];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(colorGradient[i]); 
    }
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Increment the rotation angle on the selected axis
    theta[axis] += 2.0;
    // Update the rotation angle in the shader
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(positionLoc, position); // Add this line
    // Draw the cube
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    // Animate - this calls 'render' again as soon as possible
    requestAnimationFrame(render);
}