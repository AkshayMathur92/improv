uniform float time;
uniform float delta;
uniform float depth;

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 position = tmpPos.xyz;
    vec3 velocity = texture2D( textureVelocity, uv ).xyz;

    float phase = tmpPos.w;

    phase = mod( ( phase + delta +
        length( velocity.xz ) * delta * 3. +
        max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );

    vec3 calculatedPos = vec3( position + velocity * delta * 15.);
    calculatedPos.y = clamp( calculatedPos.y, -2000.0, depth);
    gl_FragColor = vec4( calculatedPos, phase);

}
