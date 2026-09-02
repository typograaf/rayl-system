import * as THREE from "three";

/**
 * The surface: white ceramic, lit by three lights, with light coming through it.
 *
 * The app does this with a deferred renderer and eight passes. What that buys
 * is traced occlusion, bounced light, sixty-four samples of jitter and a
 * filmic curve — and none of it is what makes the picture look like Rayl.
 * What makes it look like Rayl is four things, and they are all here:
 *
 *   the soft fall     one big source almost overhead, wide enough that the
 *                     terminator turns rather than snaps
 *   the glow through  a body lit from behind lights up, and the light spreads
 *                     a little way inside before it comes out
 *   the sheet         the backdrop is most of the ambient, so a body is paler
 *                     where it faces the light end of the gradient
 *   the contact       where two bodies overlap, the near one lays a soft shadow
 *                     on the far one, and the pair reads as two objects a few
 *                     centimetres apart rather than one flat shape
 *
 * The last is the one that is usually missing from a light renderer, and it is
 * done here without a shadow map: every body in a row is the same shape in the
 * same plane, so the shadow it casts on its neighbour is one ray against one
 * rounded rectangle, which is an equation rather than a pass.
 */

const vertex = /* glsl */ `
  attribute vec3 aPrev;
  attribute vec3 aNext;
  attribute float aVary;

  varying vec3 vWorld;
  varying vec3 vCentre;
  varying vec3 vNormal;
  varying vec3 vLocal;
  varying vec3 vLocalNormal;
  varying vec3 vPrev;
  varying vec3 vNext;
  varying float vVary;

  void main() {
    vLocal = position;
    vLocalNormal = normal;
    vPrev = aPrev;
    vNext = aNext;
    vVary = aVary;

    mat4 place = modelMatrix;
    #ifdef USE_INSTANCING
      place = modelMatrix * instanceMatrix;
    #endif

    vec4 world = place * vec4(position, 1.0);
    vWorld = world.xyz;
    vCentre = place[3].xyz;
    vNormal = normalize(mat3(place) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColour;
  uniform vec3 uLightAt[3];
  uniform vec3 uLightColour[3];
  uniform float uLightLevel[3];
  uniform float uLightSize[3];
  uniform float uScale;   // the unit the lights are placed in
  uniform float uBody;    // and the body's own reach, which is a different one

  uniform float uAmbient;
  uniform vec3 uSky;
  uniform vec3 uGround;

  uniform float uTranslucency;
  uniform float uScatter;
  uniform float uWrap;
  uniform float uFalloff;
  uniform float uRoughness;
  uniform float uCoat;
  uniform float uContrast;

  uniform vec3 uFace;
  uniform vec3 uRight;
  uniform vec3 uUp;
  uniform vec2 uFootprint;
  uniform float uCorner;
  uniform float uShade;
  uniform float uOcclusion;

  uniform sampler2D uArt;
  uniform float uArtOn;
  uniform vec2 uArtSize;

  varying vec3 vWorld;
  varying vec3 vCentre;
  varying vec3 vNormal;
  varying vec3 vLocal;
  varying vec3 vLocalNormal;
  varying vec3 vPrev;
  varying vec3 vNext;
  varying float vVary;

  /*
   * What a light and a sheet are worth.
   *
   * The levels in a look are the app's, and the app spends eight passes turning
   * them into a picture. These two numbers are the whole of what is left of
   * that: a matte surface returns a fraction of what falls on it, and a
   * hemisphere of sheet is worth rather less than a lamp pointed at you. They
   * are set so that the app's own reference look comes out at the app's own
   * brightness, which is the only thing they are for.
   */
  const float LAMP = 0.32;
  const float SHEET = 0.42;

  /* The body's footprint seen flat: a rounded rectangle, which is a disc when
     the rectangle has no sides. One equation covers a plate and a card. */
  float footprint(vec2 p) {
    vec2 d = abs(p) - uFootprint;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uCorner;
  }

  /* Whether the neighbour at that offset stands between this point and the light.
     One over the whole body, since every body in the row shares its plane. */
  float shadowed(vec3 point, vec3 towards, vec3 offset, float soft) {
    if (dot(offset, offset) < 1e-6) return 1.0;
    vec3 centre = vCentre + offset;
    float slant = dot(towards, uFace);
    if (abs(slant) < 1e-3) return 1.0;
    float travel = dot(centre - point, uFace) / slant;
    if (travel <= 0.002 * uBody) return 1.0;
    vec3 across = (point + towards * travel) - centre;
    float edge = footprint(vec2(dot(across, uRight), dot(across, uUp)));
    /* The further the light has to travel to the blocker, and the wider the
       source, the softer the edge of what it casts. */
    float blur = uBody * (0.02 + soft * 0.35) + travel * soft * 0.25;
    return smoothstep(-blur, blur, edge);
  }

  /* How much of the sky a point loses to the body standing next to it. */
  float crowded(vec3 point, vec3 normal, vec3 offset) {
    if (dot(offset, offset) < 1e-6) return 0.0;
    vec3 towards = normalize(offset);
    float facing = smoothstep(0.0, 0.5, dot(towards, normal));
    if (facing <= 0.0) return 0.0;
    vec3 across = (point + offset) - (vCentre + offset);
    float edge = footprint(vec2(dot(across, uRight), dot(across, uUp)));
    float inside = 1.0 - smoothstep(-uBody * 0.05, uBody * 0.15, edge);
    float gap = 1.0 - smoothstep(0.0, uBody * 0.9, abs(dot(offset, uFace)));
    return facing * inside * gap;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 eye = normalize(cameraPosition - vWorld);
    /* Two-sided: the inside of a basket and the back of a plate are both
       surfaces you can see, and a normal pointing away from you there is the
       model's business rather than the light's. */
    if (dot(normal, eye) < 0.0) normal = -normal;

    vec3 body = uColour * (1.0 + vVary * 0.012);
    if (uArtOn > 0.5 && abs(vLocalNormal.y) > 0.55 && vLocal.y > 0.0) {
      vec2 uv = vec2(
        vLocal.x / uArtSize.x + 0.5,
        0.5 - vLocal.z / uArtSize.y
      );
      vec4 art = texture2D(uArt, uv);
      body = mix(body, art.rgb, art.a);
    }

    vec3 light = vec3(0.0);
    vec3 through = vec3(0.0);
    vec3 sheen = vec3(0.0);

    for (int i = 0; i < 3; i++) {
      float level = uLightLevel[i];
      if (level <= 0.001) continue;
      vec3 towards = uLightAt[i] - vWorld;
      float far = length(towards) / uScale;
      towards /= max(length(towards), 1e-4);
      float reach = level / max(far * far, 0.05);
      float soft = uLightSize[i];

      float shade = 1.0;
      if (uShade > 0.001) {
        shade = min(
          shadowed(vWorld, towards, vPrev, soft),
          shadowed(vWorld, towards, vNext, soft)
        );
        shade = mix(1.0, shade, uShade);
      }

      /* A wide source lights past the horizon: the terminator is wrapped by as
         much as the source is broad, which is the whole of why these bodies
         have no hard edge anywhere on them. */
      float lambert = dot(normal, towards);
      float bend = soft * 0.6;
      float wrapped = clamp((lambert + bend) / (1.0 + bend), 0.0, 1.0);
      light += uLightColour[i] * reach * wrapped * shade * LAMP;

      /* And out the other side. The normal is bent into the light before the
         view is asked, which is what spreads the glow round the form instead
         of leaving it a rim on the silhouette. */
      vec3 back = normalize(-towards - normal * uWrap);
      float seen = pow(clamp(dot(eye, back), 0.0, 1.0), max(uFalloff, 0.1));
      through += uLightColour[i] * reach * LAMP * (seen + uScatter) *
                 clamp(-lambert + uScatter, 0.0, 1.0) * mix(1.0, shade, 0.5);

      if (uRoughness < 0.99) {
        vec3 halfway = normalize(towards + eye);
        float gloss = pow(2.0, 12.0 * (1.0 - uRoughness));
        sheen += uLightColour[i] * reach * shade *
                 pow(clamp(dot(normal, halfway), 0.0, 1.0), gloss) *
                 (1.0 - uRoughness) * (0.25 + uCoat);
      }
    }

    /* The sheet is the room. A body is paler where it faces the light end of
       the gradient and cooler where it faces the other, which is most of the
       modelling on a matte white thing. */
    vec3 sky = mix(uGround, uSky, normal.y * 0.5 + 0.5);
    float open = 1.0 - uOcclusion * 0.55 * clamp(
      crowded(vWorld, normal, vPrev) + crowded(vWorld, normal, vNext), 0.0, 1.0);
    vec3 ambient = sky * uAmbient * SHEET * open;

    vec3 colour = body * (light + ambient) + body * through * uTranslucency + sheen;

    /* Pivoted about middle grey, so turning it up does not turn the picture
       into a silhouette. */
    colour = mix(vec3(0.18), colour, uContrast);

    gl_FragColor = vec4(max(colour, 0.0), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** A body's surface, ready to be handed the numbers a look asks for. */
export function surfaceMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    uniforms: {
      uColour: { value: new THREE.Color(1, 1, 1) },
      uLightAt: {
        value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
      },
      uLightColour: {
        value: [new THREE.Color(), new THREE.Color(), new THREE.Color()],
      },
      uLightLevel: { value: [0, 0, 0] },
      uLightSize: { value: [0.35, 0.6, 0.25] },
      uScale: { value: 1 },
      uBody: { value: 1 },
      uAmbient: { value: 1.4 },
      uSky: { value: new THREE.Color() },
      uGround: { value: new THREE.Color() },
      uTranslucency: { value: 0.72 },
      uScatter: { value: 0.26 },
      uWrap: { value: 0.23 },
      uFalloff: { value: 3.3 },
      uRoughness: { value: 1 },
      uCoat: { value: 0 },
      uContrast: { value: 1.05 },
      uFace: { value: new THREE.Vector3(0, 0, 1) },
      uRight: { value: new THREE.Vector3(1, 0, 0) },
      uUp: { value: new THREE.Vector3(0, 1, 0) },
      uFootprint: { value: new THREE.Vector2(0, 0) },
      uCorner: { value: 1.07 },
      uShade: { value: 1 },
      uOcclusion: { value: 1 },
      uArt: { value: null },
      uArtOn: { value: 0 },
      uArtSize: { value: new THREE.Vector2(1, 1) },
    },
  });
}
