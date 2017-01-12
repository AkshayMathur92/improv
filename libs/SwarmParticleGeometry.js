THREE.SwarmParticleGeometry = function (width) {

    var BIRDS = width * width;
    var triangles = BIRDS * 3;
    var points = triangles * 3;

    THREE.BufferGeometry.call( this );

    var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
    var colors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
    var references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
    var vertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );

    this.addAttribute( 'position', vertices );
    this.addAttribute( 'color', colors );
    this.addAttribute( 'reference', references );
    this.addAttribute( 'vertex', vertex );

    // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );


    var v = 0;

    function verts_push() {
        for (var i=0; i < arguments.length; i++) {
            vertices.array[v++] = arguments[i];
        }
    }

    var wingsSpan = 2.0;

    for (var f = 0; f<BIRDS; f++ ) {

        // Body
        verts_push(
            0, -0, -1.0,
            0, .2, -1.0,
            0, 0, .15
        );

        // Left Wing
        verts_push(
            0, 0, -.75,
            -wingsSpan, 0, 0,
            0, 0, .75
        );

        // Right Wing
        verts_push(
            0, 0, .75,
            wingsSpan, 0, 0,
            0, 0, -.75
        );

    }
    var width = 100; //112.8;
    for( var v = 0; v < triangles * 3; v++ ) {

        var i = ~~(v / 3);
        var x = (i % width) / width;
        var y = ~~(i / width) / width;

        var c = new THREE.Color(
            0x444444 +
            ~~(v / 9) / BIRDS * 0x666666
        );

        colors.array[ v * 3 + 0 ] = c.r;
        colors.array[ v * 3 + 1 ] = c.g;
        colors.array[ v * 3 + 2 ] = c.b;

        references.array[ v * 2     ] = x;
        references.array[ v * 2 + 1 ] = y;

        vertex.array[ v         ] = v % 9;

    }

};

THREE.SwarmParticleGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
