// レンダラー・ポストエフェクト・空・ライティング
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { G } from './state.js';

const FinalShader = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uDamage: { value: 0 }, uLowHealth: { value: 0 },
    uVignette: { value: 0.35 }, uGrain: { value: 0.035 }, uSat: { value: 1.05 }, uContrast: { value: 1.08 },
    uLift: { value: new THREE.Vector3(0, 0, 0) }, uGain: { value: new THREE.Vector3(1, 1, 1) },
    uZone: { value: 0 }, uFlash: { value: 0 }, uKill: { value: 0 }, uAberr: { value: 0.0015 }, uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime,uDamage,uLowHealth,uVignette,uGrain,uSat,uContrast,uZone,uFlash,uAberr,uKill;
    uniform vec3 uLift,uGain; uniform vec2 uRes; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 uv=vUv; vec2 c=uv-0.5; float r=length(c);
      float ab=uAberr+uDamage*0.012+uKill*0.006;
      vec3 col;
      col.r=texture2D(tDiffuse,uv+c*ab).r; col.g=texture2D(tDiffuse,uv).g; col.b=texture2D(tDiffuse,uv-c*ab).b;
      // グレーディング
      col=col*uGain+uLift*(1.0-col);
      float l=dot(col,vec3(0.2126,0.7152,0.0722));
      col=mix(vec3(l),col,uSat*(1.0-uLowHealth*0.75));
      col=(col-0.18)*uContrast+0.18; col=max(col,0.0);
      // ゾーン外
      col=mix(col,col*vec3(0.75,0.55,1.3)+vec3(0.05,0.0,0.12),uZone*0.7);
      // 被弾ビネット（赤）
      float edge=smoothstep(0.25,0.85,r);
      col=mix(col,vec3(0.35,0.0,0.0)+col*0.3,edge*clamp(uDamage*1.2+uLowHealth*0.55*(0.75+0.25*sin(uTime*6.0)),0.0,0.9));
      col+=vec3(1.0,0.55,0.25)*uKill*0.22*smoothstep(0.35,0.9,r);
      col*=1.0+uKill*0.08;
      col*=1.0-uVignette*smoothstep(0.3,0.95,r);
      col+=uFlash;
      col+=(hash(uv*uRes+fract(uTime)*100.0)-0.5)*uGrain*(0.5+l);
      gl_FragColor=vec4(col,1.0);
    }`,
};

export class Engine {
  constructor(canvas) {
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.info.autoReset = false;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(85, innerWidth / innerHeight, 0.05, 1500);
    this.camera.rotation.order = 'YXZ';
    this.vmScene = new THREE.Scene();
    this.vmCamera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.01, 20);
    this.scene.add(this.camera);
    this.pmrem = new THREE.PMREMGenerator(r);

    // ライト
    this.hemi = new THREE.HemisphereLight(0xbfd4ff, 0x4a3c2c, 0.6);
    this.sun = new THREE.DirectionalLight(0xffeedd, 3);
    this.sun.castShadow = true;
    const sc = this.sun.shadow.camera;
    sc.left = -70; sc.right = 70; sc.top = 70; sc.bottom = -70; sc.near = 1; sc.far = 600;
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.04;
    this.scene.add(this.hemi, this.sun, this.sun.target);
    this.sunDir = new THREE.Vector3(0.5, 0.8, 0.3).normalize();
    // ビューモデル用ライト
    this.vmHemi = new THREE.HemisphereLight(0xbfd4ff, 0x4a3c2c, 0.8);
    this.vmSun = new THREE.DirectionalLight(0xffeedd, 2.2);
    this.vmScene.add(this.vmHemi, this.vmSun, this.vmSun.target, this.vmCamera);
    this.vmFlash = new THREE.PointLight(0xffaa55, 0, 3, 2);
    this.vmScene.add(this.vmFlash);
    this.vmLamp = new THREE.PointLight(0xfff0e0, 0, 2, 1.5); this.vmLamp.position.set(0.3, 0.15, 0.1);
    this.vmScene.add(this.vmLamp);

    this.shake = 0; this.shakeT = 0;
    this.buildComposer();
    addEventListener('resize', () => this.resize());
  }
  buildComposer() {
    const q = G.settings.quality;
    const r = this.renderer;
    const dpr = Math.min(devicePixelRatio || 1, [0.75, 1, 1.25, 1.75][q]);
    r.setPixelRatio(dpr);
    r.setSize(innerWidth, innerHeight);
    r.shadowMap.enabled = q > 0;
    const sz = [512, 1024, 2048, 4096][q];
    if (this.sun.shadow.mapSize.x !== sz) {
      this.sun.shadow.mapSize.set(sz, sz);
      if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
    }
    if (this.composer) this.composer.dispose();
    const rt = new THREE.WebGLRenderTarget(innerWidth * dpr, innerHeight * dpr, { type: THREE.HalfFloatType, samples: q >= 2 ? 4 : 0 });
    const c = this.composer = new EffectComposer(r, rt);
    c.setPixelRatio(dpr); c.setSize(innerWidth, innerHeight);
    this.worldPass = new RenderPass(this.scene, this.camera);
    c.addPass(this.worldPass);
    this.vmPass = new RenderPass(this.vmScene, this.vmCamera);
    this.vmPass.clear = false; this.vmPass.clearDepth = true;
    c.addPass(this.vmPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.45, 0.5, 0.85);
    this.bloom.enabled = q >= 1;
    c.addPass(this.bloom);
    this.final = new ShaderPass(FinalShader);
    c.addPass(this.final);
    c.addPass(new OutputPass());
    this.final.uniforms.uRes.value.set(innerWidth, innerHeight);
  }
  resize() {
    this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix();
    this.vmCamera.aspect = innerWidth / innerHeight; this.vmCamera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.composer.setSize(innerWidth, innerHeight);
    this.final.uniforms.uRes.value.set(innerWidth, innerHeight);
  }

  // 空と環境
  setEnvironment(env) {
    this.env = env;
    const s = this.scene;
    if (this.sky) { s.remove(this.sky); this.sky.geometry.dispose(); this.sky.material.dispose(); }
    this.sunDir.copy(env.sunDir).normalize();
    const sky = this.sky = makeSky(env);
    s.add(sky);
    s.fog = new THREE.FogExp2(env.fog, env.fogDensity);
    this.hemi.color.set(env.hemiSky); this.hemi.groundColor.set(env.hemiGround); this.hemi.intensity = env.hemiInt;
    this.sun.color.set(env.sunColor); this.sun.intensity = env.sunInt;
    this.vmHemi.color.set(env.hemiSky); this.vmHemi.groundColor.set(env.hemiGround); this.vmHemi.intensity = env.hemiInt * 1.3 + 0.3;
    this.vmSun.color.set(env.sunColor); this.vmSun.intensity = Math.max(0.8, env.sunInt * 0.8);
    this.renderer.toneMappingExposure = env.exposure;
    // 環境マップ
    const envScene = new THREE.Scene();
    const skyC = makeSky(env, true); envScene.add(skyC);
    if (this.envRT) this.envRT.dispose();
    this.envRT = this.pmrem.fromScene(envScene, 0.02);
    s.environment = this.envRT.texture;
    s.environmentIntensity = env.envInt ?? 0.6;
    this.vmScene.environment = this.envRT.texture;
    this.vmScene.environmentIntensity = (env.envInt ?? 0.6) * 1.2 + 0.2;
    skyC.geometry.dispose(); skyC.material.dispose();
    const u = this.final.uniforms;
    u.uLift.value.set(...(env.lift || [0, 0, 0])); u.uGain.value.set(...(env.gain || [1, 1, 1]));
    u.uSat.value = env.sat ?? 1.05; u.uContrast.value = env.contrast ?? 1.08; u.uVignette.value = env.vignette ?? 0.35;
    this.bloom.strength = env.bloom ?? 0.45; this.bloom.threshold = env.bloomThreshold ?? 0.85;
  }
  updateShadow(center) {
    const d = this.sunDir;
    // テクセルスナップでシャドウのちらつきを抑制
    const step = 140 / this.sun.shadow.mapSize.x;
    const cx = Math.round(center.x / step) * step, cz = Math.round(center.z / step) * step;
    this.sun.target.position.set(cx, center.y, cz);
    this.sun.position.set(cx + d.x * 250, center.y + d.y * 250, cz + d.z * 250);
    this.vmSun.position.copy(d).multiplyScalar(5);
    if (this.sky) this.sky.position.copy(this.camera.position);
  }
  addShake(v) { this.shake = Math.min(1.5, this.shake + v * G.settings.cameraShake); }
  render(dt) {
    const u = this.final.uniforms;
    u.uTime.value += dt;
    if (this.sky) this.sky.material.uniforms.uTime.value += dt;
    u.uFlash.value = Math.max(0, u.uFlash.value - dt * 3);
    u.uKill.value = Math.max(0, u.uKill.value - dt * 3.5);
    this.vmFlash.intensity = Math.max(0, this.vmFlash.intensity - dt * 60);
    this.renderer.info.reset();
    this.composer.render(dt);
  }
}

function makeSky(env, forEnv = false) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(env.skyTop) }, uHorizon: { value: new THREE.Color(env.skyHorizon) }, uBottom: { value: new THREE.Color(env.skyBottom || env.fog) },
      uSunDir: { value: env.sunDir.clone().normalize() }, uSunColor: { value: new THREE.Color(env.sunDisk || env.sunColor) },
      uSunSize: { value: env.sunSize ?? 0.9995 }, uStars: { value: env.stars ?? 0 }, uClouds: { value: env.clouds ?? 0.4 },
      uCloudColor: { value: new THREE.Color(env.cloudColor || '#ffffff') }, uTime: { value: 0 }, uMoon: { value: env.moon ? 1 : 0 },
      uHdr: { value: env.skyHdr ?? 1.0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir=normalize(position); vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position=p.xyww; }`,
    fragmentShader: `
      uniform vec3 uTop,uHorizon,uBottom,uSunDir,uSunColor,uCloudColor; uniform float uSunSize,uStars,uClouds,uTime,uMoon,uHdr; varying vec3 vDir;
      float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
      float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.03; a*=0.5; } return s; }
      void main(){
        vec3 d=normalize(vDir); float y=d.y;
        vec3 col = y>0.0 ? mix(uHorizon,uTop,pow(clamp(y,0.0,1.0),0.55)) : mix(uHorizon,uBottom,clamp(-y*4.0,0.0,1.0));
        float sd=dot(d,normalize(uSunDir));
        float gk = uMoon>0.5 ? 0.25 : 1.0;
        col+=uSunColor*pow(max(sd,0.0),8.0)*0.35*gk;
        col+=uSunColor*pow(max(sd,0.0),120.0)*0.8*gk;
        float disk=smoothstep(uSunSize,uSunSize+0.0003,sd);
        col+= uMoon>0.5 ? uSunColor*disk*1.5 : uSunColor*disk*18.0;
        if(uStars>0.0 && y>0.0){ vec2 sp=d.xz/(y+0.3)*180.0; float st=step(0.9975,h(floor(sp))); col+=vec3(st)*uStars*smoothstep(0.0,0.3,y)*(0.6+0.4*sin(uTime*3.0+h(floor(sp))*40.0)); }
        if(uClouds>0.0 && y>0.0){ vec2 cp=d.xz/(y+0.12)*1.6+vec2(uTime*0.004,0.0); float c=fbm(cp); c=smoothstep(0.45-uClouds*0.25,0.85,c); col=mix(col,uCloudColor*(0.75+0.35*max(sd,0.0)),c*smoothstep(0.0,0.2,y)*0.9); }
        gl_FragColor=vec4(col*uHdr,1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(forEnv ? 100 : 1000, 32, 16), mat);
  m.frustumCulled = false; m.renderOrder = -1;
  return m;
}
