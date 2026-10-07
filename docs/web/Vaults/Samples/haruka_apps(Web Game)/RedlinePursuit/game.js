(()=>{var Zf=0,Ql=1,$f=2;var Du=1,cl=2,$n=3,pi=0,Ze=1,Oe=2;var Fn=0,fi=1,ke=2,jl=3,th=4,Jf=5,Li=100,Kf=101,Qf=102,eh=103,nh=104,jf=200,td=201,ed=202,nd=203,mc=204,gc=205,id=206,sd=207,rd=208,od=209,ad=210,cd=211,ld=212,hd=213,ud=214,fd=0,dd=1,pd=2,po=3,md=4,gd=5,xd=6,vd=7,Uu=0,yd=1,_d=2,di=0,ll=1,hl=2,ul=3,Er=4,Md=5,fl=6;var Nu=300,bs=301,Ss=302,xc=303,vc=304,Ko=306,fr=1e3,wn=1001,yc=1002,Fe=1003,ih=1004;var Ua=1005;var vn=1006,bd=1007;var dr=1008;var An=1009,Sd=1010,Ed=1011,dl=1012,zu=1013,hi=1014,ui=1015,hn=1016,Fu=1017,Bu=1018,Ni=1020,wd=1021,Tn=1023,Td=1024,Ad=1025,zi=1026,Es=1027,Rd=1028,Ou=1029,Cd=1030,ku=1031,Hu=1033,Na=33776,za=33777,Fa=33778,Ba=33779,sh=35840,rh=35841,oh=35842,ah=35843,Vu=36196,ch=37492,lh=37496,hh=37808,uh=37809,fh=37810,dh=37811,ph=37812,mh=37813,gh=37814,xh=37815,vh=37816,yh=37817,_h=37818,Mh=37819,bh=37820,Sh=37821,Oa=36492,Eh=36494,wh=36495,Pd=36283,Th=36284,Ah=36285,Rh=36286;var mo=2300,go=2301,ka=2302,Ch=2400,Ph=2401,Ih=2402;var Gu=3e3,Fi=3001,Id=3200,Ld=3201,Wu=0,Dd=1,yn="",Se="srgb",Qn="srgb-linear",pl="display-p3",Qo="display-p3-linear",xo="linear",le="srgb",vo="rec709",yo="p3";var Ji=7680;var Lh=519,Ud=512,Nd=513,zd=514,Xu=515,Fd=516,Bd=517,Od=518,kd=519,_c=35044,yi=35048;var Dh="300 es",Mc=1035,Kn=2e3,_o=2001,mi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Uh=1234567,rr=Math.PI/180,ws=180/Math.PI;function Bn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qe[s&255]+qe[s>>8&255]+qe[s>>16&255]+qe[s>>24&255]+"-"+qe[t&255]+qe[t>>8&255]+"-"+qe[t>>16&15|64]+qe[t>>24&255]+"-"+qe[e&63|128]+qe[e>>8&255]+"-"+qe[e>>16&255]+qe[e>>24&255]+qe[n&255]+qe[n>>8&255]+qe[n>>16&255]+qe[n>>24&255]).toLowerCase()}function Ue(s,t,e){return Math.max(t,Math.min(e,s))}function ml(s,t){return(s%t+t)%t}function Hd(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Vd(s,t,e){return s!==t?(e-s)/(t-s):0}function or(s,t,e){return(1-e)*s+e*t}function Gd(s,t,e,n){return or(s,t,1-Math.exp(-e*n))}function Wd(s,t=1){return t-Math.abs(ml(s,t*2)-t)}function Xd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function qd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Yd(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Zd(s,t){return s+Math.random()*(t-s)}function $d(s){return s*(.5-Math.random())}function Jd(s){s!==void 0&&(Uh=s);let t=Uh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Kd(s){return s*rr}function Qd(s){return s*ws}function bc(s){return(s&s-1)===0&&s!==0}function jd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Mo(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function tp(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*h,c*u,c*f,a*l);break;case"YZY":s.set(c*f,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*f,a*h,a*l);break;case"XZX":s.set(a*h,c*g,c*d,a*l);break;case"YXY":s.set(c*d,a*h,c*g,a*l);break;case"ZYZ":s.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function zn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function re(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var gl={DEG2RAD:rr,RAD2DEG:ws,generateUUID:Bn,clamp:Ue,euclideanModulo:ml,mapLinear:Hd,inverseLerp:Vd,lerp:or,damp:Gd,pingpong:Wd,smoothstep:Xd,smootherstep:qd,randInt:Yd,randFloat:Zd,randFloatSpread:$d,seededRandom:Jd,degToRad:Kd,radToDeg:Qd,isPowerOfTwo:bc,ceilPowerOfTwo:jd,floorPowerOfTwo:Mo,setQuaternionFromProperEuler:tp,normalize:re,denormalize:zn},tt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Yt=class s{constructor(t,e,n,i,r,o,a,c,l){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],x=i[0],m=i[3],p=i[6],y=i[1],v=i[4],M=i[7],R=i[2],S=i[5],T=i[8];return r[0]=o*x+a*y+c*R,r[3]=o*m+a*v+c*S,r[6]=o*p+a*M+c*T,r[1]=l*x+h*y+u*R,r[4]=l*m+h*v+u*S,r[7]=l*p+h*M+u*T,r[2]=f*x+d*y+g*R,r[5]=f*m+d*v+g*S,r[8]=f*p+d*M+g*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,g=e*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=u*x,t[1]=(i*l-h*n)*x,t[2]=(a*n-i*o)*x,t[3]=f*x,t[4]=(h*e-i*c)*x,t[5]=(i*r-a*e)*x,t[6]=d*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ha.makeScale(t,e)),this}rotate(t){return this.premultiply(Ha.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ha.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ha=new Yt;function qu(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function bo(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ep(){let s=bo("canvas");return s.style.display="block",s}var Nh={};function ar(s){s in Nh||(Nh[s]=!0,console.warn(s))}var zh=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Fh=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Nr={[Qn]:{transfer:xo,primaries:vo,toReference:s=>s,fromReference:s=>s},[Se]:{transfer:le,primaries:vo,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Qo]:{transfer:xo,primaries:yo,toReference:s=>s.applyMatrix3(Fh),fromReference:s=>s.applyMatrix3(zh)},[pl]:{transfer:le,primaries:yo,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Fh),fromReference:s=>s.applyMatrix3(zh).convertLinearToSRGB()}},np=new Set([Qn,Qo]),ee={enabled:!0,_workingColorSpace:Qn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!np.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;let n=Nr[t].toReference,i=Nr[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Nr[s].primaries},getTransfer:function(s){return s===yn?xo:Nr[s].transfer}};function _s(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Va(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ki,So=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ki===void 0&&(Ki=bo("canvas")),Ki.width=t.width,Ki.height=t.height;let n=Ki.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ki}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=bo("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=_s(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(_s(e[n]/255)*255):e[n]=_s(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},ip=0,Eo=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Bn(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Ga(i[o].image)):r.push(Ga(i[o]))}else r=Ga(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ga(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?So.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var sp=0,un=class s extends mi{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=wn,i=wn,r=vn,o=dr,a=Tn,c=An,l=s.DEFAULT_ANISOTROPY,h=yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=Bn(),this.name="",this.source=new Eo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Fi?Se:yn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Nu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case fr:t.x=t.x-Math.floor(t.x);break;case wn:t.x=t.x<0?0:1;break;case yc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case fr:t.y=t.y-Math.floor(t.y);break;case wn:t.y=t.y<0?0:1;break;case yc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Se?Fi:Gu}set encoding(t){ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Fi?Se:yn}};un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=Nu;un.DEFAULT_ANISOTROPY=1;var de=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(l+1)/2,M=(d+1)/2,R=(p+1)/2,S=(h+f)/4,T=(u+x)/4,D=(g+m)/4;return v>M&&v>R?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=S/n,r=T/n):M>R?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=S/i,r=D/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=T/r,i=D/r),this.set(n,i,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-x)/y,this.z=(f-h)/y,this.w=Math.acos((l+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Sc=class extends mi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);let i={width:t,height:e,depth:1};n.encoding!==void 0&&(ar("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Fi?Se:yn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new un(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Eo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},He=class extends Sc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},wo=class extends un{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ec=class extends un{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var fn=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=x;return}if(u!==x||c!==f||l!==d||h!==g){let m=1-a,p=c*f+l*d+h*g+u*x,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){let R=Math.sqrt(v),S=Math.atan2(R,p*y);m=Math.sin(m*S)/R,a=Math.sin(a*S)/R}let M=a*y;if(c=c*m+f*M,l=l*m+d*M,h=h*m+g*M,u=u*m+x*M,m===1-a){let R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-a*d,t[e+2]=l*g+h*d+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),f=c(n/2),d=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+l)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ue(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Bh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Bh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Wa.copy(this).projectOnVector(t),this.sub(Wa)}reflect(t){return this.sub(Wa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Wa=new P,Bh=new fn,jn=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,bn):bn.fromBufferAttribute(r,o),bn.applyMatrix4(t.matrixWorld),this.expandByPoint(bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zr.copy(n.boundingBox)),zr.applyMatrix4(t.matrixWorld),this.union(zr)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,bn),bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($s),Fr.subVectors(this.max,$s),Qi.subVectors(t.a,$s),ji.subVectors(t.b,$s),ts.subVectors(t.c,$s),ri.subVectors(ji,Qi),oi.subVectors(ts,ji),Ai.subVectors(Qi,ts);let e=[0,-ri.z,ri.y,0,-oi.z,oi.y,0,-Ai.z,Ai.y,ri.z,0,-ri.x,oi.z,0,-oi.x,Ai.z,0,-Ai.x,-ri.y,ri.x,0,-oi.y,oi.x,0,-Ai.y,Ai.x,0];return!Xa(e,Qi,ji,ts,Fr)||(e=[1,0,0,0,1,0,0,0,1],!Xa(e,Qi,ji,ts,Fr))?!1:(Br.crossVectors(ri,oi),e=[Br.x,Br.y,Br.z],Xa(e,Qi,ji,ts,Fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Wn=[new P,new P,new P,new P,new P,new P,new P,new P],bn=new P,zr=new jn,Qi=new P,ji=new P,ts=new P,ri=new P,oi=new P,Ai=new P,$s=new P,Fr=new P,Br=new P,Ri=new P;function Xa(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ri.fromArray(s,r);let a=i.x*Math.abs(Ri.x)+i.y*Math.abs(Ri.y)+i.z*Math.abs(Ri.z),c=t.dot(Ri),l=e.dot(Ri),h=n.dot(Ri);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var rp=new jn,Js=new P,qa=new P,Rn=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):rp.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);let e=Js.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Js,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(qa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(qa)),this.expandByPoint(Js.copy(t.center).sub(qa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Xn=new P,Ya=new P,Or=new P,ai=new P,Za=new P,kr=new P,$a=new P,To=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xn.copy(this.origin).addScaledVector(this.direction,e),Xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ya.copy(t).add(e).multiplyScalar(.5),Or.copy(e).sub(t).normalize(),ai.copy(this.origin).sub(Ya);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Or),a=ai.dot(this.direction),c=-ai.dot(Or),l=ai.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){let x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ya).addScaledVector(Or,f),d}intersectSphere(t,e){Xn.subVectors(t.center,this.origin);let n=Xn.dot(this.direction),i=Xn.dot(Xn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,i=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,i=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Xn)!==null}intersectTriangle(t,e,n,i,r){Za.subVectors(e,t),kr.subVectors(n,t),$a.crossVectors(Za,kr);let o=this.direction.dot($a),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ai.subVectors(this.origin,t);let c=a*this.direction.dot(kr.crossVectors(ai,kr));if(c<0)return null;let l=a*this.direction.dot(Za.cross(ai));if(l<0||c+l>o)return null;let h=-a*ai.dot($a);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kt=class s{constructor(t,e,n,i,r,o,a,c,l,h,u,f,d,g,x,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,f,d,g,x,m)}set(t,e,n,i,r,o,a,c,l,h,u,f,d,g,x,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/es.setFromMatrixColumn(t,0).length(),r=1/es.setFromMatrixColumn(t,1).length(),o=1/es.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let f=o*h,d=o*u,g=a*h,x=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-x*l,e[9]=-a*c,e[2]=x-f*l,e[6]=g+d*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,d=c*u,g=l*h,x=l*u;e[0]=f+x*a,e[4]=g*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=x+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,d=c*u,g=l*h,x=l*u;e[0]=f-x*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=x-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,d=o*u,g=a*h,x=a*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+x,e[1]=c*u,e[5]=x*l+f,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,d=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=x-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-x*u}else if(t.order==="XZY"){let f=o*c,d=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+x,e[5]=o*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(op,t,ap)}lookAt(t,e,n){let i=this.elements;return cn.subVectors(t,e),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),ci.crossVectors(n,cn),ci.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),ci.crossVectors(n,cn)),ci.normalize(),Hr.crossVectors(cn,ci),i[0]=ci.x,i[4]=Hr.x,i[8]=cn.x,i[1]=ci.y,i[5]=Hr.y,i[9]=cn.y,i[2]=ci.z,i[6]=Hr.z,i[10]=cn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],x=n[6],m=n[10],p=n[14],y=n[3],v=n[7],M=n[11],R=n[15],S=i[0],T=i[4],D=i[8],_=i[12],b=i[1],U=i[5],L=i[9],H=i[13],I=i[2],z=i[6],O=i[10],K=i[14],Q=i[3],Z=i[7],X=i[11],Y=i[15];return r[0]=o*S+a*b+c*I+l*Q,r[4]=o*T+a*U+c*z+l*Z,r[8]=o*D+a*L+c*O+l*X,r[12]=o*_+a*H+c*K+l*Y,r[1]=h*S+u*b+f*I+d*Q,r[5]=h*T+u*U+f*z+d*Z,r[9]=h*D+u*L+f*O+d*X,r[13]=h*_+u*H+f*K+d*Y,r[2]=g*S+x*b+m*I+p*Q,r[6]=g*T+x*U+m*z+p*Z,r[10]=g*D+x*L+m*O+p*X,r[14]=g*_+x*H+m*K+p*Y,r[3]=y*S+v*b+M*I+R*Q,r[7]=y*T+v*U+M*z+R*Z,r[11]=y*D+v*L+M*O+R*X,r[15]=y*_+v*H+M*K+R*Y,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],x=t[7],m=t[11],p=t[15];return g*(+r*c*u-i*l*u-r*a*f+n*l*f+i*a*d-n*c*d)+x*(+e*c*d-e*l*f+r*o*f-i*o*d+i*l*h-r*c*h)+m*(+e*l*u-e*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-i*a*h-e*c*u+e*a*f+i*o*u-n*o*f+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],x=t[13],m=t[14],p=t[15],y=u*m*l-x*f*l+x*c*d-a*m*d-u*c*p+a*f*p,v=g*f*l-h*m*l-g*c*d+o*m*d+h*c*p-o*f*p,M=h*x*l-g*u*l+g*a*d-o*x*d-h*a*p+o*u*p,R=g*u*c-h*x*c-g*a*f+o*x*f+h*a*m-o*u*m,S=e*y+n*v+i*M+r*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/S;return t[0]=y*T,t[1]=(x*f*r-u*m*r-x*i*d+n*m*d+u*i*p-n*f*p)*T,t[2]=(a*m*r-x*c*r+x*i*l-n*m*l-a*i*p+n*c*p)*T,t[3]=(u*c*r-a*f*r-u*i*l+n*f*l+a*i*d-n*c*d)*T,t[4]=v*T,t[5]=(h*m*r-g*f*r+g*i*d-e*m*d-h*i*p+e*f*p)*T,t[6]=(g*c*r-o*m*r-g*i*l+e*m*l+o*i*p-e*c*p)*T,t[7]=(o*f*r-h*c*r+h*i*l-e*f*l-o*i*d+e*c*d)*T,t[8]=M*T,t[9]=(g*u*r-h*x*r-g*n*d+e*x*d+h*n*p-e*u*p)*T,t[10]=(o*x*r-g*a*r+g*n*l-e*x*l-o*n*p+e*a*p)*T,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*d-e*a*d)*T,t[12]=R*T,t[13]=(h*x*i-g*u*i+g*n*f-e*x*f-h*n*m+e*u*m)*T,t[14]=(g*a*i-o*x*i-g*n*c+e*x*c+o*n*m-e*a*m)*T,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*f+e*a*f)*T,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,g=r*u,x=o*h,m=o*u,p=a*u,y=c*l,v=c*h,M=c*u,R=n.x,S=n.y,T=n.z;return i[0]=(1-(x+p))*R,i[1]=(d+M)*R,i[2]=(g-v)*R,i[3]=0,i[4]=(d-M)*S,i[5]=(1-(f+p))*S,i[6]=(m+y)*S,i[7]=0,i[8]=(g+v)*T,i[9]=(m-y)*T,i[10]=(1-(f+x))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=es.set(i[0],i[1],i[2]).length(),o=es.set(i[4],i[5],i[6]).length(),a=es.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Sn.copy(this);let l=1/r,h=1/o,u=1/a;return Sn.elements[0]*=l,Sn.elements[1]*=l,Sn.elements[2]*=l,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,e.setFromRotationMatrix(Sn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Kn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),d,g;if(a===Kn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===_o)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Kn){let c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(o-r),f=(e+t)*l,d=(n+i)*h,g,x;if(a===Kn)g=(o+r)*u,x=-2*u;else if(a===_o)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},es=new P,Sn=new Kt,op=new P(0,0,0),ap=new P(1,1,1),ci=new P,Hr=new P,cn=new P,Oh=new Kt,kh=new fn,Ts=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(Ue(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ue(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ue(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ue(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ue(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ue(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Oh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Oh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kh.setFromEuler(this),this.setFromQuaternion(kh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ts.DEFAULT_ORDER="XYZ";var Ao=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},cp=0,Hh=new P,ns=new fn,qn=new Kt,Vr=new P,Ks=new P,lp=new P,hp=new fn,Vh=new P(1,0,0),Gh=new P(0,1,0),Wh=new P(0,0,1),up={type:"added"},fp={type:"removed"},Ee=class s extends mi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new P,e=new Ts,n=new fn,i=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Yt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ao,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ns.setFromAxisAngle(t,e),this.quaternion.multiply(ns),this}rotateOnWorldAxis(t,e){return ns.setFromAxisAngle(t,e),this.quaternion.premultiply(ns),this}rotateX(t){return this.rotateOnAxis(Vh,t)}rotateY(t){return this.rotateOnAxis(Gh,t)}rotateZ(t){return this.rotateOnAxis(Wh,t)}translateOnAxis(t,e){return Hh.copy(t).applyQuaternion(this.quaternion),this.position.add(Hh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vh,t)}translateY(t){return this.translateOnAxis(Gh,t)}translateZ(t){return this.translateOnAxis(Wh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Vr.copy(t):Vr.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Ks,Vr,this.up):qn.lookAt(Vr,Ks,this.up),this.quaternion.setFromRotationMatrix(qn),i&&(qn.extractRotation(i.matrixWorld),ns.setFromRotationMatrix(qn),this.quaternion.premultiply(ns.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(up)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(fp)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,t,lp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,hp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++){let a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};Ee.DEFAULT_UP=new P(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var En=new P,Yn=new P,Ja=new P,Zn=new P,is=new P,ss=new P,Xh=new P,Ka=new P,Qa=new P,ja=new P,Gr=!1,Ui=class s{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),En.subVectors(t,e),i.cross(En);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){En.subVectors(i,e),Yn.subVectors(n,e),Ja.subVectors(t,e);let o=En.dot(En),a=En.dot(Yn),c=En.dot(Ja),l=Yn.dot(Yn),h=Yn.dot(Ja),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Zn)===null?!1:Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getUV(t,e,n,i,r,o,a,c){return Gr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Gr=!0),this.getInterpolation(t,e,n,i,r,o,a,c)}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,Zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Zn.x),c.addScaledVector(o,Zn.y),c.addScaledVector(a,Zn.z),c)}static isFrontFacing(t,e,n,i){return En.subVectors(n,e),Yn.subVectors(t,e),En.cross(Yn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),En.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return Gr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Gr=!0),s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;is.subVectors(i,n),ss.subVectors(r,n),Ka.subVectors(t,n);let c=is.dot(Ka),l=ss.dot(Ka);if(c<=0&&l<=0)return e.copy(n);Qa.subVectors(t,i);let h=is.dot(Qa),u=ss.dot(Qa);if(h>=0&&u<=h)return e.copy(i);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(is,o);ja.subVectors(t,r);let d=is.dot(ja),g=ss.dot(ja);if(g>=0&&d<=g)return e.copy(r);let x=d*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(ss,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Xh.subVectors(r,i),a=(u-h)/(u-h+(d-g)),e.copy(i).addScaledVector(Xh,a);let p=1/(m+x+f);return o=x*p,a=f*p,e.copy(n).addScaledVector(is,o).addScaledVector(ss,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},li={h:0,s:0,l:0},Wr={h:0,s:0,l:0};function tc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var lt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Se){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=ee.workingColorSpace){if(t=ml(t,1),e=Ue(e,0,1),n=Ue(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=tc(o,r,t+1/3),this.g=tc(o,r,t),this.b=tc(o,r,t-1/3)}return ee.toWorkingColorSpace(this,i),this}setStyle(t,e=Se){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Se){let n=Yu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}copyLinearToSRGB(t){return this.r=Va(t.r),this.g=Va(t.g),this.b=Va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Se){return ee.fromWorkingColorSpace(Ye.copy(this),t),Math.round(Ue(Ye.r*255,0,255))*65536+Math.round(Ue(Ye.g*255,0,255))*256+Math.round(Ue(Ye.b*255,0,255))}getHexString(t=Se){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(Ye.copy(this),e);let n=Ye.r,i=Ye.g,r=Ye.b,o=Math.max(n,i,r),a=Math.min(n,i,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(Ye.copy(this),e),t.r=Ye.r,t.g=Ye.g,t.b=Ye.b,t}getStyle(t=Se){ee.fromWorkingColorSpace(Ye.copy(this),t);let e=Ye.r,n=Ye.g,i=Ye.b;return t!==Se?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(li),this.setHSL(li.h+t,li.s+e,li.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(li),t.getHSL(Wr);let n=or(li.h,Wr.h,e),i=or(li.s,Wr.s,e),r=or(li.l,Wr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ye=new lt;lt.NAMES=Yu;var dp=0,ti=class extends mi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dp++}),this.uuid=Bn(),this.name="",this.type="Material",this.blending=fi,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mc,this.blendDst=gc,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new lt(0,0,0),this.blendAlpha=0,this.depthFunc=po,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==fi&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==mc&&(n.blendSrc=this.blendSrc),this.blendDst!==gc&&(n.blendDst=this.blendDst),this.blendEquation!==Li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==po&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Me=class extends ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Uu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var we=new P,Xr=new tt,Qt=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=_c,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ui,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Xr.fromBufferAttribute(this,e),Xr.applyMatrix3(t),this.setXY(e,Xr.x,Xr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=zn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=re(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zn(e,this.array)),e}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zn(e,this.array)),e}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zn(e,this.array)),e}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),i=re(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),i=re(i,this.array),r=re(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==_c&&(t.usage=this.usage),t}};var Ro=class extends Qt{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Co=class extends Qt{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var jt=class extends Qt{constructor(t,e,n){super(new Float32Array(t),e,n)}};var pp=0,xn=new Kt,ec=new Ee,rs=new P,ln=new jn,Qs=new jn,De=new P,oe=class s extends mi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qu(t)?Co:Ro)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return xn.makeRotationFromQuaternion(t),this.applyMatrix4(xn),this}rotateX(t){return xn.makeRotationX(t),this.applyMatrix4(xn),this}rotateY(t){return xn.makeRotationY(t),this.applyMatrix4(xn),this}rotateZ(t){return xn.makeRotationZ(t),this.applyMatrix4(xn),this}translate(t,e,n){return xn.makeTranslation(t,e,n),this.applyMatrix4(xn),this}scale(t,e,n){return xn.makeScale(t,e,n),this.applyMatrix4(xn),this}lookAt(t){return ec.lookAt(t),ec.updateMatrix(),this.applyMatrix4(ec.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new jt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(t){let n=this.boundingSphere.center;if(ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Qs.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(ln.min,Qs.min),ln.expandByPoint(De),De.addVectors(ln.max,Qs.max),ln.expandByPoint(De)):(ln.expandByPoint(Qs.min),ln.expandByPoint(Qs.max))}ln.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)De.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(De));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)De.fromBufferAttribute(a,l),c&&(rs.fromBufferAttribute(t,l),De.add(rs)),i=Math.max(i,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qt(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let b=0;b<a;b++)l[b]=new P,h[b]=new P;let u=new P,f=new P,d=new P,g=new tt,x=new tt,m=new tt,p=new P,y=new P;function v(b,U,L){u.fromArray(i,b*3),f.fromArray(i,U*3),d.fromArray(i,L*3),g.fromArray(o,b*2),x.fromArray(o,U*2),m.fromArray(o,L*2),f.sub(u),d.sub(u),x.sub(g),m.sub(g);let H=1/(x.x*m.y-m.x*x.y);isFinite(H)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-x.y).multiplyScalar(H),y.copy(d).multiplyScalar(x.x).addScaledVector(f,-m.x).multiplyScalar(H),l[b].add(p),l[U].add(p),l[L].add(p),h[b].add(y),h[U].add(y),h[L].add(y))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,U=M.length;b<U;++b){let L=M[b],H=L.start,I=L.count;for(let z=H,O=H+I;z<O;z+=3)v(n[z+0],n[z+1],n[z+2])}let R=new P,S=new P,T=new P,D=new P;function _(b){T.fromArray(r,b*3),D.copy(T);let U=l[b];R.copy(U),R.sub(T.multiplyScalar(T.dot(U))).normalize(),S.crossVectors(D,U);let H=S.dot(h[b])<0?-1:1;c[b*4]=R.x,c[b*4+1]=R.y,c[b*4+2]=R.z,c[b*4+3]=H}for(let b=0,U=M.length;b<U;++b){let L=M[b],H=L.start,I=L.count;for(let z=H,O=H+I;z<O;z+=3)_(n[z+0]),_(n[z+1]),_(n[z+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new P,r=new P,o=new P,a=new P,c=new P,l=new P,h=new P,u=new P;if(t)for(let f=0,d=t.count;f<d;f+=3){let g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h),d=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new Qt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},qh=new Kt,Ci=new To,qr=new Rn,Yh=new P,os=new P,as=new P,cs=new P,nc=new P,Yr=new P,Zr=new tt,$r=new tt,Jr=new tt,Zh=new P,$h=new P,Jh=new P,Kr=new P,Qr=new P,ht=class extends Ee{constructor(t=new oe,e=new Me){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Yr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(nc.fromBufferAttribute(u,t),o?Yr.addScaledVector(nc,h):Yr.addScaledVector(nc.sub(e),h))}e.add(Yr)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(r),Ci.copy(t.ray).recast(t.near),!(qr.containsPoint(Ci.origin)===!1&&(Ci.intersectSphere(qr,Yh)===null||Ci.origin.distanceToSquared(Yh)>(t.far-t.near)**2))&&(qh.copy(r).invert(),Ci.copy(t.ray).applyMatrix4(qh),!(n.boundingBox!==null&&Ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ci)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],y=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,R=v;M<R;M+=3){let S=a.getX(M),T=a.getX(M+1),D=a.getX(M+2);i=jr(this,p,t,n,l,h,u,S,T,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let y=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);i=jr(this,o,t,n,l,h,u,y,v,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],y=Math.max(m.start,d.start),v=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,R=v;M<R;M+=3){let S=M,T=M+1,D=M+2;i=jr(this,p,t,n,l,h,u,S,T,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let y=m,v=m+1,M=m+2;i=jr(this,o,t,n,l,h,u,y,v,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function mp(s,t,e,n,i,r,o,a){let c;if(t.side===Ze?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===pi,a),c===null)return null;Qr.copy(a),Qr.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(Qr);return l<e.near||l>e.far?null:{distance:l,point:Qr.clone(),object:s}}function jr(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,os),s.getVertexPosition(c,as),s.getVertexPosition(l,cs);let h=mp(s,t,e,n,os,as,cs,Kr);if(h){i&&(Zr.fromBufferAttribute(i,a),$r.fromBufferAttribute(i,c),Jr.fromBufferAttribute(i,l),h.uv=Ui.getInterpolation(Kr,os,as,cs,Zr,$r,Jr,new tt)),r&&(Zr.fromBufferAttribute(r,a),$r.fromBufferAttribute(r,c),Jr.fromBufferAttribute(r,l),h.uv1=Ui.getInterpolation(Kr,os,as,cs,Zr,$r,Jr,new tt),h.uv2=h.uv1),o&&(Zh.fromBufferAttribute(o,a),$h.fromBufferAttribute(o,c),Jh.fromBufferAttribute(o,l),h.normal=Ui.getInterpolation(Kr,os,as,cs,Zh,$h,Jh,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:c,c:l,normal:new P,materialIndex:0};Ui.getNormal(os,as,cs,u.normal),h.face=u}return h}var It=class s extends oe{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new jt(l,3)),this.setAttribute("normal",new jt(h,3)),this.setAttribute("uv",new jt(u,2));function g(x,m,p,y,v,M,R,S,T,D,_){let b=M/T,U=R/D,L=M/2,H=R/2,I=S/2,z=T+1,O=D+1,K=0,Q=0,Z=new P;for(let X=0;X<O;X++){let Y=X*U-H;for(let ct=0;ct<z;ct++){let J=ct*b-L;Z[x]=J*y,Z[m]=Y*v,Z[p]=I,l.push(Z.x,Z.y,Z.z),Z[x]=0,Z[m]=0,Z[p]=S>0?1:-1,h.push(Z.x,Z.y,Z.z),u.push(ct/T),u.push(1-X/D),K+=1}}for(let X=0;X<D;X++)for(let Y=0;Y<T;Y++){let ct=f+Y+z*X,J=f+Y+z*(X+1),nt=f+(Y+1)+z*(X+1),mt=f+(Y+1)+z*X;c.push(ct,J,mt),c.push(J,nt,mt),Q+=6}a.addGroup(d,Q,_),d+=Q,f+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function As(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function en(s){let t={};for(let e=0;e<s.length;e++){let n=As(s[e]);for(let i in n)t[i]=n[i]}return t}function gp(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Zu(s){return s.getRenderTarget()===null?s.outputColorSpace:ee.workingColorSpace}var On={clone:As,merge:en},xp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ve=class extends ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xp,this.fragmentShader=vp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=As(t.uniforms),this.uniformsGroups=gp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Po=class extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=Kn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Be=class extends Po{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ws*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(rr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(rr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(rr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ls=-90,hs=1,wc=class extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Be(ls,hs,t,e);i.layers=this.layers,this.add(i);let r=new Be(ls,hs,t,e);r.layers=this.layers,this.add(r);let o=new Be(ls,hs,t,e);o.layers=this.layers,this.add(o);let a=new Be(ls,hs,t,e);a.layers=this.layers,this.add(a);let c=new Be(ls,hs,t,e);c.layers=this.layers,this.add(c);let l=new Be(ls,hs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===_o)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Io=class extends un{constructor(t,e,n,i,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Tc=class extends He{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(ar("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Fi?Se:yn),this.texture=new Io(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new It(5,5,5),r=new ve({name:"CubemapFromEquirect",uniforms:As(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ze,blending:Fn});r.uniforms.tEquirect.value=e;let o=new ht(i,r),a=e.minFilter;return e.minFilter===dr&&(e.minFilter=vn),new wc(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},ic=new P,yp=new P,_p=new Yt,Jn=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=ic.subVectors(n,e).cross(yp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(ic),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||_p.getNormalMatrix(t),i=this.coplanarPoint(ic).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Pi=new Rn,to=new P,pr=class{constructor(t=new Jn,e=new Jn,n=new Jn,i=new Jn,r=new Jn,o=new Jn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Kn){let n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],f=i[7],d=i[8],g=i[9],x=i[10],m=i[11],p=i[12],y=i[13],v=i[14],M=i[15];if(n[0].setComponents(c-r,f-l,m-d,M-p).normalize(),n[1].setComponents(c+r,f+l,m+d,M+p).normalize(),n[2].setComponents(c+o,f+h,m+g,M+y).normalize(),n[3].setComponents(c-o,f-h,m-g,M-y).normalize(),n[4].setComponents(c-a,f-u,m-x,M-v).normalize(),e===Kn)n[5].setComponents(c+a,f+u,m+x,M+v).normalize();else if(e===_o)n[5].setComponents(a,u,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(t){return Pi.center.set(0,0,0),Pi.radius=.7071067811865476,Pi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(to.x=i.normal.x>0?t.max.x:t.min.x,to.y=i.normal.y>0?t.max.y:t.min.y,to.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(to)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function $u(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Mp(s,t){let e=t.isWebGL2,n=new WeakMap;function i(l,h){let u=l.array,f=l.usage,d=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,f),l.onUploadCallback();let x;if(u instanceof Float32Array)x=s.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=s.SHORT;else if(u instanceof Uint32Array)x=s.UNSIGNED_INT;else if(u instanceof Int32Array)x=s.INT;else if(u instanceof Int8Array)x=s.BYTE;else if(u instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:d}}function r(l,h,u){let f=h.array,d=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,l),d.count===-1&&g.length===0&&s.bufferSubData(u,0,f),g.length!==0){for(let x=0,m=g.length;x<m;x++){let p=g[x];e?s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(s.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}var Ve=class s extends oe{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,f=e/c,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let y=p*f-o;for(let v=0;v<l;v++){let M=v*u-r;g.push(M,-y,0),x.push(0,0,1),m.push(v/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<a;y++){let v=y+l*p,M=y+l*(p+1),R=y+1+l*(p+1),S=y+1+l*p;d.push(v,M,S),d.push(M,R,S)}this.setIndex(d),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},bp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Ap=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Cp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pp=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ip=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Lp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Up=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Np=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,zp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_star
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_star
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Wp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Xp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Yp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qp="gl_FragColor = linearToOutputTexel( gl_FragColor );",jp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif`,nm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,im=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,om=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,am=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,hm=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,um=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lamber
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,mm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,gm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,vm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ym=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_m=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Mm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_star
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Em=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Am=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Rm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Cm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );

	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Im=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Lm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Nm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Fm=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Om=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,km=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Wm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Xm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,qm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ym=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$m=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,t0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,e0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,n0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,i0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,r0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_star
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_star
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,o0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_star
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,a0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,c0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,l0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,h0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,u0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,d0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,p0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,m0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,g0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,x0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,M0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,b0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,R0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,C0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,P0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,I0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,L0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,D0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,U0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,N0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,z0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,B0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,O0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,k0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,V0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,G0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,W0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,X0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,q0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Z0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,J0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,K0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,j0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:bp,alphahash_pars_fragment:Sp,alphamap_fragment:Ep,alphamap_pars_fragment:wp,alphatest_fragment:Tp,alphatest_pars_fragment:Ap,aomap_fragment:Rp,aomap_pars_fragment:Cp,batching_pars_vertex:Pp,batching_vertex:Ip,begin_vertex:Lp,beginnormal_vertex:Dp,bsdfs:Up,iridescence_fragment:Np,bumpmap_pars_fragment:zp,clipping_planes_fragment:Fp,clipping_planes_pars_fragment:Bp,clipping_planes_pars_vertex:Op,clipping_planes_vertex:kp,color_fragment:Hp,color_pars_fragment:Vp,color_pars_vertex:Gp,color_vertex:Wp,common:Xp,cube_uv_reflection_fragment:qp,defaultnormal_vertex:Yp,displacementmap_pars_vertex:Zp,displacementmap_vertex:$p,emissivemap_fragment:Jp,emissivemap_pars_fragment:Kp,colorspace_fragment:Qp,colorspace_pars_fragment:jp,envmap_fragment:tm,envmap_common_pars_fragment:em,envmap_pars_fragment:nm,envmap_pars_vertex:im,envmap_physical_pars_fragment:mm,envmap_vertex:sm,fog_vertex:rm,fog_pars_vertex:om,fog_fragment:am,fog_pars_fragment:cm,gradientmap_pars_fragment:lm,lightmap_fragment:hm,lightmap_pars_fragment:um,lights_lambert_fragment:fm,lights_lambert_pars_fragment:dm,lights_pars_begin:pm,lights_toon_fragment:gm,lights_toon_pars_fragment:xm,lights_phong_fragment:vm,lights_phong_pars_fragment:ym,lights_physical_fragment:_m,lights_physical_pars_fragment:Mm,lights_fragment_begin:bm,lights_fragment_maps:Sm,lights_fragment_end:Em,logdepthbuf_fragment:wm,logdepthbuf_pars_fragment:Tm,logdepthbuf_pars_vertex:Am,logdepthbuf_vertex:Rm,map_fragment:Cm,map_pars_fragment:Pm,map_particle_fragment:Im,map_particle_pars_fragment:Lm,metalnessmap_fragment:Dm,metalnessmap_pars_fragment:Um,morphcolor_vertex:Nm,morphnormal_vertex:zm,morphtarget_pars_vertex:Fm,morphtarget_vertex:Bm,normal_fragment_begin:Om,normal_fragment_maps:km,normal_pars_fragment:Hm,normal_pars_vertex:Vm,normal_vertex:Gm,normalmap_pars_fragment:Wm,clearcoat_normal_fragment_begin:Xm,clearcoat_normal_fragment_maps:qm,clearcoat_pars_fragment:Ym,iridescence_pars_fragment:Zm,opaque_fragment:$m,packing:Jm,premultiplied_alpha_fragment:Km,project_vertex:Qm,dithering_fragment:jm,dithering_pars_fragment:t0,roughnessmap_fragment:e0,roughnessmap_pars_fragment:n0,shadowmap_pars_fragment:i0,shadowmap_pars_vertex:s0,shadowmap_vertex:r0,shadowmask_pars_fragment:o0,skinbase_vertex:a0,skinning_pars_vertex:c0,skinning_vertex:l0,skinnormal_vertex:h0,specularmap_fragment:u0,specularmap_pars_fragment:f0,tonemapping_fragment:d0,tonemapping_pars_fragment:p0,transmission_fragment:m0,transmission_pars_fragment:g0,uv_pars_fragment:x0,uv_pars_vertex:v0,uv_vertex:y0,worldpos_vertex:_0,background_vert:M0,background_frag:b0,backgroundCube_vert:S0,backgroundCube_frag:E0,cube_vert:w0,cube_frag:T0,depth_vert:A0,depth_frag:R0,distanceRGBA_vert:C0,distanceRGBA_frag:P0,equirect_vert:I0,equirect_frag:L0,linedashed_vert:D0,linedashed_frag:U0,meshbasic_vert:N0,meshbasic_frag:z0,meshlambert_vert:F0,meshlambert_frag:B0,meshmatcap_vert:O0,meshmatcap_frag:k0,meshnormal_vert:H0,meshnormal_frag:V0,meshphong_vert:G0,meshphong_frag:W0,meshphysical_vert:X0,meshphysical_frag:q0,meshtoon_vert:Y0,meshtoon_frag:Z0,points_vert:$0,points_frag:J0,shadow_vert:K0,shadow_frag:Q0,sprite_vert:j0,sprite_frag:tg},ft={common:{diffuse:{value:new lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new lt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Nn={basic:{uniforms:en([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:en([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new lt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:en([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new lt(0)},specular:{value:new lt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:en([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:en([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new lt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:en([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:en([ft.points,ft.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:en([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:en([ft.common,ft.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:en([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:en([ft.sprite,ft.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:en([ft.common,ft.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:en([ft.lights,ft.fog,{color:{value:new lt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};Nn.physical={uniforms:en([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new lt(0)},specularColor:{value:new lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var eo={r:0,b:0,g:0};function eg(s,t,e,n,i,r,o){let a=new lt(0),c=r===!0?0:1,l,h,u=null,f=0,d=null;function g(m,p){let y=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?x(a,c):v&&v.isColor&&(x(v,1),y=!0);let M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Ko)?(h===void 0&&(h=new ht(new It(1,1,1),new ve({name:"BackgroundCubeMaterial",uniforms:As(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:Ze,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ee.getTransfer(v.colorSpace)!==le,(u!==v||f!==v.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ht(new Ve(2,2),new ve({name:"BackgroundMaterial",uniforms:As(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=ee.getTransfer(v.colorSpace)!==le,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,d=s.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function x(m,p){m.getRGB(eo,Zu(s)),n.buffers.color.setClear(eo.r,eo.g,eo.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,x(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,x(a,c)},render:g}}function ng(s,t,e,n){let i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null),l=c,h=!1;function u(I,z,O,K,Q){let Z=!1;if(o){let X=x(K,O,z);l!==X&&(l=X,d(l.object)),Z=p(I,K,O,Q),Z&&y(I,K,O,Q)}else{let X=z.wireframe===!0;(l.geometry!==K.id||l.program!==O.id||l.wireframe!==X)&&(l.geometry=K.id,l.program=O.id,l.wireframe=X,Z=!0)}Q!==null&&e.update(Q,s.ELEMENT_ARRAY_BUFFER),(Z||h)&&(h=!1,D(I,z,O,K),Q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(Q).buffer))}function f(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function d(I){return n.isWebGL2?s.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?s.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function x(I,z,O){let K=O.wireframe===!0,Q=a[I.id];Q===void 0&&(Q={},a[I.id]=Q);let Z=Q[z.id];Z===void 0&&(Z={},Q[z.id]=Z);let X=Z[K];return X===void 0&&(X=m(f()),Z[K]=X),X}function m(I){let z=[],O=[],K=[];for(let Q=0;Q<i;Q++)z[Q]=0,O[Q]=0,K[Q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:O,attributeDivisors:K,object:I,attributes:{},index:null}}function p(I,z,O,K){let Q=l.attributes,Z=z.attributes,X=0,Y=O.getAttributes();for(let ct in Y)if(Y[ct].location>=0){let nt=Q[ct],mt=Z[ct];if(mt===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(mt=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(mt=I.instanceColor)),nt===void 0||nt.attribute!==mt||mt&&nt.data!==mt.data)return!0;X++}return l.attributesNum!==X||l.index!==K}function y(I,z,O,K){let Q={},Z=z.attributes,X=0,Y=O.getAttributes();for(let ct in Y)if(Y[ct].location>=0){let nt=Z[ct];nt===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(nt=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(nt=I.instanceColor));let mt={};mt.attribute=nt,nt&&nt.data&&(mt.data=nt.data),Q[ct]=mt,X++}l.attributes=Q,l.attributesNum=X,l.index=K}function v(){let I=l.newAttributes;for(let z=0,O=I.length;z<O;z++)I[z]=0}function M(I){R(I,0)}function R(I,z){let O=l.newAttributes,K=l.enabledAttributes,Q=l.attributeDivisors;O[I]=1,K[I]===0&&(s.enableVertexAttribArray(I),K[I]=1),Q[I]!==z&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,z),Q[I]=z)}function S(){let I=l.newAttributes,z=l.enabledAttributes;for(let O=0,K=z.length;O<K;O++)z[O]!==I[O]&&(s.disableVertexAttribArray(O),z[O]=0)}function T(I,z,O,K,Q,Z,X){X===!0?s.vertexAttribIPointer(I,z,O,Q,Z):s.vertexAttribPointer(I,z,O,K,Q,Z)}function D(I,z,O,K){if(n.isWebGL2===!1&&(I.isInstancedMesh||K.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();let Q=K.attributes,Z=O.getAttributes(),X=z.defaultAttributeValues;for(let Y in Z){let ct=Z[Y];if(ct.location>=0){let J=Q[Y];if(J===void 0&&(Y==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),Y==="instanceColor"&&I.instanceColor&&(J=I.instanceColor)),J!==void 0){let nt=J.normalized,mt=J.itemSize,Mt=e.get(J);if(Mt===void 0)continue;let vt=Mt.buffer,Rt=Mt.type,Ct=Mt.bytesPerElement,Et=n.isWebGL2===!0&&(Rt===s.INT||Rt===s.UNSIGNED_INT||J.gpuType===zu);if(J.isInterleavedBufferAttribute){let Dt=J.data,w=Dt.stride,V=J.offset;if(Dt.isInstancedInterleavedBuffer){for(let F=0;F<ct.locationSize;F++)R(ct.location+F,Dt.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=Dt.meshPerAttribute*Dt.count)}else for(let F=0;F<ct.locationSize;F++)M(ct.location+F);s.bindBuffer(s.ARRAY_BUFFER,vt);for(let F=0;F<ct.locationSize;F++)T(ct.location+F,mt/ct.locationSize,Rt,nt,w*Ct,(V+mt/ct.locationSize*F)*Ct,Et)}else{if(J.isInstancedBufferAttribute){for(let Dt=0;Dt<ct.locationSize;Dt++)R(ct.location+Dt,J.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Dt=0;Dt<ct.locationSize;Dt++)M(ct.location+Dt);s.bindBuffer(s.ARRAY_BUFFER,vt);for(let Dt=0;Dt<ct.locationSize;Dt++)T(ct.location+Dt,mt/ct.locationSize,Rt,nt,mt*Ct,mt/ct.locationSize*Dt*Ct,Et)}}else if(X!==void 0){let nt=X[Y];if(nt!==void 0)switch(nt.length){case 2:s.vertexAttrib2fv(ct.location,nt);break;case 3:s.vertexAttrib3fv(ct.location,nt);break;case 4:s.vertexAttrib4fv(ct.location,nt);break;default:s.vertexAttrib1fv(ct.location,nt)}}}}S()}function _(){L();for(let I in a){let z=a[I];for(let O in z){let K=z[O];for(let Q in K)g(K[Q].object),delete K[Q];delete z[O]}delete a[I]}}function b(I){if(a[I.id]===void 0)return;let z=a[I.id];for(let O in z){let K=z[O];for(let Q in K)g(K[Q].object),delete K[Q];delete z[O]}delete a[I.id]}function U(I){for(let z in a){let O=a[z];if(O[I.id]===void 0)continue;let K=O[I.id];for(let Q in K)g(K[Q].object),delete K[Q];delete O[I.id]}}function L(){H(),h=!0,l!==c&&(l=c,d(l.object))}function H(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:L,resetDefaultState:H,dispose:_,releaseStatesOfGeometry:b,releaseStatesOfProgram:U,initAttributes:v,enableAttribute:M,disableUnusedAttributes:S}}function ig(s,t,e,n){let i=n.isWebGL2,r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,f){if(f===0)return;let d,g;if(i)d=s,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,h,u,f),e.update(u,r,f)}function l(h,u,f){if(f===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{d.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let x=0;x<f;x++)g+=u[x];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function sg(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,M=o||t.has("OES_texture_float"),R=v&&M,S=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:R,maxSamples:S}}function rg(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Jn,a=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):l();else{let y=r?0:n,v=y*4,M=p.clippingState||null;c.value=M,M=h(g,f,v,d);for(let R=0;R!==v;++R)M[R]=e[R];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=c.value,g!==!0||m===null){let p=d+x*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,M=d;v!==x;++v,M+=4)o.copy(u[v]).applyMatrix4(y,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function og(s){let t=new WeakMap;function e(o,a){return a===xc?o.mapping=bs:a===vc&&(o.mapping=Ss),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===xc||a===vc)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Tc(c.height/2);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Rs=class extends Po{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},xs=4,Kh=[.125,.215,.35,.446,.526,.582],Di=20,sc=new Rs,Qh=new lt,rc=null,oc=0,ac=0,Ii=(1+Math.sqrt(5))/2,us=1/Ii,jh=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,Ii,us),new P(0,Ii,-us),new P(us,0,Ii),new P(-us,0,Ii),new P(Ii,us,0),new P(-Ii,us,0)],Cs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=eu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(rc,oc,ac),t.scissorTest=!1,no(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:hn,format:Tn,colorSpace:Qn,depthBuffer:!1},i=tu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tu(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ag(r)),this._blurMaterial=cg(r,t,e)}return i}_compileMaterial(t){let e=new ht(this._lodPlanes[0],t);this._renderer.compile(e,sc)}_sceneToCubeUV(t,e,n,i){let a=new Be(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Qh),h.toneMapping=di,h.autoClear=!1;let d=new Me({name:"PMREM.Background",side:Ze,depthWrite:!1,depthTest:!1}),g=new ht(new It,d),x=!1,m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,x=!0):(d.color.copy(Qh),x=!0);for(let p=0;p<6;p++){let y=p%3;y===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):y===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));let v=this._cubeSize;no(i,y*v,p>2?v:0,v,v),h.setRenderTarget(i),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===bs||t.mapping===Ss;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=nu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=eu());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;no(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,sc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){let r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=jh[(i-1)%jh.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ht(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Di-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):Di;m>Di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Di}`);let p=[],y=0;for(let T=0;T<Di;++T){let D=T/x,_=Math.exp(-D*D/2);p.push(_),T===0?y+=_:T<m&&(y+=2*_)}for(let T=0;T<p.length;T++)p[T]=p[T]/y;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;let M=this._sizeLods[i],R=3*M*(i>v-xs?i-v+xs:0),S=4*(this._cubeSize-M);no(e,R,S,3*M,2*M),c.setRenderTarget(e),c.render(u,sc)}};function ag(s){let t=[],e=[],n=[],i=s,r=s-xs+1+Kh.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>s-xs?c=Kh[o-s+xs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,y=new Float32Array(x*g*d),v=new Float32Array(m*g*d),M=new Float32Array(p*g*d);for(let S=0;S<d;S++){let T=S%3*2/3-1,D=S>2?0:-1,_=[T,D,0,T+2/3,D,0,T+2/3,D+1,0,T,D,0,T+2/3,D+1,0,T,D+1,0];y.set(_,x*g*S),v.set(f,m*g*S);let b=[S,S,S,S,S,S];M.set(b,p*g*S)}let R=new oe;R.setAttribute("position",new Qt(y,x)),R.setAttribute("uv",new Qt(v,m)),R.setAttribute("faceIndex",new Qt(M,p)),t.push(R),i>xs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function tu(s,t,e){let n=new He(s,t,e);return n.texture.mapping=Ko,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function no(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function cg(s,t,e){let n=new Float32Array(Di),i=new P(0,1,0);return new ve({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function eu(){return new ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function nu(){return new ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function xl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function lg(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===xc||c===vc,h=c===bs||c===Ss;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new Cs(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{let u=a.image;if(l&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new Cs(s));let f=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function hg(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ug(s,t,e,n){let i={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);for(let g in f.morphAttributes){let x=f.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)t.remove(x[m])}f.removeEventListener("dispose",o),delete i[f.id];let d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function c(u){let f=u.attributes;for(let g in f)t.update(f[g],s.ARRAY_BUFFER);let d=u.morphAttributes;for(let g in d){let x=d[g];for(let m=0,p=x.length;m<p;m++)t.update(x[m],s.ARRAY_BUFFER)}}function l(u){let f=[],d=u.index,g=u.attributes.position,x=0;if(d!==null){let y=d.array;x=d.version;for(let v=0,M=y.length;v<M;v+=3){let R=y[v+0],S=y[v+1],T=y[v+2];f.push(R,S,S,T,T,R)}}else if(g!==void 0){let y=g.array;x=g.version;for(let v=0,M=y.length/3-1;v<M;v+=3){let R=v+0,S=v+1,T=v+2;f.push(R,S,S,T,T,R)}}else return;let m=new(qu(f)?Co:Ro)(f,1);m.version=x;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function fg(s,t,e,n){let i=n.isWebGL2,r;function o(d){r=d}let a,c;function l(d){a=d.type,c=d.bytesPerElement}function h(d,g){s.drawElements(r,g,a,d*c),e.update(g,r,1)}function u(d,g,x){if(x===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,d*c,x),e.update(g,r,x)}function f(d,g,x){if(x===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<x;p++)this.render(d[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,d,0,x);let p=0;for(let y=0;y<x;y++)p+=g[y];e.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function dg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function pg(s,t){return s[0]-t[0]}function mg(s,t){return Math.abs(t[1])-Math.abs(s[1])}function gg(s,t,e){let n={},i=new Float32Array(8),r=new WeakMap,o=new de,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){let f=l.morphTargetInfluences;if(t.isWebGL2===!0){let d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0,x=r.get(h);if(x===void 0||x.count!==g){let I=function(){L.dispose(),r.delete(h),h.removeEventListener("dispose",I)};x!==void 0&&x.texture.dispose();let y=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],T=h.morphAttributes.color||[],D=0;y===!0&&(D=1),v===!0&&(D=2),M===!0&&(D=3);let _=h.attributes.position.count*D,b=1;_>t.maxTextureSize&&(b=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);let U=new Float32Array(_*b*4*g),L=new wo(U,_,b,g);L.type=ui,L.needsUpdate=!0;let H=D*4;for(let z=0;z<g;z++){let O=R[z],K=S[z],Q=T[z],Z=_*b*4*z;for(let X=0;X<O.count;X++){let Y=X*H;y===!0&&(o.fromBufferAttribute(O,X),U[Z+Y+0]=o.x,U[Z+Y+1]=o.y,U[Z+Y+2]=o.z,U[Z+Y+3]=0),v===!0&&(o.fromBufferAttribute(K,X),U[Z+Y+4]=o.x,U[Z+Y+5]=o.y,U[Z+Y+6]=o.z,U[Z+Y+7]=0),M===!0&&(o.fromBufferAttribute(Q,X),U[Z+Y+8]=o.x,U[Z+Y+9]=o.y,U[Z+Y+10]=o.z,U[Z+Y+11]=Q.itemSize===4?o.w:1)}}x={count:g,texture:L,size:new tt(_,b)},r.set(h,x),h.addEventListener("dispose",I)}let m=0;for(let y=0;y<f.length;y++)m+=f[y];let p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(s,"morphTargetBaseInfluence",p),u.getUniforms().setValue(s,"morphTargetInfluences",f),u.getUniforms().setValue(s,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{let d=f===void 0?0:f.length,g=n[h.id];if(g===void 0||g.length!==d){g=[];for(let v=0;v<d;v++)g[v]=[v,0];n[h.id]=g}for(let v=0;v<d;v++){let M=g[v];M[0]=v,M[1]=f[v]}g.sort(mg);for(let v=0;v<8;v++)v<d&&g[v][1]?(a[v][0]=g[v][0],a[v][1]=g[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(pg);let x=h.morphAttributes.position,m=h.morphAttributes.normal,p=0;for(let v=0;v<8;v++){let M=a[v],R=M[0],S=M[1];R!==Number.MAX_SAFE_INTEGER&&S?(x&&h.getAttribute("morphTarget"+v)!==x[R]&&h.setAttribute("morphTarget"+v,x[R]),m&&h.getAttribute("morphNormal"+v)!==m[R]&&h.setAttribute("morphNormal"+v,m[R]),i[v]=S,p+=S):(x&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),m&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),i[v]=0)}let y=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",y),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function xg(s,t,e,n){let i=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Lo=class extends un{constructor(t,e,n,i,r,o,a,c,l,h){if(h=h!==void 0?h:zi,h!==zi&&h!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===zi&&(n=hi),n===void 0&&h===Es&&(n=Ni),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Fe,this.minFilter=c!==void 0?c:Fe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Ju=new un,Ku=new Lo(1,1);Ku.compareFunction=Xu;var Qu=new wo,ju=new Ec,tf=new Io,iu=[],su=[],ru=new Float32Array(16),ou=new Float32Array(9),au=new Float32Array(4);function zs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=iu[i];if(r===void 0&&(r=new Float32Array(i),iu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Te(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ae(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function jo(s,t){let e=su[t];e===void 0&&(e=new Int32Array(t),su[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function vg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function yg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2fv(this.addr,t),Ae(e,t)}}function _g(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;s.uniform3fv(this.addr,t),Ae(e,t)}}function Mg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4fv(this.addr,t),Ae(e,t)}}function bg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;au.set(n),s.uniformMatrix2fv(this.addr,!1,au),Ae(e,n)}}function Sg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;ou.set(n),s.uniformMatrix3fv(this.addr,!1,ou),Ae(e,n)}}function Eg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;ru.set(n),s.uniformMatrix4fv(this.addr,!1,ru),Ae(e,n)}}function wg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Tg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2iv(this.addr,t),Ae(e,t)}}function Ag(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;s.uniform3iv(this.addr,t),Ae(e,t)}}function Rg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4iv(this.addr,t),Ae(e,t)}}function Cg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Pg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;s.uniform2uiv(this.addr,t),Ae(e,t)}}function Ig(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;s.uniform3uiv(this.addr,t),Ae(e,t)}}function Lg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;s.uniform4uiv(this.addr,t),Ae(e,t)}}function Dg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r=this.type===s.SAMPLER_2D_SHADOW?Ku:Ju;e.setTexture2D(t||r,i)}function Ug(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ju,i)}function Ng(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||tf,i)}function zg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Qu,i)}function Fg(s){switch(s){case 5126:return vg;case 35664:return yg;case 35665:return _g;case 35666:return Mg;case 35674:return bg;case 35675:return Sg;case 35676:return Eg;case 5124:case 35670:return wg;case 35667:case 35671:return Tg;case 35668:case 35672:return Ag;case 35669:case 35673:return Rg;case 5125:return Cg;case 36294:return Pg;case 36295:return Ig;case 36296:return Lg;case 35678:case 36198:case 36298:case 36306:case 35682:return Dg;case 35679:case 36299:case 36307:return Ug;case 35680:case 36300:case 36308:case 36293:return Ng;case 36289:case 36303:case 36311:case 36292:return zg}}function Bg(s,t){s.uniform1fv(this.addr,t)}function Og(s,t){let e=zs(t,this.size,2);s.uniform2fv(this.addr,e)}function kg(s,t){let e=zs(t,this.size,3);s.uniform3fv(this.addr,e)}function Hg(s,t){let e=zs(t,this.size,4);s.uniform4fv(this.addr,e)}function Vg(s,t){let e=zs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Gg(s,t){let e=zs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Wg(s,t){let e=zs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Xg(s,t){s.uniform1iv(this.addr,t)}function qg(s,t){s.uniform2iv(this.addr,t)}function Yg(s,t){s.uniform3iv(this.addr,t)}function Zg(s,t){s.uniform4iv(this.addr,t)}function $g(s,t){s.uniform1uiv(this.addr,t)}function Jg(s,t){s.uniform2uiv(this.addr,t)}function Kg(s,t){s.uniform3uiv(this.addr,t)}function Qg(s,t){s.uniform4uiv(this.addr,t)}function jg(s,t,e){let n=this.cache,i=t.length,r=jo(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Ju,r[o])}function tx(s,t,e){let n=this.cache,i=t.length,r=jo(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||ju,r[o])}function ex(s,t,e){let n=this.cache,i=t.length,r=jo(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||tf,r[o])}function nx(s,t,e){let n=this.cache,i=t.length,r=jo(e,i);Te(n,r)||(s.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Qu,r[o])}function ix(s){switch(s){case 5126:return Bg;case 35664:return Og;case 35665:return kg;case 35666:return Hg;case 35674:return Vg;case 35675:return Gg;case 35676:return Wg;case 5124:case 35670:return Xg;case 35667:case 35671:return qg;case 35668:case 35672:return Yg;case 35669:case 35673:return Zg;case 5125:return $g;case 36294:return Jg;case 36295:return Kg;case 36296:return Qg;case 35678:case 36198:case 36298:case 36306:case 35682:return jg;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return nx}}var Ac=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Fg(e.type)}},Rc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ix(e.type)}},Cc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},cc=/(\w+)(\])?(\[|\.)?/g;function cu(s,t){s.seq.push(t),s.map[t.id]=t}function sx(s,t,e){let n=s.name,i=n.length;for(cc.lastIndex=0;;){let r=cc.exec(n),o=cc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){cu(e,l===void 0?new Ac(a,s,t):new Rc(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new Cc(a),cu(e,u)),e=u}}}var Ms=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);sx(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function lu(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var rx=37297,ox=0;function ax(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function cx(s){let t=ee.getPrimaries(ee.workingColorSpace),e=ee.getPrimaries(s),n;switch(t===e?n="":t===yo&&e===vo?n="LinearDisplayP3ToLinearSRGB":t===vo&&e===yo&&(n="LinearSRGBToLinearDisplayP3"),s){case Qn:case Qo:return[n,"LinearTransferOETF"];case Se:case pl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function hu(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+ax(s.getShaderSource(t),o)}else return i}function lx(s,t){let e=cx(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function hx(s,t){let e;switch(t){case ll:e="Linear";break;case hl:e="Reinhard";break;case ul:e="OptimizedCineon";break;case Er:e="ACESFilmic";break;case fl:e="AgX";break;case Md:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function ux(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(vs).join(`
`)}function fx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(vs).join(`
`)}function dx(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function px(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function vs(s){return s!==""}function uu(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function fu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var mx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pc(s){return s.replace(mx,xx)}var gx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function xx(s,t){let e=Vt[t];if(e===void 0){let n=gx.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Pc(e)}var vx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function du(s){return s.replace(vx,yx)}function yx(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function pu(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function _x(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Du?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===cl?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===$n&&(t="SHADOWMAP_TYPE_VSM"),t}function Mx(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case Ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bx(s){let t="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===Ss&&(t="ENVMAP_MODE_REFRACTION"),t}function Sx(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Uu:t="ENVMAP_BLENDING_MULTIPLY";break;case yd:t="ENVMAP_BLENDING_MIX";break;case _d:t="ENVMAP_BLENDING_ADD";break}return t}function Ex(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function wx(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=_x(e),l=Mx(e),h=bx(e),u=Sx(e),f=Ex(e),d=e.isWebGL2?"":ux(e),g=fx(e),x=dx(r),m=i.createProgram(),p,y,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(vs).join(`
`),p.length>0&&(p+=`
`),y=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(vs).join(`
`),y.length>0&&(y+=`
`)):(p=[pu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),y=[d,pu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==di?"#define TONE_MAPPING":"",e.toneMapping!==di?Vt.tonemapping_pars_fragment:"",e.toneMapping!==di?hx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,lx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vs).join(`
`)),o=Pc(o),o=uu(o,e),o=fu(o,e),a=Pc(a),a=uu(a,e),a=fu(a,e),o=du(o),a=du(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);let M=v+p+o,R=v+y+a,S=lu(i,i.VERTEX_SHADER,M),T=lu(i,i.FRAGMENT_SHADER,R);i.attachShader(m,S),i.attachShader(m,T),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function D(L){if(s.debug.checkShaderErrors){let H=i.getProgramInfoLog(m).trim(),I=i.getShaderInfoLog(S).trim(),z=i.getShaderInfoLog(T).trim(),O=!0,K=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(O=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,S,T);else{let Q=hu(i,S,"vertex"),Z=hu(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+H+`
`+Q+`
`+Z)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(I===""||z==="")&&(K=!1);K&&(L.diagnostics={runnable:O,programLog:H,vertexShader:{log:I,prefix:p},fragmentShader:{log:z,prefix:y}})}i.deleteShader(S),i.deleteShader(T),_=new Ms(i,m),b=px(i,m)}let _;this.getUniforms=function(){return _===void 0&&D(this),_};let b;this.getAttributes=function(){return b===void 0&&D(this),b};let U=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=i.getProgramParameter(m,rx)),U},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ox++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=T,this}var Tx=0,Ic=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Lc(t),e.set(t,n)),n}},Lc=class{constructor(t){this.id=Tx++,this.code=t,this.usedTimes=0}};function Ax(s,t,e,n,i,r,o){let a=new Ao,c=new Ic,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures,d=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function m(_,b,U,L,H){let I=L.fog,z=H.geometry,O=_.isMeshStandardMaterial?L.environment:null,K=(_.isMeshStandardMaterial?e:t).get(_.envMap||O),Q=K&&K.mapping===Ko?K.image.height:null,Z=g[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let X=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Y=X!==void 0?X.length:0,ct=0;z.morphAttributes.position!==void 0&&(ct=1),z.morphAttributes.normal!==void 0&&(ct=2),z.morphAttributes.color!==void 0&&(ct=3);let J,nt,mt,Mt;if(Z){let Qe=Nn[Z];J=Qe.vertexShader,nt=Qe.fragmentShader}else J=_.vertexShader,nt=_.fragmentShader,c.update(_),mt=c.getVertexShaderID(_),Mt=c.getFragmentShaderID(_);let vt=s.getRenderTarget(),Rt=H.isInstancedMesh===!0,Ct=H.isBatchedMesh===!0,Et=!!_.map,Dt=!!_.matcap,w=!!K,V=!!_.aoMap,F=!!_.lightMap,j=!!_.bumpMap,G=!!_.normalMap,rt=!!_.displacementMap,it=!!_.emissiveMap,A=!!_.metalnessMap,E=!!_.roughnessMap,k=_.anisotropy>0,st=_.clearcoat>0,ot=_.iridescence>0,et=_.sheen>0,bt=_.transmission>0,pt=k&&!!_.anisotropyMap,yt=st&&!!_.clearcoatMap,Tt=st&&!!_.clearcoatNormalMap,Ot=st&&!!_.clearcoatRoughnessMap,at=ot&&!!_.iridescenceMap,te=ot&&!!_.iridescenceThicknessMap,Zt=et&&!!_.sheenColorMap,Ft=et&&!!_.sheenRoughnessMap,Pt=!!_.specularMap,St=!!_.specularColorMap,Ht=!!_.specularIntensityMap,se=bt&&!!_.transmissionMap,ye=bt&&!!_.thicknessMap,Xt=!!_.gradientMap,ut=!!_.alphaMap,N=_.alphaTest>0,gt=!!_.alphaHash,xt=!!_.extensions,Nt=!!z.attributes.uv1,Lt=!!z.attributes.uv2,he=!!z.attributes.uv3,ue=di;return _.toneMapped&&(vt===null||vt.isXRRenderTarget===!0)&&(ue=s.toneMapping),{isWebGL2:h,shaderID:Z,shaderType:_.type,shaderName:_.name,vertexShader:J,fragmentShader:nt,defines:_.defines,customVertexShaderID:mt,customFragmentShaderID:Mt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Ct,instancing:Rt,instancingColor:Rt&&H.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:vt===null?s.outputColorSpace:vt.isXRRenderTarget===!0?vt.texture.colorSpace:Qn,map:Et,matcap:Dt,envMap:w,envMapMode:w&&K.mapping,envMapCubeUVHeight:Q,aoMap:V,lightMap:F,bumpMap:j,normalMap:G,displacementMap:f&&rt,emissiveMap:it,normalMapObjectSpace:G&&_.normalMapType===Dd,normalMapTangentSpace:G&&_.normalMapType===Wu,metalnessMap:A,roughnessMap:E,anisotropy:k,anisotropyMap:pt,clearcoat:st,clearcoatMap:yt,clearcoatNormalMap:Tt,clearcoatRoughnessMap:Ot,iridescence:ot,iridescenceMap:at,iridescenceThicknessMap:te,sheen:et,sheenColorMap:Zt,sheenRoughnessMap:Ft,specularMap:Pt,specularColorMap:St,specularIntensityMap:Ht,transmission:bt,transmissionMap:se,thicknessMap:ye,gradientMap:Xt,opaque:_.transparent===!1&&_.blending===fi,alphaMap:ut,alphaTest:N,alphaHash:gt,combine:_.combine,mapUv:Et&&x(_.map.channel),aoMapUv:V&&x(_.aoMap.channel),lightMapUv:F&&x(_.lightMap.channel),bumpMapUv:j&&x(_.bumpMap.channel),normalMapUv:G&&x(_.normalMap.channel),displacementMapUv:rt&&x(_.displacementMap.channel),emissiveMapUv:it&&x(_.emissiveMap.channel),metalnessMapUv:A&&x(_.metalnessMap.channel),roughnessMapUv:E&&x(_.roughnessMap.channel),anisotropyMapUv:pt&&x(_.anisotropyMap.channel),clearcoatMapUv:yt&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:Tt&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ot&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:te&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:Zt&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&x(_.sheenRoughnessMap.channel),specularMapUv:Pt&&x(_.specularMap.channel),specularColorMapUv:St&&x(_.specularColorMap.channel),specularIntensityMapUv:Ht&&x(_.specularIntensityMap.channel),transmissionMapUv:se&&x(_.transmissionMap.channel),thicknessMapUv:ye&&x(_.thicknessMap.channel),alphaMapUv:ut&&x(_.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(G||k),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:Nt,vertexUv2s:Lt,vertexUv3s:he,pointsUvs:H.isPoints===!0&&!!z.attributes.uv&&(Et||ut),fog:!!I,useFog:_.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:H.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:ct,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:ue,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Et&&_.map.isVideoTexture===!0&&ee.getTransfer(_.map.colorSpace)===le,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Oe,flipSided:_.side===Ze,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:xt&&_.extensions.derivatives===!0,extensionFragDepth:xt&&_.extensions.fragDepth===!0,extensionDrawBuffers:xt&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:xt&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:xt&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){let b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(let U in _.defines)b.push(U),b.push(_.defines[U]);return _.isRawShaderMaterial===!1&&(y(b,_),v(b,_),b.push(s.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function y(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function v(_,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),_.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),_.push(a.mask)}function M(_){let b=g[_.type],U;if(b){let L=Nn[b];U=On.clone(L.uniforms)}else U=_.uniforms;return U}function R(_,b){let U;for(let L=0,H=l.length;L<H;L++){let I=l[L];if(I.cacheKey===b){U=I,++U.usedTimes;break}}return U===void 0&&(U=new wx(s,b,_,r),l.push(U)),U}function S(_){if(--_.usedTimes===0){let b=l.indexOf(_);l[b]=l[l.length-1],l.pop(),_.destroy()}}function T(_){c.remove(_)}function D(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:R,releaseProgram:S,releaseShaderCache:T,programs:l,dispose:D}}function Rx(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Cx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function mu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function gu(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,f,d,g,x,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),t++,p}function a(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function c(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||Cx),n.length>1&&n.sort(f||mu),i.length>1&&i.sort(f||mu)}function h(){for(let u=t,f=s.length;u<f;u++){let d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function Px(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new gu,s.set(n,[o])):i>=r.length?(o=new gu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Ix(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new lt};break;case"SpotLight":e={position:new P,direction:new P,color:new lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new lt,groundColor:new lt};break;case"RectAreaLight":e={color:new lt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[t.id]=e,e}}}function Lx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var Dx=0;function Ux(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Nx(s,t){let e=new Ix,n=Lx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new P);let r=new P,o=new Kt,a=new Kt;function c(h,u){let f=0,d=0,g=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let x=0,m=0,p=0,y=0,v=0,M=0,R=0,S=0,T=0,D=0,_=0;h.sort(Ux);let b=u===!0?Math.PI:1;for(let L=0,H=h.length;L<H;L++){let I=h[L],z=I.color,O=I.intensity,K=I.distance,Q=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=z.r*O*b,d+=z.g*O*b,g+=z.b*O*b;else if(I.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(I.sh.coefficients[Z],O);_++}else if(I.isDirectionalLight){let Z=e.get(I);if(Z.color.copy(I.color).multiplyScalar(I.intensity*b),I.castShadow){let X=I.shadow,Y=n.get(I);Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,i.directionalShadow[x]=Y,i.directionalShadowMap[x]=Q,i.directionalShadowMatrix[x]=I.shadow.matrix,M++}i.directional[x]=Z,x++}else if(I.isSpotLight){let Z=e.get(I);Z.position.setFromMatrixPosition(I.matrixWorld),Z.color.copy(z).multiplyScalar(O*b),Z.distance=K,Z.coneCos=Math.cos(I.angle),Z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),Z.decay=I.decay,i.spot[p]=Z;let X=I.shadow;if(I.map&&(i.spotLightMap[T]=I.map,T++,X.updateMatrices(I),I.castShadow&&D++),i.spotLightMatrix[p]=X.matrix,I.castShadow){let Y=n.get(I);Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,i.spotShadow[p]=Y,i.spotShadowMap[p]=Q,S++}p++}else if(I.isRectAreaLight){let Z=e.get(I);Z.color.copy(z).multiplyScalar(O),Z.halfWidth.set(I.width*.5,0,0),Z.halfHeight.set(0,I.height*.5,0),i.rectArea[y]=Z,y++}else if(I.isPointLight){let Z=e.get(I);if(Z.color.copy(I.color).multiplyScalar(I.intensity*b),Z.distance=I.distance,Z.decay=I.decay,I.castShadow){let X=I.shadow,Y=n.get(I);Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,Y.shadowCameraNear=X.camera.near,Y.shadowCameraFar=X.camera.far,i.pointShadow[m]=Y,i.pointShadowMap[m]=Q,i.pointShadowMatrix[m]=I.shadow.matrix,R++}i.point[m]=Z,m++}else if(I.isHemisphereLight){let Z=e.get(I);Z.skyColor.copy(I.color).multiplyScalar(O*b),Z.groundColor.copy(I.groundColor).multiplyScalar(O*b),i.hemi[v]=Z,v++}}y>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=d,i.ambient[2]=g;let U=i.hash;(U.directionalLength!==x||U.pointLength!==m||U.spotLength!==p||U.rectAreaLength!==y||U.hemiLength!==v||U.numDirectionalShadows!==M||U.numPointShadows!==R||U.numSpotShadows!==S||U.numSpotMaps!==T||U.numLightProbes!==_)&&(i.directional.length=x,i.spot.length=p,i.rectArea.length=y,i.point.length=m,i.hemi.length=v,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=S+T-D,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=_,U.directionalLength=x,U.pointLength=m,U.spotLength=p,U.rectAreaLength=y,U.hemiLength=v,U.numDirectionalShadows=M,U.numPointShadows=R,U.numSpotShadows=S,U.numSpotMaps=T,U.numLightProbes=_,i.version=Dx++)}function l(h,u){let f=0,d=0,g=0,x=0,m=0,p=u.matrixWorldInverse;for(let y=0,v=h.length;y<v;y++){let M=h[y];if(M.isDirectionalLight){let R=i.directional[f];R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),f++}else if(M.isSpotLight){let R=i.spot[g];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),g++}else if(M.isRectAreaLight){let R=i.rectArea[x];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),a.identity(),o.copy(M.matrixWorld),o.premultiply(p),a.extractRotation(o),R.halfWidth.set(M.width*.5,0,0),R.halfHeight.set(0,M.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),x++}else if(M.isPointLight){let R=i.point[d];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){let R=i.hemi[m];R.direction.setFromMatrixPosition(M.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:i}}function xu(s,t){let e=new Nx(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function zx(s,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),c;return a===void 0?(c=new xu(s,t),e.set(r,[c])):o>=a.length?(c=new xu(s,t),a.push(c)):c=a[o],c}function i(){e=new WeakMap}return{get:n,dispose:i}}var Dc=class extends ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Id,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Uc=class extends ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Fx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ox(s,t,e){let n=new pr,i=new tt,r=new tt,o=new de,a=new Dc({depthPacking:Ld}),c=new Uc,l={},h=e.maxTextureSize,u={[pi]:Ze,[Ze]:pi,[Oe]:Oe},f=new ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Fx,fragmentShader:Bx}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new oe;g.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ht(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Du;let p=this.type;this.render=function(S,T,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let _=s.getRenderTarget(),b=s.getActiveCubeFace(),U=s.getActiveMipmapLevel(),L=s.state;L.setBlending(Fn),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let H=p!==$n&&this.type===$n,I=p===$n&&this.type!==$n;for(let z=0,O=S.length;z<O;z++){let K=S[z],Q=K.shadow;if(Q===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(Q.autoUpdate===!1&&Q.needsUpdate===!1)continue;i.copy(Q.mapSize);let Z=Q.getFrameExtents();if(i.multiply(Z),r.copy(Q.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,Q.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,Q.mapSize.y=r.y)),Q.map===null||H===!0||I===!0){let Y=this.type!==$n?{minFilter:Fe,magFilter:Fe}:{};Q.map!==null&&Q.map.dispose(),Q.map=new He(i.x,i.y,Y),Q.map.texture.name=K.name+".shadowMap",Q.camera.updateProjectionMatrix()}s.setRenderTarget(Q.map),s.clear();let X=Q.getViewportCount();for(let Y=0;Y<X;Y++){let ct=Q.getViewport(Y);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),L.viewport(o),Q.updateMatrices(K,Y),n=Q.getFrustum(),M(T,D,Q.camera,K,this.type)}Q.isPointLightShadow!==!0&&this.type===$n&&y(Q,D),Q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(_,b,U)};function y(S,T){let D=t.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new He(i.x,i.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(T,null,D,f,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(T,null,D,d,x,null)}function v(S,T,D,_){let b=null,U=D.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(U!==void 0)b=U;else if(b=D.isPointLight===!0?c:a,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let L=b.uuid,H=T.uuid,I=l[L];I===void 0&&(I={},l[L]=I);let z=I[H];z===void 0&&(z=b.clone(),I[H]=z,T.addEventListener("dispose",R)),b=z}if(b.visible=T.visible,b.wireframe=T.wireframe,_===$n?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,D.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let L=s.properties.get(b);L.light=D}return b}function M(S,T,D,_,b){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===$n)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,S.matrixWorld);let H=t.update(S),I=S.material;if(Array.isArray(I)){let z=H.groups;for(let O=0,K=z.length;O<K;O++){let Q=z[O],Z=I[Q.materialIndex];if(Z&&Z.visible){let X=v(S,Z,_,b);S.onBeforeShadow(s,S,T,D,H,X,Q),s.renderBufferDirect(D,null,H,X,S,Q),S.onAfterShadow(s,S,T,D,H,X,Q)}}}else if(I.visible){let z=v(S,I,_,b);S.onBeforeShadow(s,S,T,D,H,z,null),s.renderBufferDirect(D,null,H,z,S,null),S.onAfterShadow(s,S,T,D,H,z,null)}}let L=S.children;for(let H=0,I=L.length;H<I;H++)M(L[H],T,D,_,b)}function R(S){S.target.removeEventListener("dispose",R);for(let D in l){let _=l[D],b=S.target.uuid;b in _&&(_[b].dispose(),delete _[b])}}}function kx(s,t,e){let n=e.isWebGL2;function i(){let N=!1,gt=new de,xt=null,Nt=new de(0,0,0,0);return{setMask:function(Lt){xt!==Lt&&!N&&(s.colorMask(Lt,Lt,Lt,Lt),xt=Lt)},setLocked:function(Lt){N=Lt},setClear:function(Lt,he,ue,Ie,Qe){Qe===!0&&(Lt*=Ie,he*=Ie,ue*=Ie),gt.set(Lt,he,ue,Ie),Nt.equals(gt)===!1&&(s.clearColor(Lt,he,ue,Ie),Nt.copy(gt))},reset:function(){N=!1,xt=null,Nt.set(-1,0,0,0)}}}function r(){let N=!1,gt=null,xt=null,Nt=null;return{setTest:function(Lt){Lt?Ct(s.DEPTH_TEST):Et(s.DEPTH_TEST)},setMask:function(Lt){gt!==Lt&&!N&&(s.depthMask(Lt),gt=Lt)},setFunc:function(Lt){if(xt!==Lt){switch(Lt){case fd:s.depthFunc(s.NEVER);break;case dd:s.depthFunc(s.ALWAYS);break;case pd:s.depthFunc(s.LESS);break;case po:s.depthFunc(s.LEQUAL);break;case md:s.depthFunc(s.EQUAL);break;case gd:s.depthFunc(s.GEQUAL);break;case xd:s.depthFunc(s.GREATER);break;case vd:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xt=Lt}},setLocked:function(Lt){N=Lt},setClear:function(Lt){Nt!==Lt&&(s.clearDepth(Lt),Nt=Lt)},reset:function(){N=!1,gt=null,xt=null,Nt=null}}}function o(){let N=!1,gt=null,xt=null,Nt=null,Lt=null,he=null,ue=null,Ie=null,Qe=null;return{setTest:function(fe){N||(fe?Ct(s.STENCIL_TEST):Et(s.STENCIL_TEST))},setMask:function(fe){gt!==fe&&!N&&(s.stencilMask(fe),gt=fe)},setFunc:function(fe,je,Un){(xt!==fe||Nt!==je||Lt!==Un)&&(s.stencilFunc(fe,je,Un),xt=fe,Nt=je,Lt=Un)},setOp:function(fe,je,Un){(he!==fe||ue!==je||Ie!==Un)&&(s.stencilOp(fe,je,Un),he=fe,ue=je,Ie=Un)},setLocked:function(fe){N=fe},setClear:function(fe){Qe!==fe&&(s.clearStencil(fe),Qe=fe)},reset:function(){N=!1,gt=null,xt=null,Nt=null,Lt=null,he=null,ue=null,Ie=null,Qe=null}}}let a=new i,c=new r,l=new o,h=new WeakMap,u=new WeakMap,f={},d={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,M=null,R=null,S=null,T=null,D=null,_=new lt(0,0,0),b=0,U=!1,L=null,H=null,I=null,z=null,O=null,K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Q=!1,Z=0,X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(X)[1]),Q=Z>=1):X.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),Q=Z>=2);let Y=null,ct={},J=s.getParameter(s.SCISSOR_BOX),nt=s.getParameter(s.VIEWPORT),mt=new de().fromArray(J),Mt=new de().fromArray(nt);function vt(N,gt,xt,Nt){let Lt=new Uint8Array(4),he=s.createTexture();s.bindTexture(N,he),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ue=0;ue<xt;ue++)n&&(N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY)?s.texImage3D(gt,0,s.RGBA,1,1,Nt,0,s.RGBA,s.UNSIGNED_BYTE,Lt):s.texImage2D(gt+ue,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Lt);return he}let Rt={};Rt[s.TEXTURE_2D]=vt(s.TEXTURE_2D,s.TEXTURE_2D,1),Rt[s.TEXTURE_CUBE_MAP]=vt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Rt[s.TEXTURE_2D_ARRAY]=vt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Rt[s.TEXTURE_3D]=vt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ct(s.DEPTH_TEST),c.setFunc(po),it(!1),A(Ql),Ct(s.CULL_FACE),G(Fn);function Ct(N){f[N]!==!0&&(s.enable(N),f[N]=!0)}function Et(N){f[N]!==!1&&(s.disable(N),f[N]=!1)}function Dt(N,gt){return d[N]!==gt?(s.bindFramebuffer(N,gt),d[N]=gt,n&&(N===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=gt),N===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=gt)),!0):!1}function w(N,gt){let xt=x,Nt=!1;if(N)if(xt=g.get(gt),xt===void 0&&(xt=[],g.set(gt,xt)),N.isWebGLMultipleRenderTargets){let Lt=N.texture;if(xt.length!==Lt.length||xt[0]!==s.COLOR_ATTACHMENT0){for(let he=0,ue=Lt.length;he<ue;he++)xt[he]=s.COLOR_ATTACHMENT0+he;xt.length=Lt.length,Nt=!0}}else xt[0]!==s.COLOR_ATTACHMENT0&&(xt[0]=s.COLOR_ATTACHMENT0,Nt=!0);else xt[0]!==s.BACK&&(xt[0]=s.BACK,Nt=!0);Nt&&(e.isWebGL2?s.drawBuffers(xt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(xt))}function V(N){return m!==N?(s.useProgram(N),m=N,!0):!1}let F={[Li]:s.FUNC_ADD,[Kf]:s.FUNC_SUBTRACT,[Qf]:s.FUNC_REVERSE_SUBTRACT};if(n)F[eh]=s.MIN,F[nh]=s.MAX;else{let N=t.get("EXT_blend_minmax");N!==null&&(F[eh]=N.MIN_EXT,F[nh]=N.MAX_EXT)}let j={[jf]:s.ZERO,[td]:s.ONE,[ed]:s.SRC_COLOR,[mc]:s.SRC_ALPHA,[ad]:s.SRC_ALPHA_SATURATE,[rd]:s.DST_COLOR,[id]:s.DST_ALPHA,[nd]:s.ONE_MINUS_SRC_COLOR,[gc]:s.ONE_MINUS_SRC_ALPHA,[od]:s.ONE_MINUS_DST_COLOR,[sd]:s.ONE_MINUS_DST_ALPHA,[cd]:s.CONSTANT_COLOR,[ld]:s.ONE_MINUS_CONSTANT_COLOR,[hd]:s.CONSTANT_ALPHA,[ud]:s.ONE_MINUS_CONSTANT_ALPHA};function G(N,gt,xt,Nt,Lt,he,ue,Ie,Qe,fe){if(N===Fn){p===!0&&(Et(s.BLEND),p=!1);return}if(p===!1&&(Ct(s.BLEND),p=!0),N!==Jf){if(N!==y||fe!==U){if((v!==Li||S!==Li)&&(s.blendEquation(s.FUNC_ADD),v=Li,S=Li),fe)switch(N){case fi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ke:s.blendFunc(s.ONE,s.ONE);break;case jl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case th:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case fi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ke:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case jl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case th:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}M=null,R=null,T=null,D=null,_.set(0,0,0),b=0,y=N,U=fe}return}Lt=Lt||gt,he=he||xt,ue=ue||Nt,(gt!==v||Lt!==S)&&(s.blendEquationSeparate(F[gt],F[Lt]),v=gt,S=Lt),(xt!==M||Nt!==R||he!==T||ue!==D)&&(s.blendFuncSeparate(j[xt],j[Nt],j[he],j[ue]),M=xt,R=Nt,T=he,D=ue),(Ie.equals(_)===!1||Qe!==b)&&(s.blendColor(Ie.r,Ie.g,Ie.b,Qe),_.copy(Ie),b=Qe),y=N,U=!1}function rt(N,gt){N.side===Oe?Et(s.CULL_FACE):Ct(s.CULL_FACE);let xt=N.side===Ze;gt&&(xt=!xt),it(xt),N.blending===fi&&N.transparent===!1?G(Fn):G(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),c.setFunc(N.depthFunc),c.setTest(N.depthTest),c.setMask(N.depthWrite),a.setMask(N.colorWrite);let Nt=N.stencilWrite;l.setTest(Nt),Nt&&(l.setMask(N.stencilWriteMask),l.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),l.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),k(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Ct(s.SAMPLE_ALPHA_TO_COVERAGE):Et(s.SAMPLE_ALPHA_TO_COVERAGE)}function it(N){L!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),L=N)}function A(N){N!==Zf?(Ct(s.CULL_FACE),N!==H&&(N===Ql?s.cullFace(s.BACK):N===$f?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Et(s.CULL_FACE),H=N}function E(N){N!==I&&(Q&&s.lineWidth(N),I=N)}function k(N,gt,xt){N?(Ct(s.POLYGON_OFFSET_FILL),(z!==gt||O!==xt)&&(s.polygonOffset(gt,xt),z=gt,O=xt)):Et(s.POLYGON_OFFSET_FILL)}function st(N){N?Ct(s.SCISSOR_TEST):Et(s.SCISSOR_TEST)}function ot(N){N===void 0&&(N=s.TEXTURE0+K-1),Y!==N&&(s.activeTexture(N),Y=N)}function et(N,gt,xt){xt===void 0&&(Y===null?xt=s.TEXTURE0+K-1:xt=Y);let Nt=ct[xt];Nt===void 0&&(Nt={type:void 0,texture:void 0},ct[xt]=Nt),(Nt.type!==N||Nt.texture!==gt)&&(Y!==xt&&(s.activeTexture(xt),Y=xt),s.bindTexture(N,gt||Rt[N]),Nt.type=N,Nt.texture=gt)}function bt(){let N=ct[Y];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function pt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Zt(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pt(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ht(N){mt.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),mt.copy(N))}function se(N){Mt.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),Mt.copy(N))}function ye(N,gt){let xt=u.get(gt);xt===void 0&&(xt=new WeakMap,u.set(gt,xt));let Nt=xt.get(N);Nt===void 0&&(Nt=s.getUniformBlockIndex(gt,N.name),xt.set(N,Nt))}function Xt(N,gt){let Nt=u.get(gt).get(N);h.get(gt)!==Nt&&(s.uniformBlockBinding(gt,Nt,N.__bindingPointIndex),h.set(gt,Nt))}function ut(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},Y=null,ct={},d={},g=new WeakMap,x=[],m=null,p=!1,y=null,v=null,M=null,R=null,S=null,T=null,D=null,_=new lt(0,0,0),b=0,U=!1,L=null,H=null,I=null,z=null,O=null,mt.set(0,0,s.canvas.width,s.canvas.height),Mt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Ct,disable:Et,bindFramebuffer:Dt,drawBuffers:w,useProgram:V,setBlending:G,setMaterial:rt,setFlipSided:it,setCullFace:A,setLineWidth:E,setPolygonOffset:k,setScissorTest:st,activeTexture:ot,bindTexture:et,unbindTexture:bt,compressedTexImage2D:pt,compressedTexImage3D:yt,texImage2D:Pt,texImage3D:St,updateUBOMapping:ye,uniformBlockBinding:Xt,texStorage2D:Zt,texStorage3D:Ft,texSubImage2D:Tt,texSubImage3D:Ot,compressedTexSubImage2D:at,compressedTexSubImage3D:te,scissor:Ht,viewport:se,reset:ut}}function Hx(s,t,e,n,i,r,o){let a=i.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,E){return d?new OffscreenCanvas(A,E):bo("canvas")}function x(A,E,k,st){let ot=1;if((A.width>st||A.height>st)&&(ot=st/Math.max(A.width,A.height)),ot<1||E===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){let et=E?Mo:Math.floor,bt=et(ot*A.width),pt=et(ot*A.height);u===void 0&&(u=g(bt,pt));let yt=k?g(bt,pt):u;return yt.width=bt,yt.height=pt,yt.getContext("2d").drawImage(A,0,0,bt,pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+bt+"x"+pt+")."),yt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return bc(A.width)&&bc(A.height)}function p(A){return a?!1:A.wrapS!==wn||A.wrapT!==wn||A.minFilter!==Fe&&A.minFilter!==vn}function y(A,E){return A.generateMipmaps&&E&&A.minFilter!==Fe&&A.minFilter!==vn}function v(A){s.generateMipmap(A)}function M(A,E,k,st,ot=!1){if(a===!1)return E;if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let et=E;if(E===s.RED&&(k===s.FLOAT&&(et=s.R32F),k===s.HALF_FLOAT&&(et=s.R16F),k===s.UNSIGNED_BYTE&&(et=s.R8)),E===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(et=s.R8UI),k===s.UNSIGNED_SHORT&&(et=s.R16UI),k===s.UNSIGNED_INT&&(et=s.R32UI),k===s.BYTE&&(et=s.R8I),k===s.SHORT&&(et=s.R16I),k===s.INT&&(et=s.R32I)),E===s.RG&&(k===s.FLOAT&&(et=s.RG32F),k===s.HALF_FLOAT&&(et=s.RG16F),k===s.UNSIGNED_BYTE&&(et=s.RG8)),E===s.RGBA){let bt=ot?xo:ee.getTransfer(st);k===s.FLOAT&&(et=s.RGBA32F),k===s.HALF_FLOAT&&(et=s.RGBA16F),k===s.UNSIGNED_BYTE&&(et=bt===le?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(et=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(et=s.RGB5_A1)}return(et===s.R16F||et===s.R32F||et===s.RG16F||et===s.RG32F||et===s.RGBA16F||et===s.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function R(A,E,k){return y(A,k)===!0||A.isFramebufferTexture&&A.minFilter!==Fe&&A.minFilter!==vn?Math.log2(Math.max(E.width,E.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?E.mipmaps.length:1}function S(A){return A===Fe||A===ih||A===Ua?s.NEAREST:s.LINEAR}function T(A){let E=A.target;E.removeEventListener("dispose",T),_(E),E.isVideoTexture&&h.delete(E)}function D(A){let E=A.target;E.removeEventListener("dispose",D),U(E)}function _(A){let E=n.get(A);if(E.__webglInit===void 0)return;let k=A.source,st=f.get(k);if(st){let ot=st[E.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&b(A),Object.keys(st).length===0&&f.delete(k)}n.remove(A)}function b(A){let E=n.get(A);s.deleteTexture(E.__webglTexture);let k=A.source,st=f.get(k);delete st[E.__cacheKey],o.memory.textures--}function U(A){let E=A.texture,k=n.get(A),st=n.get(E);if(st.__webglTexture!==void 0&&(s.deleteTexture(st.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(k.__webglFramebuffer[ot]))for(let et=0;et<k.__webglFramebuffer[ot].length;et++)s.deleteFramebuffer(k.__webglFramebuffer[ot][et]);else s.deleteFramebuffer(k.__webglFramebuffer[ot]);k.__webglDepthbuffer&&s.deleteRenderbuffer(k.__webglDepthbuffer[ot])}else{if(Array.isArray(k.__webglFramebuffer))for(let ot=0;ot<k.__webglFramebuffer.length;ot++)s.deleteFramebuffer(k.__webglFramebuffer[ot]);else s.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&s.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&s.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let ot=0;ot<k.__webglColorRenderbuffer.length;ot++)k.__webglColorRenderbuffer[ot]&&s.deleteRenderbuffer(k.__webglColorRenderbuffer[ot]);k.__webglDepthRenderbuffer&&s.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let ot=0,et=E.length;ot<et;ot++){let bt=n.get(E[ot]);bt.__webglTexture&&(s.deleteTexture(bt.__webglTexture),o.memory.textures--),n.remove(E[ot])}n.remove(E),n.remove(A)}let L=0;function H(){L=0}function I(){let A=L;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),L+=1,A}function z(A){let E=[];return E.push(A.wrapS),E.push(A.wrapT),E.push(A.wrapR||0),E.push(A.magFilter),E.push(A.minFilter),E.push(A.anisotropy),E.push(A.internalFormat),E.push(A.format),E.push(A.type),E.push(A.generateMipmaps),E.push(A.premultiplyAlpha),E.push(A.flipY),E.push(A.unpackAlignment),E.push(A.colorSpace),E.join()}function O(A,E){let k=n.get(A);if(A.isVideoTexture&&rt(A),A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){let st=A.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{mt(k,A,E);return}}e.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+E)}function K(A,E){let k=n.get(A);if(A.version>0&&k.__version!==A.version){mt(k,A,E);return}e.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+E)}function Q(A,E){let k=n.get(A);if(A.version>0&&k.__version!==A.version){mt(k,A,E);return}e.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+E)}function Z(A,E){let k=n.get(A);if(A.version>0&&k.__version!==A.version){Mt(k,A,E);return}e.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+E)}let X={[fr]:s.REPEAT,[wn]:s.CLAMP_TO_EDGE,[yc]:s.MIRRORED_REPEAT},Y={[Fe]:s.NEAREST,[ih]:s.NEAREST_MIPMAP_NEAREST,[Ua]:s.NEAREST_MIPMAP_LINEAR,[vn]:s.LINEAR,[bd]:s.LINEAR_MIPMAP_NEAREST,[dr]:s.LINEAR_MIPMAP_LINEAR},ct={[Ud]:s.NEVER,[kd]:s.ALWAYS,[Nd]:s.LESS,[Xu]:s.LEQUAL,[zd]:s.EQUAL,[Od]:s.GEQUAL,[Fd]:s.GREATER,[Bd]:s.NOTEQUAL};function J(A,E,k){if(k?(s.texParameteri(A,s.TEXTURE_WRAP_S,X[E.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,X[E.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,X[E.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Y[E.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Y[E.minFilter])):(s.texParameteri(A,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(A,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==wn||E.wrapT!==wn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(A,s.TEXTURE_MAG_FILTER,S(E.magFilter)),s.texParameteri(A,s.TEXTURE_MIN_FILTER,S(E.minFilter)),E.minFilter!==Fe&&E.minFilter!==vn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,ct[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let st=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===Fe||E.minFilter!==Ua&&E.minFilter!==dr||E.type===ui&&t.has("OES_texture_float_linear")===!1||a===!1&&E.type===hn&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(s.texParameterf(A,st.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function nt(A,E){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,E.addEventListener("dispose",T));let st=E.source,ot=f.get(st);ot===void 0&&(ot={},f.set(st,ot));let et=z(E);if(et!==A.__cacheKey){ot[et]===void 0&&(ot[et]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ot[et].usedTimes++;let bt=ot[A.__cacheKey];bt!==void 0&&(ot[A.__cacheKey].usedTimes--,bt.usedTimes===0&&b(E)),A.__cacheKey=et,A.__webglTexture=ot[et].texture}return k}function mt(A,E,k){let st=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(st=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(st=s.TEXTURE_3D);let ot=nt(A,E),et=E.source;e.bindTexture(st,A.__webglTexture,s.TEXTURE0+k);let bt=n.get(et);if(et.version!==bt.__version||ot===!0){e.activeTexture(s.TEXTURE0+k);let pt=ee.getPrimaries(ee.workingColorSpace),yt=E.colorSpace===yn?null:ee.getPrimaries(E.colorSpace),Tt=E.colorSpace===yn||pt===yt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let Ot=p(E)&&m(E.image)===!1,at=x(E.image,Ot,!1,i.maxTextureSize);at=it(E,at);let te=m(at)||a,Zt=r.convert(E.format,E.colorSpace),Ft=r.convert(E.type),Pt=M(E.internalFormat,Zt,Ft,E.colorSpace,E.isVideoTexture);J(st,E,te);let St,Ht=E.mipmaps,se=a&&E.isVideoTexture!==!0&&Pt!==Vu,ye=bt.__version===void 0||ot===!0,Xt=R(E,at,te);if(E.isDepthTexture)Pt=s.DEPTH_COMPONENT,a?E.type===ui?Pt=s.DEPTH_COMPONENT32F:E.type===hi?Pt=s.DEPTH_COMPONENT24:E.type===Ni?Pt=s.DEPTH24_STENCIL8:Pt=s.DEPTH_COMPONENT16:E.type===ui&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===zi&&Pt===s.DEPTH_COMPONENT&&E.type!==dl&&E.type!==hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=hi,Ft=r.convert(E.type)),E.format===Es&&Pt===s.DEPTH_COMPONENT&&(Pt=s.DEPTH_STENCIL,E.type!==Ni&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=Ni,Ft=r.convert(E.type))),ye&&(se?e.texStorage2D(s.TEXTURE_2D,1,Pt,at.width,at.height):e.texImage2D(s.TEXTURE_2D,0,Pt,at.width,at.height,0,Zt,Ft,null));else if(E.isDataTexture)if(Ht.length>0&&te){se&&ye&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,Ht[0].width,Ht[0].height);for(let ut=0,N=Ht.length;ut<N;ut++)St=Ht[ut],se?e.texSubImage2D(s.TEXTURE_2D,ut,0,0,St.width,St.height,Zt,Ft,St.data):e.texImage2D(s.TEXTURE_2D,ut,Pt,St.width,St.height,0,Zt,Ft,St.data);E.generateMipmaps=!1}else se?(ye&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,at.width,at.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,at.width,at.height,Zt,Ft,at.data)):e.texImage2D(s.TEXTURE_2D,0,Pt,at.width,at.height,0,Zt,Ft,at.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){se&&ye&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,Pt,Ht[0].width,Ht[0].height,at.depth);for(let ut=0,N=Ht.length;ut<N;ut++)St=Ht[ut],E.format!==Tn?Zt!==null?se?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ut,0,0,0,St.width,St.height,at.depth,Zt,St.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ut,Pt,St.width,St.height,at.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):se?e.texSubImage3D(s.TEXTURE_2D_ARRAY,ut,0,0,0,St.width,St.height,at.depth,Zt,Ft,St.data):e.texImage3D(s.TEXTURE_2D_ARRAY,ut,Pt,St.width,St.height,at.depth,0,Zt,Ft,St.data)}else{se&&ye&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,Ht[0].width,Ht[0].height);for(let ut=0,N=Ht.length;ut<N;ut++)St=Ht[ut],E.format!==Tn?Zt!==null?se?e.compressedTexSubImage2D(s.TEXTURE_2D,ut,0,0,St.width,St.height,Zt,St.data):e.compressedTexImage2D(s.TEXTURE_2D,ut,Pt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):se?e.texSubImage2D(s.TEXTURE_2D,ut,0,0,St.width,St.height,Zt,Ft,St.data):e.texImage2D(s.TEXTURE_2D,ut,Pt,St.width,St.height,0,Zt,Ft,St.data)}else if(E.isDataArrayTexture)se?(ye&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,Pt,at.width,at.height,at.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Zt,Ft,at.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Pt,at.width,at.height,at.depth,0,Zt,Ft,at.data);else if(E.isData3DTexture)se?(ye&&e.texStorage3D(s.TEXTURE_3D,Xt,Pt,at.width,at.height,at.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Zt,Ft,at.data)):e.texImage3D(s.TEXTURE_3D,0,Pt,at.width,at.height,at.depth,0,Zt,Ft,at.data);else if(E.isFramebufferTexture){if(ye)if(se)e.texStorage2D(s.TEXTURE_2D,Xt,Pt,at.width,at.height);else{let ut=at.width,N=at.height;for(let gt=0;gt<Xt;gt++)e.texImage2D(s.TEXTURE_2D,gt,Pt,ut,N,0,Zt,Ft,null),ut>>=1,N>>=1}}else if(Ht.length>0&&te){se&&ye&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,Ht[0].width,Ht[0].height);for(let ut=0,N=Ht.length;ut<N;ut++)St=Ht[ut],se?e.texSubImage2D(s.TEXTURE_2D,ut,0,0,Zt,Ft,St):e.texImage2D(s.TEXTURE_2D,ut,Pt,Zt,Ft,St);E.generateMipmaps=!1}else se?(ye&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,at.width,at.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Zt,Ft,at)):e.texImage2D(s.TEXTURE_2D,0,Pt,Zt,Ft,at);y(E,te)&&v(st),bt.__version=et.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function Mt(A,E,k){if(E.image.length!==6)return;let st=nt(A,E),ot=E.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+k);let et=n.get(ot);if(ot.version!==et.__version||st===!0){e.activeTexture(s.TEXTURE0+k);let bt=ee.getPrimaries(ee.workingColorSpace),pt=E.colorSpace===yn?null:ee.getPrimaries(E.colorSpace),yt=E.colorSpace===yn||bt===pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let Tt=E.isCompressedTexture||E.image[0].isCompressedTexture,Ot=E.image[0]&&E.image[0].isDataTexture,at=[];for(let ut=0;ut<6;ut++)!Tt&&!Ot?at[ut]=x(E.image[ut],!1,!0,i.maxCubemapSize):at[ut]=Ot?E.image[ut].image:E.image[ut],at[ut]=it(E,at[ut]);let te=at[0],Zt=m(te)||a,Ft=r.convert(E.format,E.colorSpace),Pt=r.convert(E.type),St=M(E.internalFormat,Ft,Pt,E.colorSpace),Ht=a&&E.isVideoTexture!==!0,se=et.__version===void 0||st===!0,ye=R(E,te,Zt);J(s.TEXTURE_CUBE_MAP,E,Zt);let Xt;if(Tt){Ht&&se&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ye,St,te.width,te.height);for(let ut=0;ut<6;ut++){Xt=at[ut].mipmaps;for(let N=0;N<Xt.length;N++){let gt=Xt[N];E.format!==Tn?Ft!==null?Ht?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N,0,0,gt.width,gt.height,Ft,gt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N,St,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N,0,0,gt.width,gt.height,Ft,Pt,gt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N,St,gt.width,gt.height,0,Ft,Pt,gt.data)}}}else{Xt=E.mipmaps,Ht&&se&&(Xt.length>0&&ye++,e.texStorage2D(s.TEXTURE_CUBE_MAP,ye,St,at[0].width,at[0].height));for(let ut=0;ut<6;ut++)if(Ot){Ht?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,at[ut].width,at[ut].height,Ft,Pt,at[ut].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,St,at[ut].width,at[ut].height,0,Ft,Pt,at[ut].data);for(let N=0;N<Xt.length;N++){let xt=Xt[N].image[ut].image;Ht?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N+1,0,0,xt.width,xt.height,Ft,Pt,xt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N+1,St,xt.width,xt.height,0,Ft,Pt,xt.data)}}else{Ht?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,0,0,Ft,Pt,at[ut]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,St,Ft,Pt,at[ut]);for(let N=0;N<Xt.length;N++){let gt=Xt[N];Ht?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N+1,0,0,Ft,Pt,gt.image[ut]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,N+1,St,Ft,Pt,gt.image[ut])}}}y(E,Zt)&&v(s.TEXTURE_CUBE_MAP),et.__version=ot.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function vt(A,E,k,st,ot,et){let bt=r.convert(k.format,k.colorSpace),pt=r.convert(k.type),yt=M(k.internalFormat,bt,pt,k.colorSpace);if(!n.get(E).__hasExternalTextures){let Ot=Math.max(1,E.width>>et),at=Math.max(1,E.height>>et);ot===s.TEXTURE_3D||ot===s.TEXTURE_2D_ARRAY?e.texImage3D(ot,et,yt,Ot,at,E.depth,0,bt,pt,null):e.texImage2D(ot,et,yt,Ot,at,0,bt,pt,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),G(E)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,st,ot,n.get(k).__webglTexture,0,j(E)):(ot===s.TEXTURE_2D||ot>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,st,ot,n.get(k).__webglTexture,et),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Rt(A,E,k){if(s.bindRenderbuffer(s.RENDERBUFFER,A),E.depthBuffer&&!E.stencilBuffer){let st=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(k||G(E)){let ot=E.depthTexture;ot&&ot.isDepthTexture&&(ot.type===ui?st=s.DEPTH_COMPONENT32F:ot.type===hi&&(st=s.DEPTH_COMPONENT24));let et=j(E);G(E)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,st,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,et,st,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,st,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,A)}else if(E.depthBuffer&&E.stencilBuffer){let st=j(E);k&&G(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,st,s.DEPTH24_STENCIL8,E.width,E.height):G(E)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,st,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,A)}else{let st=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let ot=0;ot<st.length;ot++){let et=st[ot],bt=r.convert(et.format,et.colorSpace),pt=r.convert(et.type),yt=M(et.internalFormat,bt,pt,et.colorSpace),Tt=j(E);k&&G(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Tt,yt,E.width,E.height):G(E)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Tt,yt,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,yt,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ct(A,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),O(E.depthTexture,0);let st=n.get(E.depthTexture).__webglTexture,ot=j(E);if(E.depthTexture.format===zi)G(E)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,st,0,ot):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,st,0);else if(E.depthTexture.format===Es)G(E)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,st,0,ot):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Et(A){let E=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!E.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Ct(E.__webglFramebuffer,A)}else if(k){E.__webglDepthbuffer=[];for(let st=0;st<6;st++)e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[st]),E.__webglDepthbuffer[st]=s.createRenderbuffer(),Rt(E.__webglDepthbuffer[st],A,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Rt(E.__webglDepthbuffer,A,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Dt(A,E,k){let st=n.get(A);E!==void 0&&vt(st.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&Et(A)}function w(A){let E=A.texture,k=n.get(A),st=n.get(E);A.addEventListener("dispose",D),A.isWebGLMultipleRenderTargets!==!0&&(st.__webglTexture===void 0&&(st.__webglTexture=s.createTexture()),st.__version=E.version,o.memory.textures++);let ot=A.isWebGLCubeRenderTarget===!0,et=A.isWebGLMultipleRenderTargets===!0,bt=m(A)||a;if(ot){k.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(a&&E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[pt]=[];for(let yt=0;yt<E.mipmaps.length;yt++)k.__webglFramebuffer[pt][yt]=s.createFramebuffer()}else k.__webglFramebuffer[pt]=s.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let pt=0;pt<E.mipmaps.length;pt++)k.__webglFramebuffer[pt]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(et)if(i.drawBuffers){let pt=A.texture;for(let yt=0,Tt=pt.length;yt<Tt;yt++){let Ot=n.get(pt[yt]);Ot.__webglTexture===void 0&&(Ot.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&G(A)===!1){let pt=et?E:[E];k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let yt=0;yt<pt.length;yt++){let Tt=pt[yt];k.__webglColorRenderbuffer[yt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[yt]);let Ot=r.convert(Tt.format,Tt.colorSpace),at=r.convert(Tt.type),te=M(Tt.internalFormat,Ot,at,Tt.colorSpace,A.isXRRenderTarget===!0),Zt=j(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,Zt,te,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+yt,s.RENDERBUFFER,k.__webglColorRenderbuffer[yt])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),Rt(k.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ot){e.bindTexture(s.TEXTURE_CUBE_MAP,st.__webglTexture),J(s.TEXTURE_CUBE_MAP,E,bt);for(let pt=0;pt<6;pt++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let yt=0;yt<E.mipmaps.length;yt++)vt(k.__webglFramebuffer[pt][yt],A,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,yt);else vt(k.__webglFramebuffer[pt],A,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);y(E,bt)&&v(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){let pt=A.texture;for(let yt=0,Tt=pt.length;yt<Tt;yt++){let Ot=pt[yt],at=n.get(Ot);e.bindTexture(s.TEXTURE_2D,at.__webglTexture),J(s.TEXTURE_2D,Ot,bt),vt(k.__webglFramebuffer,A,Ot,s.COLOR_ATTACHMENT0+yt,s.TEXTURE_2D,0),y(Ot,bt)&&v(s.TEXTURE_2D)}e.unbindTexture()}else{let pt=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?pt=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(pt,st.__webglTexture),J(pt,E,bt),a&&E.mipmaps&&E.mipmaps.length>0)for(let yt=0;yt<E.mipmaps.length;yt++)vt(k.__webglFramebuffer[yt],A,E,s.COLOR_ATTACHMENT0,pt,yt);else vt(k.__webglFramebuffer,A,E,s.COLOR_ATTACHMENT0,pt,0);y(E,bt)&&v(pt),e.unbindTexture()}A.depthBuffer&&Et(A)}function V(A){let E=m(A)||a,k=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let st=0,ot=k.length;st<ot;st++){let et=k[st];if(y(et,E)){let bt=A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,pt=n.get(et).__webglTexture;e.bindTexture(bt,pt),v(bt),e.unbindTexture()}}}function F(A){if(a&&A.samples>0&&G(A)===!1){let E=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],k=A.width,st=A.height,ot=s.COLOR_BUFFER_BIT,et=[],bt=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=n.get(A),yt=A.isWebGLMultipleRenderTargets===!0;if(yt)for(let Tt=0;Tt<E.length;Tt++)e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let Tt=0;Tt<E.length;Tt++){et.push(s.COLOR_ATTACHMENT0+Tt),A.depthBuffer&&et.push(bt);let Ot=pt.__ignoreDepthValues!==void 0?pt.__ignoreDepthValues:!1;if(Ot===!1&&(A.depthBuffer&&(ot|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&(ot|=s.STENCIL_BUFFER_BIT)),yt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,pt.__webglColorRenderbuffer[Tt]),Ot===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[bt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[bt])),yt){let at=n.get(E[Tt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,at,0)}s.blitFramebuffer(0,0,k,st,0,0,k,st,ot,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),yt)for(let Tt=0;Tt<E.length;Tt++){e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.RENDERBUFFER,pt.__webglColorRenderbuffer[Tt]);let Ot=n.get(E[Tt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Tt,s.TEXTURE_2D,Ot,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}}function j(A){return Math.min(i.maxSamples,A.samples)}function G(A){let E=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function rt(A){let E=o.render.frame;h.get(A)!==E&&(h.set(A,E),A.update())}function it(A,E){let k=A.colorSpace,st=A.format,ot=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Mc||k!==Qn&&k!==yn&&(ee.getTransfer(k)===le?a===!1?t.has("EXT_sRGB")===!0&&st===Tn?(A.format=Mc,A.minFilter=vn,A.generateMipmaps=!1):E=So.sRGBToLinear(E):(st!==Tn||ot!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),E}this.allocateTextureUnit=I,this.resetTextureUnits=H,this.setTexture2D=O,this.setTexture2DArray=K,this.setTexture3D=Q,this.setTextureCube=Z,this.rebindTextures=Dt,this.setupRenderTarget=w,this.updateRenderTargetMipmap=V,this.updateMultisampleRenderTarget=F,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=G}function Vx(s,t,e){let n=e.isWebGL2;function i(r,o=yn){let a,c=ee.getTransfer(o);if(r===An)return s.UNSIGNED_BYTE;if(r===Fu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Bu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Sd)return s.BYTE;if(r===Ed)return s.SHORT;if(r===dl)return s.UNSIGNED_SHORT;if(r===zu)return s.INT;if(r===hi)return s.UNSIGNED_INT;if(r===ui)return s.FLOAT;if(r===hn)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===wd)return s.ALPHA;if(r===Tn)return s.RGBA;if(r===Td)return s.LUMINANCE;if(r===Ad)return s.LUMINANCE_ALPHA;if(r===zi)return s.DEPTH_COMPONENT;if(r===Es)return s.DEPTH_STENCIL;if(r===Mc)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Rd)return s.RED;if(r===Ou)return s.RED_INTEGER;if(r===Cd)return s.RG;if(r===ku)return s.RG_INTEGER;if(r===Hu)return s.RGBA_INTEGER;if(r===Na||r===za||r===Fa||r===Ba)if(c===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Na)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===za)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Fa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Na)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===za)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Fa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Ba)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===sh||r===rh||r===oh||r===ah)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===sh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===rh)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===oh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ah)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Vu)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ch||r===lh)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===ch)return c===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===lh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===hh||r===uh||r===fh||r===dh||r===ph||r===mh||r===gh||r===xh||r===vh||r===yh||r===_h||r===Mh||r===bh||r===Sh)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===hh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===uh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===fh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===dh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ph)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===mh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===gh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===xh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===vh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===yh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===_h)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Mh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===bh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Sh)return c===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Oa||r===Eh||r===wh)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Oa)return c===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Eh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===wh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Pd||r===Th||r===Ah||r===Rh)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Oa)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Th)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ah)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Rh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ni?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}var Nc=class extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Ne=class extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gx={type:"move"},cr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,n),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gx)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},zc=class extends mi{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null,x=e.getContextAttributes(),m=null,p=null,y=[],v=[],M=new tt,R=null,S=new Be;S.layers.enable(1),S.viewport=new de;let T=new Be;T.layers.enable(2),T.viewport=new de;let D=[S,T],_=new Nc;_.layers.enable(1),_.layers.enable(2);let b=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let nt=y[J];return nt===void 0&&(nt=new cr,y[J]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(J){let nt=y[J];return nt===void 0&&(nt=new cr,y[J]=nt),nt.getGripSpace()},this.getHand=function(J){let nt=y[J];return nt===void 0&&(nt=new cr,y[J]=nt),nt.getHandSpace()};function L(J){let nt=v.indexOf(J.inputSource);if(nt===-1)return;let mt=y[nt];mt!==void 0&&(mt.update(J.inputSource,J.frame,l||o),mt.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){i.removeEventListener("select",L),i.removeEventListener("selectstart",L),i.removeEventListener("selectend",L),i.removeEventListener("squeeze",L),i.removeEventListener("squeezestart",L),i.removeEventListener("squeezeend",L),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",I);for(let J=0;J<y.length;J++){let nt=v[J];nt!==null&&(v[J]=null,y[J].disconnect(nt))}b=null,U=null,t.setRenderTarget(m),d=null,f=null,u=null,i=null,p=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",L),i.addEventListener("selectstart",L),i.addEventListener("selectend",L),i.addEventListener("squeeze",L),i.addEventListener("squeezestart",L),i.addEventListener("squeezeend",L),i.addEventListener("end",H),i.addEventListener("inputsourceschange",I),x.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(M),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let nt={antialias:i.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new He(d.framebufferWidth,d.framebufferHeight,{format:Tn,type:An,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let nt=null,mt=null,Mt=null;x.depth&&(Mt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=x.stencil?Es:zi,mt=x.stencil?Ni:hi);let vt={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:r};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(vt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new He(f.textureWidth,f.textureHeight,{format:Tn,type:An,depthTexture:new Lo(f.textureWidth,f.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});let Rt=t.properties.get(p);Rt.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),ct.setContext(i),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function I(J){for(let nt=0;nt<J.removed.length;nt++){let mt=J.removed[nt],Mt=v.indexOf(mt);Mt>=0&&(v[Mt]=null,y[Mt].disconnect(mt))}for(let nt=0;nt<J.added.length;nt++){let mt=J.added[nt],Mt=v.indexOf(mt);if(Mt===-1){for(let Rt=0;Rt<y.length;Rt++)if(Rt>=v.length){v.push(mt),Mt=Rt;break}else if(v[Rt]===null){v[Rt]=mt,Mt=Rt;break}if(Mt===-1)break}let vt=y[Mt];vt&&vt.connect(mt)}}let z=new P,O=new P;function K(J,nt,mt){z.setFromMatrixPosition(nt.matrixWorld),O.setFromMatrixPosition(mt.matrixWorld);let Mt=z.distanceTo(O),vt=nt.projectionMatrix.elements,Rt=mt.projectionMatrix.elements,Ct=vt[14]/(vt[10]-1),Et=vt[14]/(vt[10]+1),Dt=(vt[9]+1)/vt[5],w=(vt[9]-1)/vt[5],V=(vt[8]-1)/vt[0],F=(Rt[8]+1)/Rt[0],j=Ct*V,G=Ct*F,rt=Mt/(-V+F),it=rt*-V;nt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(it),J.translateZ(rt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();let A=Ct+rt,E=Et+rt,k=j-it,st=G+(Mt-it),ot=Dt*Et/E*A,et=w*Et/E*A;J.projectionMatrix.makePerspective(k,st,ot,et,A,E),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function Q(J,nt){nt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(nt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;_.near=T.near=S.near=J.near,_.far=T.far=S.far=J.far,(b!==_.near||U!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),b=_.near,U=_.far);let nt=J.parent,mt=_.cameras;Q(_,nt);for(let Mt=0;Mt<mt.length;Mt++)Q(mt[Mt],nt);mt.length===2?K(_,S,T):_.projectionMatrix.copy(S.projectionMatrix),Z(J,_,nt)};function Z(J,nt,mt){mt===null?J.matrix.copy(nt.matrixWorld):(J.matrix.copy(mt.matrixWorld),J.matrix.invert(),J.matrix.multiply(nt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(nt.projectionMatrix),J.projectionMatrixInverse.copy(nt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=ws*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)};let X=null;function Y(J,nt){if(h=nt.getViewerPose(l||o),g=nt,h!==null){let mt=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let Mt=!1;mt.length!==_.cameras.length&&(_.cameras.length=0,Mt=!0);for(let vt=0;vt<mt.length;vt++){let Rt=mt[vt],Ct=null;if(d!==null)Ct=d.getViewport(Rt);else{let Dt=u.getViewSubImage(f,Rt);Ct=Dt.viewport,vt===0&&(t.setRenderTargetTextures(p,Dt.colorTexture,f.ignoreDepthValues?void 0:Dt.depthStencilTexture),t.setRenderTarget(p))}let Et=D[vt];Et===void 0&&(Et=new Be,Et.layers.enable(vt),Et.viewport=new de,D[vt]=Et),Et.matrix.fromArray(Rt.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Rt.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Ct.x,Ct.y,Ct.width,Ct.height),vt===0&&(_.matrix.copy(Et.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),Mt===!0&&_.cameras.push(Et)}}for(let mt=0;mt<y.length;mt++){let Mt=v[mt],vt=y[mt];Mt!==null&&vt!==void 0&&vt.update(Mt,nt,l||o)}X&&X(J,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}let ct=new $u;ct.setAnimationLoop(Y),this.setAnimationLoop=function(J){X=J},this.dispose=function(){}}};function Wx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Zu(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,y,v,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,y,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ze&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ze&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let y=t.get(p).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;let v=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,y,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ze&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Xx(s,t,e,n){let i={},r={},o=[],a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(y,v){let M=v.program;n.uniformBlockBinding(y,M)}function l(y,v){let M=i[y.id];M===void 0&&(g(y),M=h(y),i[y.id]=M,y.addEventListener("dispose",m));let R=v.program;n.updateUBOMapping(y,R);let S=t.render.frame;r[y.id]!==S&&(f(y),r[y.id]=S)}function h(y){let v=u();y.__bindingPointIndex=v;let M=s.createBuffer(),R=y.__size,S=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,R,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,M),M}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){let v=i[y.id],M=y.uniforms,R=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let S=0,T=M.length;S<T;S++){let D=Array.isArray(M[S])?M[S]:[M[S]];for(let _=0,b=D.length;_<b;_++){let U=D[_];if(d(U,S,_,R)===!0){let L=U.__offset,H=Array.isArray(U.value)?U.value:[U.value],I=0;for(let z=0;z<H.length;z++){let O=H[z],K=x(O);typeof O=="number"||typeof O=="boolean"?(U.__data[0]=O,s.bufferSubData(s.UNIFORM_BUFFER,L+I,U.__data)):O.isMatrix3?(U.__data[0]=O.elements[0],U.__data[1]=O.elements[1],U.__data[2]=O.elements[2],U.__data[3]=0,U.__data[4]=O.elements[3],U.__data[5]=O.elements[4],U.__data[6]=O.elements[5],U.__data[7]=0,U.__data[8]=O.elements[6],U.__data[9]=O.elements[7],U.__data[10]=O.elements[8],U.__data[11]=0):(O.toArray(U.__data,I),I+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,U.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(y,v,M,R){let S=y.value,T=v+"_"+M;if(R[T]===void 0)return typeof S=="number"||typeof S=="boolean"?R[T]=S:R[T]=S.clone(),!0;{let D=R[T];if(typeof S=="number"||typeof S=="boolean"){if(D!==S)return R[T]=S,!0}else if(D.equals(S)===!1)return D.copy(S),!0}return!1}function g(y){let v=y.uniforms,M=0,R=16;for(let T=0,D=v.length;T<D;T++){let _=Array.isArray(v[T])?v[T]:[v[T]];for(let b=0,U=_.length;b<U;b++){let L=_[b],H=Array.isArray(L.value)?L.value:[L.value];for(let I=0,z=H.length;I<z;I++){let O=H[I],K=x(O),Q=M%R;Q!==0&&R-Q<K.boundary&&(M+=R-Q),L.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=M,M+=K.storage}}}let S=M%R;return S>0&&(M+=R-S),y.__size=M,y.__cache={},this}function x(y){let v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){let v=y.target;v.removeEventListener("dispose",m);let M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function p(){for(let y in i)s.deleteBuffer(i[y]);o=[],i={},r={}}return{bind:c,update:l,dispose:p}}var mr=class{constructor(t={}){let{canvas:e=ep(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let d=new Uint32Array(4),g=new Int32Array(4),x=null,m=null,p=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Se,this._useLegacyLights=!1,this.toneMapping=di,this.toneMappingExposure=1;let v=this,M=!1,R=0,S=0,T=null,D=-1,_=null,b=new de,U=new de,L=null,H=new lt(0),I=0,z=e.width,O=e.height,K=1,Q=null,Z=null,X=new de(0,0,z,O),Y=new de(0,0,z,O),ct=!1,J=new pr,nt=!1,mt=!1,Mt=null,vt=new Kt,Rt=new tt,Ct=new P,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Dt(){return T===null?K:1}let w=n;function V(C,B){for(let q=0;q<C.length;q++){let $=C[q],W=e.getContext($,B);if(W!==null)return W}return null}try{let C={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",N,!1),e.addEventListener("webglcontextcreationerror",gt,!1),w===null){let B=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&B.shift(),w=V(B,C),w===null)throw V(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&w instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),w.getShaderPrecisionFormat===void 0&&(w.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let F,j,G,rt,it,A,E,k,st,ot,et,bt,pt,yt,Tt,Ot,at,te,Zt,Ft,Pt,St,Ht,se;function ye(){F=new hg(w),j=new sg(w,F,t),F.init(j),St=new Vx(w,F,j),G=new kx(w,F,j),rt=new dg(w),it=new Rx,A=new Hx(w,F,G,it,j,St,rt),E=new og(v),k=new lg(v),st=new Mp(w,j),Ht=new ng(w,F,st,j),ot=new ug(w,st,rt,Ht),et=new xg(w,ot,st,rt),Zt=new gg(w,j,A),Ot=new rg(it),bt=new Ax(v,E,k,F,j,Ht,Ot),pt=new Wx(v,it),yt=new Px,Tt=new zx(F,j),te=new eg(v,E,k,G,et,f,c),at=new Ox(v,et,j),se=new Xx(w,rt,j,G),Ft=new ig(w,F,rt,j),Pt=new fg(w,F,rt,j),rt.programs=bt.programs,v.capabilities=j,v.extensions=F,v.properties=it,v.renderLists=yt,v.shadowMap=at,v.state=G,v.info=rt}ye();let Xt=new zc(v,w);this.xr=Xt,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){let C=F.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=F.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(C){C!==void 0&&(K=C,this.setSize(z,O,!1))},this.getSize=function(C){return C.set(z,O)},this.setSize=function(C,B,q=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=C,O=B,e.width=Math.floor(C*K),e.height=Math.floor(B*K),q===!0&&(e.style.width=C+"px",e.style.height=B+"px"),this.setViewport(0,0,C,B)},this.getDrawingBufferSize=function(C){return C.set(z*K,O*K).floor()},this.setDrawingBufferSize=function(C,B,q){z=C,O=B,K=q,e.width=Math.floor(C*q),e.height=Math.floor(B*q),this.setViewport(0,0,C,B)},this.getCurrentViewport=function(C){return C.copy(b)},this.getViewport=function(C){return C.copy(X)},this.setViewport=function(C,B,q,$){C.isVector4?X.set(C.x,C.y,C.z,C.w):X.set(C,B,q,$),G.viewport(b.copy(X).multiplyScalar(K).floor())},this.getScissor=function(C){return C.copy(Y)},this.setScissor=function(C,B,q,$){C.isVector4?Y.set(C.x,C.y,C.z,C.w):Y.set(C,B,q,$),G.scissor(U.copy(Y).multiplyScalar(K).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(C){G.setScissorTest(ct=C)},this.setOpaqueSort=function(C){Q=C},this.setTransparentSort=function(C){Z=C},this.getClearColor=function(C){return C.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor.apply(te,arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha.apply(te,arguments)},this.clear=function(C=!0,B=!0,q=!0){let $=0;if(C){let W=!1;if(T!==null){let _t=T.texture.format;W=_t===Hu||_t===ku||_t===Ou}if(W){let _t=T.texture.type,wt=_t===An||_t===hi||_t===dl||_t===Ni||_t===Fu||_t===Bu,Ut=te.getClearColor(),zt=te.getClearAlpha(),Gt=Ut.r,Bt=Ut.g,kt=Ut.b;wt?(d[0]=Gt,d[1]=Bt,d[2]=kt,d[3]=zt,w.clearBufferuiv(w.COLOR,0,d)):(g[0]=Gt,g[1]=Bt,g[2]=kt,g[3]=zt,w.clearBufferiv(w.COLOR,0,g))}else $|=w.COLOR_BUFFER_BIT}B&&($|=w.DEPTH_BUFFER_BIT),q&&($|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",N,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),yt.dispose(),Tt.dispose(),it.dispose(),E.dispose(),k.dispose(),et.dispose(),Ht.dispose(),se.dispose(),bt.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",Qe),Xt.removeEventListener("sessionend",fe),Mt&&(Mt.dispose(),Mt=null),je.stop()};function ut(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;let C=rt.autoReset,B=at.enabled,q=at.autoUpdate,$=at.needsUpdate,W=at.type;ye(),rt.autoReset=C,at.enabled=B,at.autoUpdate=q,at.needsUpdate=$,at.type=W}function gt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function xt(C){let B=C.target;B.removeEventListener("dispose",xt),Nt(B)}function Nt(C){Lt(C),it.remove(C)}function Lt(C){let B=it.get(C).programs;B!==void 0&&(B.forEach(function(q){bt.releaseProgram(q)}),C.isShaderMaterial&&bt.releaseShaderCache(C))}this.renderBufferDirect=function(C,B,q,$,W,_t){B===null&&(B=Et);let wt=W.isMesh&&W.matrixWorld.determinant()<0,Ut=Wf(C,B,q,$,W);G.setMaterial($,wt);let zt=q.index,Gt=1;if($.wireframe===!0){if(zt=ot.getWireframeAttribute(q),zt===void 0)return;Gt=2}let Bt=q.drawRange,kt=q.attributes.position,be=Bt.start*Gt,an=(Bt.start+Bt.count)*Gt;_t!==null&&(be=Math.max(be,_t.start*Gt),an=Math.min(an,(_t.start+_t.count)*Gt)),zt!==null?(be=Math.max(be,0),an=Math.min(an,zt.count)):kt!=null&&(be=Math.max(be,0),an=Math.min(an,kt.count));let Le=an-be;if(Le<0||Le===1/0)return;Ht.setup(W,$,Ut,q,zt);let Gn,ge=Ft;if(zt!==null&&(Gn=st.get(zt),ge=Pt,ge.setIndex(Gn)),W.isMesh)$.wireframe===!0?(G.setLineWidth($.wireframeLinewidth*Dt()),ge.setMode(w.LINES)):ge.setMode(w.TRIANGLES);else if(W.isLine){let qt=$.linewidth;qt===void 0&&(qt=1),G.setLineWidth(qt*Dt()),W.isLineSegments?ge.setMode(w.LINES):W.isLineLoop?ge.setMode(w.LINE_LOOP):ge.setMode(w.LINE_STRIP)}else W.isPoints?ge.setMode(w.POINTS):W.isSprite&&ge.setMode(w.TRIANGLES);if(W.isBatchedMesh)ge.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else if(W.isInstancedMesh)ge.renderInstances(be,Le,W.count);else if(q.isInstancedBufferGeometry){let qt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Pa=Math.min(q.instanceCount,qt);ge.renderInstances(be,Le,Pa)}else ge.render(be,Le)};function he(C,B,q){C.transparent===!0&&C.side===Oe&&C.forceSinglePass===!1?(C.side=Ze,C.needsUpdate=!0,Ur(C,B,q),C.side=pi,C.needsUpdate=!0,Ur(C,B,q),C.side=Oe):Ur(C,B,q)}this.compile=function(C,B,q=null){q===null&&(q=C),m=Tt.get(q),m.init(),y.push(m),q.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),C!==q&&C.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),m.setupLights(v._useLegacyLights);let $=new Set;return C.traverse(function(W){let _t=W.material;if(_t)if(Array.isArray(_t))for(let wt=0;wt<_t.length;wt++){let Ut=_t[wt];he(Ut,q,W),$.add(Ut)}else he(_t,q,W),$.add(_t)}),y.pop(),m=null,$},this.compileAsync=function(C,B,q=null){let $=this.compile(C,B,q);return new Promise(W=>{function _t(){if($.forEach(function(wt){it.get(wt).currentProgram.isReady()&&$.delete(wt)}),$.size===0){W(C);return}setTimeout(_t,10)}F.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let ue=null;function Ie(C){ue&&ue(C)}function Qe(){je.stop()}function fe(){je.start()}let je=new $u;je.setAnimationLoop(Ie),typeof self<"u"&&je.setContext(self),this.setAnimationLoop=function(C){ue=C,Xt.setAnimationLoop(C),C===null?je.stop():je.start()},Xt.addEventListener("sessionstart",Qe),Xt.addEventListener("sessionend",fe),this.render=function(C,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(B),B=Xt.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,B,T),m=Tt.get(C,y.length),m.init(),y.push(m),vt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),J.setFromProjectionMatrix(vt),mt=this.localClippingEnabled,nt=Ot.init(this.clippingPlanes,mt),x=yt.get(C,p.length),x.init(),p.push(x),Un(C,B,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(Q,Z),this.info.render.frame++,nt===!0&&Ot.beginShadows();let q=m.state.shadowsArray;if(at.render(q,C,B),nt===!0&&Ot.endShadows(),this.info.autoReset===!0&&this.info.reset(),te.render(x,C),m.setupLights(v._useLegacyLights),B.isArrayCamera){let $=B.cameras;for(let W=0,_t=$.length;W<_t;W++){let wt=$[W];ql(x,C,wt,wt.viewport)}}else ql(x,C,B);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,B),Ht.resetDefaultState(),D=-1,_=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function Un(C,B,q,$){if(C.visible===!1)return;if(C.layers.test(B.layers)){if(C.isGroup)q=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(B);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||J.intersectsSprite(C)){$&&Ct.setFromMatrixPosition(C.matrixWorld).applyMatrix4(vt);let wt=et.update(C),Ut=C.material;Ut.visible&&x.push(C,wt,Ut,q,Ct.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||J.intersectsObject(C))){let wt=et.update(C),Ut=C.material;if($&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ct.copy(C.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Ct.copy(wt.boundingSphere.center)),Ct.applyMatrix4(C.matrixWorld).applyMatrix4(vt)),Array.isArray(Ut)){let zt=wt.groups;for(let Gt=0,Bt=zt.length;Gt<Bt;Gt++){let kt=zt[Gt],be=Ut[kt.materialIndex];be&&be.visible&&x.push(C,wt,be,q,Ct.z,kt)}}else Ut.visible&&x.push(C,wt,Ut,q,Ct.z,null)}}let _t=C.children;for(let wt=0,Ut=_t.length;wt<Ut;wt++)Un(_t[wt],B,q,$)}function ql(C,B,q,$){let W=C.opaque,_t=C.transmissive,wt=C.transparent;m.setupLightsView(q),nt===!0&&Ot.setGlobalState(v.clippingPlanes,q),_t.length>0&&Gf(W,_t,B,q),$&&G.viewport(b.copy($)),W.length>0&&Dr(W,B,q),_t.length>0&&Dr(_t,B,q),wt.length>0&&Dr(wt,B,q),G.buffers.depth.setTest(!0),G.buffers.depth.setMask(!0),G.buffers.color.setMask(!0),G.setPolygonOffset(!1)}function Gf(C,B,q,$){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;let _t=j.isWebGL2;Mt===null&&(Mt=new He(1,1,{generateMipmaps:!0,type:F.has("EXT_color_buffer_half_float")?hn:An,minFilter:dr,samples:_t?4:0})),v.getDrawingBufferSize(Rt),_t?Mt.setSize(Rt.x,Rt.y):Mt.setSize(Mo(Rt.x),Mo(Rt.y));let wt=v.getRenderTarget();v.setRenderTarget(Mt),v.getClearColor(H),I=v.getClearAlpha(),I<1&&v.setClearColor(16777215,.5),v.clear();let Ut=v.toneMapping;v.toneMapping=di,Dr(C,q,$),A.updateMultisampleRenderTarget(Mt),A.updateRenderTargetMipmap(Mt);let zt=!1;for(let Gt=0,Bt=B.length;Gt<Bt;Gt++){let kt=B[Gt],be=kt.object,an=kt.geometry,Le=kt.material,Gn=kt.group;if(Le.side===Oe&&be.layers.test($.layers)){let ge=Le.side;Le.side=Ze,Le.needsUpdate=!0,Yl(be,q,$,an,Le,Gn),Le.side=ge,Le.needsUpdate=!0,zt=!0}}zt===!0&&(A.updateMultisampleRenderTarget(Mt),A.updateRenderTargetMipmap(Mt)),v.setRenderTarget(wt),v.setClearColor(H,I),v.toneMapping=Ut}function Dr(C,B,q){let $=B.isScene===!0?B.overrideMaterial:null;for(let W=0,_t=C.length;W<_t;W++){let wt=C[W],Ut=wt.object,zt=wt.geometry,Gt=$===null?wt.material:$,Bt=wt.group;Ut.layers.test(q.layers)&&Yl(Ut,B,q,zt,Gt,Bt)}}function Yl(C,B,q,$,W,_t){C.onBeforeRender(v,B,q,$,W,_t),C.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),W.onBeforeRender(v,B,q,$,C,_t),W.transparent===!0&&W.side===Oe&&W.forceSinglePass===!1?(W.side=Ze,W.needsUpdate=!0,v.renderBufferDirect(q,B,$,W,C,_t),W.side=pi,W.needsUpdate=!0,v.renderBufferDirect(q,B,$,W,C,_t),W.side=Oe):v.renderBufferDirect(q,B,$,W,C,_t),C.onAfterRender(v,B,q,$,W,_t)}function Ur(C,B,q){B.isScene!==!0&&(B=Et);let $=it.get(C),W=m.state.lights,_t=m.state.shadowsArray,wt=W.state.version,Ut=bt.getParameters(C,W.state,_t,B,q),zt=bt.getProgramCacheKey(Ut),Gt=$.programs;$.environment=C.isMeshStandardMaterial?B.environment:null,$.fog=B.fog,$.envMap=(C.isMeshStandardMaterial?k:E).get(C.envMap||$.environment),Gt===void 0&&(C.addEventListener("dispose",xt),Gt=new Map,$.programs=Gt);let Bt=Gt.get(zt);if(Bt!==void 0){if($.currentProgram===Bt&&$.lightsStateVersion===wt)return $l(C,Ut),Bt}else Ut.uniforms=bt.getUniforms(C),C.onBuild(q,Ut,v),C.onBeforeCompile(Ut,v),Bt=bt.acquireProgram(Ut,zt),Gt.set(zt,Bt),$.uniforms=Ut.uniforms;let kt=$.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(kt.clippingPlanes=Ot.uniform),$l(C,Ut),$.needsLights=qf(C),$.lightsStateVersion=wt,$.needsLights&&(kt.ambientLightColor.value=W.state.ambient,kt.lightProbe.value=W.state.probe,kt.directionalLights.value=W.state.directional,kt.directionalLightShadows.value=W.state.directionalShadow,kt.spotLights.value=W.state.spot,kt.spotLightShadows.value=W.state.spotShadow,kt.rectAreaLights.value=W.state.rectArea,kt.ltc_1.value=W.state.rectAreaLTC1,kt.ltc_2.value=W.state.rectAreaLTC2,kt.pointLights.value=W.state.point,kt.pointLightShadows.value=W.state.pointShadow,kt.hemisphereLights.value=W.state.hemi,kt.directionalShadowMap.value=W.state.directionalShadowMap,kt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,kt.spotShadowMap.value=W.state.spotShadowMap,kt.spotLightMatrix.value=W.state.spotLightMatrix,kt.spotLightMap.value=W.state.spotLightMap,kt.pointShadowMap.value=W.state.pointShadowMap,kt.pointShadowMatrix.value=W.state.pointShadowMatrix),$.currentProgram=Bt,$.uniformsList=null,Bt}function Zl(C){if(C.uniformsList===null){let B=C.currentProgram.getUniforms();C.uniformsList=Ms.seqWithValue(B.seq,C.uniforms)}return C.uniformsList}function $l(C,B){let q=it.get(C);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function Wf(C,B,q,$,W){B.isScene!==!0&&(B=Et),A.resetTextureUnits();let _t=B.fog,wt=$.isMeshStandardMaterial?B.environment:null,Ut=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Qn,zt=($.isMeshStandardMaterial?k:E).get($.envMap||wt),Gt=$.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Bt=!!q.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),kt=!!q.morphAttributes.position,be=!!q.morphAttributes.normal,an=!!q.morphAttributes.color,Le=di;$.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Le=v.toneMapping);let Gn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ge=Gn!==void 0?Gn.length:0,qt=it.get($),Pa=m.state.lights;if(nt===!0&&(mt===!0||C!==_)){let gn=C===_&&$.id===D;Ot.setState($,C,gn)}let _e=!1;$.version===qt.__version?(qt.needsLights&&qt.lightsStateVersion!==Pa.state.version||qt.outputColorSpace!==Ut||W.isBatchedMesh&&qt.batching===!1||!W.isBatchedMesh&&qt.batching===!0||W.isInstancedMesh&&qt.instancing===!1||!W.isInstancedMesh&&qt.instancing===!0||W.isSkinnedMesh&&qt.skinning===!1||!W.isSkinnedMesh&&qt.skinning===!0||W.isInstancedMesh&&qt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&qt.instancingColor===!1&&W.instanceColor!==null||qt.envMap!==zt||$.fog===!0&&qt.fog!==_t||qt.numClippingPlanes!==void 0&&(qt.numClippingPlanes!==Ot.numPlanes||qt.numIntersection!==Ot.numIntersection)||qt.vertexAlphas!==Gt||qt.vertexTangents!==Bt||qt.morphTargets!==kt||qt.morphNormals!==be||qt.morphColors!==an||qt.toneMapping!==Le||j.isWebGL2===!0&&qt.morphTargetsCount!==ge)&&(_e=!0):(_e=!0,qt.__version=$.version);let wi=qt.currentProgram;_e===!0&&(wi=Ur($,B,W));let Jl=!1,Zs=!1,Ia=!1,Xe=wi.getUniforms(),Ti=qt.uniforms;if(G.useProgram(wi.program)&&(Jl=!0,Zs=!0,Ia=!0),$.id!==D&&(D=$.id,Zs=!0),Jl||_!==C){Xe.setValue(w,"projectionMatrix",C.projectionMatrix),Xe.setValue(w,"viewMatrix",C.matrixWorldInverse);let gn=Xe.map.cameraPosition;gn!==void 0&&gn.setValue(w,Ct.setFromMatrixPosition(C.matrixWorld)),j.logarithmicDepthBuffer&&Xe.setValue(w,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Xe.setValue(w,"isOrthographic",C.isOrthographicCamera===!0),_!==C&&(_=C,Zs=!0,Ia=!0)}if(W.isSkinnedMesh){Xe.setOptional(w,W,"bindMatrix"),Xe.setOptional(w,W,"bindMatrixInverse");let gn=W.skeleton;gn&&(j.floatVertexTextures?(gn.boneTexture===null&&gn.computeBoneTexture(),Xe.setValue(w,"boneTexture",gn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}W.isBatchedMesh&&(Xe.setOptional(w,W,"batchingTexture"),Xe.setValue(w,"batchingTexture",W._matricesTexture,A));let La=q.morphAttributes;if((La.position!==void 0||La.normal!==void 0||La.color!==void 0&&j.isWebGL2===!0)&&Zt.update(W,q,wi),(Zs||qt.receiveShadow!==W.receiveShadow)&&(qt.receiveShadow=W.receiveShadow,Xe.setValue(w,"receiveShadow",W.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(Ti.envMap.value=zt,Ti.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Zs&&(Xe.setValue(w,"toneMappingExposure",v.toneMappingExposure),qt.needsLights&&Xf(Ti,Ia),_t&&$.fog===!0&&pt.refreshFogUniforms(Ti,_t),pt.refreshMaterialUniforms(Ti,$,K,O,Mt),Ms.upload(w,Zl(qt),Ti,A)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Ms.upload(w,Zl(qt),Ti,A),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Xe.setValue(w,"center",W.center),Xe.setValue(w,"modelViewMatrix",W.modelViewMatrix),Xe.setValue(w,"normalMatrix",W.normalMatrix),Xe.setValue(w,"modelMatrix",W.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){let gn=$.uniformsGroups;for(let Da=0,Yf=gn.length;Da<Yf;Da++)if(j.isWebGL2){let Kl=gn[Da];se.update(Kl,wi),se.bind(Kl,wi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return wi}function Xf(C,B){C.ambientLightColor.needsUpdate=B,C.lightProbe.needsUpdate=B,C.directionalLights.needsUpdate=B,C.directionalLightShadows.needsUpdate=B,C.pointLights.needsUpdate=B,C.pointLightShadows.needsUpdate=B,C.spotLights.needsUpdate=B,C.spotLightShadows.needsUpdate=B,C.rectAreaLights.needsUpdate=B,C.hemisphereLights.needsUpdate=B}function qf(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,B,q){it.get(C.texture).__webglTexture=B,it.get(C.depthTexture).__webglTexture=q;let $=it.get(C);$.__hasExternalTextures=!0,$.__hasExternalTextures&&($.__autoAllocateDepthBuffer=q===void 0,$.__autoAllocateDepthBuffer||F.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,B){let q=it.get(C);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(C,B=0,q=0){T=C,R=B,S=q;let $=!0,W=null,_t=!1,wt=!1;if(C){let zt=it.get(C);zt.__useDefaultFramebuffer!==void 0?(G.bindFramebuffer(w.FRAMEBUFFER,null),$=!1):zt.__webglFramebuffer===void 0?A.setupRenderTarget(C):zt.__hasExternalTextures&&A.rebindTextures(C,it.get(C.texture).__webglTexture,it.get(C.depthTexture).__webglTexture);let Gt=C.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(wt=!0);let Bt=it.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Bt[B])?W=Bt[B][q]:W=Bt[B],_t=!0):j.isWebGL2&&C.samples>0&&A.useMultisampledRTT(C)===!1?W=it.get(C).__webglMultisampledFramebuffer:Array.isArray(Bt)?W=Bt[q]:W=Bt,b.copy(C.viewport),U.copy(C.scissor),L=C.scissorTest}else b.copy(X).multiplyScalar(K).floor(),U.copy(Y).multiplyScalar(K).floor(),L=ct;if(G.bindFramebuffer(w.FRAMEBUFFER,W)&&j.drawBuffers&&$&&G.drawBuffers(C,W),G.viewport(b),G.scissor(U),G.setScissorTest(L),_t){let zt=it.get(C.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+B,zt.__webglTexture,q)}else if(wt){let zt=it.get(C.texture),Gt=B||0;w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,zt.__webglTexture,q||0,Gt)}D=-1},this.readRenderTargetPixels=function(C,B,q,$,W,_t,wt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=it.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&wt!==void 0&&(Ut=Ut[wt]),Ut){G.bindFramebuffer(w.FRAMEBUFFER,Ut);try{let zt=C.texture,Gt=zt.format,Bt=zt.type;if(Gt!==Tn&&St.convert(Gt)!==w.getParameter(w.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let kt=Bt===hn&&(F.has("EXT_color_buffer_half_float")||j.isWebGL2&&F.has("EXT_color_buffer_float"));if(Bt!==An&&St.convert(Bt)!==w.getParameter(w.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Bt===ui&&(j.isWebGL2||F.has("OES_texture_float")||F.has("WEBGL_color_buffer_float")))&&!kt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=C.width-$&&q>=0&&q<=C.height-W&&w.readPixels(B,q,$,W,St.convert(Gt),St.convert(Bt),_t)}finally{let zt=T!==null?it.get(T).__webglFramebuffer:null;G.bindFramebuffer(w.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(C,B,q=0){let $=Math.pow(2,-q),W=Math.floor(B.image.width*$),_t=Math.floor(B.image.height*$);A.setTexture2D(B,0),w.copyTexSubImage2D(w.TEXTURE_2D,q,0,0,C.x,C.y,W,_t),G.unbindTexture()},this.copyTextureToTexture=function(C,B,q,$=0){let W=B.image.width,_t=B.image.height,wt=St.convert(q.format),Ut=St.convert(q.type);A.setTexture2D(q,0),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,q.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,q.unpackAlignment),B.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,$,C.x,C.y,W,_t,wt,Ut,B.image.data):B.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,$,C.x,C.y,B.mipmaps[0].width,B.mipmaps[0].height,wt,B.mipmaps[0].data):w.texSubImage2D(w.TEXTURE_2D,$,C.x,C.y,wt,Ut,B.image),$===0&&q.generateMipmaps&&w.generateMipmap(w.TEXTURE_2D),G.unbindTexture()},this.copyTextureToTexture3D=function(C,B,q,$,W=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let _t=C.max.x-C.min.x+1,wt=C.max.y-C.min.y+1,Ut=C.max.z-C.min.z+1,zt=St.convert($.format),Gt=St.convert($.type),Bt;if($.isData3DTexture)A.setTexture3D($,0),Bt=w.TEXTURE_3D;else if($.isDataArrayTexture||$.isCompressedArrayTexture)A.setTexture2DArray($,0),Bt=w.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,$.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,$.unpackAlignment);let kt=w.getParameter(w.UNPACK_ROW_LENGTH),be=w.getParameter(w.UNPACK_IMAGE_HEIGHT),an=w.getParameter(w.UNPACK_SKIP_PIXELS),Le=w.getParameter(w.UNPACK_SKIP_ROWS),Gn=w.getParameter(w.UNPACK_SKIP_IMAGES),ge=q.isCompressedTexture?q.mipmaps[W]:q.image;w.pixelStorei(w.UNPACK_ROW_LENGTH,ge.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,ge.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,C.min.x),w.pixelStorei(w.UNPACK_SKIP_ROWS,C.min.y),w.pixelStorei(w.UNPACK_SKIP_IMAGES,C.min.z),q.isDataTexture||q.isData3DTexture?w.texSubImage3D(Bt,W,B.x,B.y,B.z,_t,wt,Ut,zt,Gt,ge.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),w.compressedTexSubImage3D(Bt,W,B.x,B.y,B.z,_t,wt,Ut,zt,ge.data)):w.texSubImage3D(Bt,W,B.x,B.y,B.z,_t,wt,Ut,zt,Gt,ge),w.pixelStorei(w.UNPACK_ROW_LENGTH,kt),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,be),w.pixelStorei(w.UNPACK_SKIP_PIXELS,an),w.pixelStorei(w.UNPACK_SKIP_ROWS,Le),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Gn),W===0&&$.generateMipmaps&&w.generateMipmap(Bt),G.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?A.setTextureCube(C,0):C.isData3DTexture?A.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?A.setTexture2DArray(C,0):A.setTexture2D(C,0),G.unbindTexture()},this.resetState=function(){R=0,S=0,T=null,G.reset(),Ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===pl?"display-p3":"srgb",e.unpackColorSpace=ee.workingColorSpace===Qo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Se?Fi:Gu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Fi?Se:Qn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Fc=class extends mr{};Fc.prototype.isWebGL1Renderer=!0;var Do=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new lt(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Ps=class extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},Is=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=_c,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},tn=new P,gi=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix4(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)tn.fromBufferAttribute(this,e),tn.applyNormalMatrix(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)tn.fromBufferAttribute(this,e),tn.transformDirection(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=zn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=zn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=zn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=zn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),i=re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),i=re(i,this.array),r=re(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Qt(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bi=class extends ti{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},fs,js=new P,ds=new P,ps=new P,ms=new tt,tr=new tt,ef=new Kt,io=new P,er=new P,so=new P,vu=new tt,lc=new tt,yu=new tt,Ls=class extends Ee{constructor(t=new Bi){if(super(),this.isSprite=!0,this.type="Sprite",fs===void 0){fs=new oe;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Is(e,5);fs.setIndex([0,1,2,0,2,3]),fs.setAttribute("position",new gi(n,3,0,!1)),fs.setAttribute("uv",new gi(n,2,3,!1))}this.geometry=fs,this.material=t,this.center=new tt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ds.setFromMatrixScale(this.matrixWorld),ef.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ds.multiplyScalar(-ps.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;ro(io.set(-.5,-.5,0),ps,o,ds,i,r),ro(er.set(.5,-.5,0),ps,o,ds,i,r),ro(so.set(.5,.5,0),ps,o,ds,i,r),vu.set(0,0),lc.set(1,0),yu.set(1,1);let a=t.ray.intersectTriangle(io,er,so,!1,js);if(a===null&&(ro(er.set(-.5,.5,0),ps,o,ds,i,r),lc.set(0,1),a=t.ray.intersectTriangle(io,so,er,!1,js),a===null))return;let c=t.ray.origin.distanceTo(js);c<t.near||c>t.far||e.push({distance:c,point:js.clone(),uv:Ui.getInterpolation(js,io,er,so,vu,lc,yu,new tt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function ro(s,t,e,n,i,r){ms.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(tr.x=r*ms.x-i*ms.y,tr.y=i*ms.x+r*ms.y):tr.copy(ms),s.copy(t),s.x+=tr.x,s.y+=tr.y,s.applyMatrix4(ef)}var Oi=class extends Qt{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},gs=new Kt,_u=new Kt,oo=[],Mu=new jn,qx=new Kt,nr=new ht,ir=new Rn,Re=class extends ht{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Oi(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,qx)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new jn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,gs),Mu.copy(t.boundingBox).applyMatrix4(gs),this.boundingBox.union(Mu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Rn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,gs),ir.copy(t.boundingSphere).applyMatrix4(gs),this.boundingSphere.union(ir)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,i=this.count;if(nr.geometry=this.geometry,nr.material=this.material,nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ir.copy(this.boundingSphere),ir.applyMatrix4(n),t.ray.intersectsSphere(ir)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,gs),_u.multiplyMatrices(n,gs),nr.matrixWorld=_u,nr.raycast(t,oo);for(let o=0,a=oo.length;o<a;o++){let c=oo[o];c.instanceId=r,c.object=this,e.push(c)}oo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Oi(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Bc=class extends ti{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},bu=new Kt,Oc=new To,ao=new Rn,co=new P,Uo=class extends Ee{constructor(t=new oe,e=new Bc){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ao.copy(n.boundingSphere),ao.applyMatrix4(i),ao.radius+=r,t.ray.intersectsSphere(ao)===!1)return;bu.copy(i).invert(),Oc.copy(t.ray).applyMatrix4(bu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=f,x=d;g<x;g++){let m=l.getX(g);co.fromBufferAttribute(u,m),Su(co,m,c,i,t,e,this)}}else{let f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,x=d;g<x;g++)co.fromBufferAttribute(u,g),Su(co,g,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Su(s,t,e,n,i,r,o){let a=Oc.distanceSqToPoint(s);if(a<e){let c=new P;Oc.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var gr=class extends un{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Fe,this.minFilter=Fe,this.generateMipmaps=!1,this.needsUpdate=!0}};var No=class extends un{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},_n=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);let h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),c=e||(o.isVector2?new tt:new P);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new P,i=[],r=[],o=[],a=new P,c=new Kt;for(let d=0;d<=t;d++){let g=d/t;i[d]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Ue(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(i[d],r[d])}if(e===!0){let d=Math.acos(Ue(r[0].dot(r[t]),-1,1));d/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],d*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},xr=class extends _n{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){let n=e||new tt,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},kc=class extends xr{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function vl(){let s=0,t=0,e=0,n=0;function i(r,o,a,c){s=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var lo=new P,hc=new vl,uc=new vl,fc=new vl,Hc=class extends _n{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new P){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(lo.subVectors(i[0],i[1]).add(i[0]),l=lo);let u=i[a%r],f=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(lo.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=lo),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),hc.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,x,m),uc.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,x,m),fc.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(hc.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),uc.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),fc.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(hc.calc(c),uc.calc(c),fc.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new P().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Eu(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,c=s*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*s+e}function Yx(s,t){let e=1-s;return e*e*t}function Zx(s,t){return 2*(1-s)*s*t}function $x(s,t){return s*s*t}function lr(s,t,e,n){return Yx(s,t)+Zx(s,e)+$x(s,n)}function Jx(s,t){let e=1-s;return e*e*e*t}function Kx(s,t){let e=1-s;return 3*e*e*s*t}function Qx(s,t){return 3*(1-s)*s*s*t}function jx(s,t){return s*s*s*t}function hr(s,t,e,n,i){return Jx(s,t)+Kx(s,e)+Qx(s,n)+jx(s,i)}var zo=class extends _n{constructor(t=new tt,e=new tt,n=new tt,i=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new tt){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(hr(t,i.x,r.x,o.x,a.x),hr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Vc=class extends _n{constructor(t=new P,e=new P,n=new P,i=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new P){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(hr(t,i.x,r.x,o.x,a.x),hr(t,i.y,r.y,o.y,a.y),hr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Fo=class extends _n{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Gc=class extends _n{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Bo=class extends _n{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(lr(t,i.x,r.x,o.x),lr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Wc=class extends _n{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(lr(t,i.x,r.x,o.x),lr(t,i.y,r.y,o.y),lr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Oo=class extends _n{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Eu(a,c.x,l.x,h.x,u.x),Eu(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new tt().fromArray(i))}return this}},Xc=Object.freeze({__proto__:null,ArcCurve:kc,CatmullRomCurve3:Hc,CubicBezierCurve:zo,CubicBezierCurve3:Vc,EllipseCurve:xr,LineCurve:Fo,LineCurve3:Gc,QuadraticBezierCurve:Bo,QuadraticBezierCurve3:Wc,SplineCurve:Oo}),qc=class extends _n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Xc[i.type]().fromJSON(i))}return this}},ko=class extends qc{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Fo(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new Bo(this.currentPoint.clone(),new tt(t,e),new tt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new zo(this.currentPoint.clone(),new tt(t,e),new tt(n,i),new tt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Oo(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,o,a,c),this}absellipse(t,e,n,i,r,o,a,c){let l=new xr(t,e,n,i,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var Ho=class s extends oe{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new P,h=new tt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){let d=n+u/e*i;l.x=t*Math.cos(d),l.y=t*Math.sin(d),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new jt(o,3)),this.setAttribute("normal",new jt(a,3)),this.setAttribute("uv",new jt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},ze=class s extends oe{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,x=[],m=n/2,p=0;y(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new jt(u,3)),this.setAttribute("normal",new jt(f,3)),this.setAttribute("uv",new jt(d,2));function y(){let M=new P,R=new P,S=0,T=(e-t)/n;for(let D=0;D<=r;D++){let _=[],b=D/r,U=b*(e-t)+t;for(let L=0;L<=i;L++){let H=L/i,I=H*c+a,z=Math.sin(I),O=Math.cos(I);R.x=U*z,R.y=-b*n+m,R.z=U*O,u.push(R.x,R.y,R.z),M.set(z,T,O).normalize(),f.push(M.x,M.y,M.z),d.push(H,1-b),_.push(g++)}x.push(_)}for(let D=0;D<i;D++)for(let _=0;_<r;_++){let b=x[_][D],U=x[_+1][D],L=x[_+1][D+1],H=x[_][D+1];h.push(b,U,H),h.push(U,L,H),S+=6}l.addGroup(p,S,0),p+=S}function v(M){let R=g,S=new tt,T=new P,D=0,_=M===!0?t:e,b=M===!0?1:-1;for(let L=1;L<=i;L++)u.push(0,m*b,0),f.push(0,b,0),d.push(.5,.5),g++;let U=g;for(let L=0;L<=i;L++){let I=L/i*c+a,z=Math.cos(I),O=Math.sin(I);T.x=_*O,T.y=m*b,T.z=_*z,u.push(T.x,T.y,T.z),f.push(0,b,0),S.x=z*.5+.5,S.y=O*.5*b+.5,d.push(S.x,S.y),g++}for(let L=0;L<i;L++){let H=R+L,I=U+L;M===!0?h.push(I,I+1,H):h.push(I+1,I,H),D+=3}l.addGroup(p,D,M===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},xi=class s extends ze{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Vo=class s extends oe{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new jt(r,3)),this.setAttribute("normal",new jt(r.slice(),3)),this.setAttribute("uv",new jt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let v=new P,M=new P,R=new P;for(let S=0;S<e.length;S+=3)d(e[S+0],v),d(e[S+1],M),d(e[S+2],R),c(v,M,R,y)}function c(y,v,M,R){let S=R+1,T=[];for(let D=0;D<=S;D++){T[D]=[];let _=y.clone().lerp(M,D/S),b=v.clone().lerp(M,D/S),U=S-D;for(let L=0;L<=U;L++)L===0&&D===S?T[D][L]=_:T[D][L]=_.clone().lerp(b,L/U)}for(let D=0;D<S;D++)for(let _=0;_<2*(S-D)-1;_++){let b=Math.floor(_/2);_%2===0?(f(T[D][b+1]),f(T[D+1][b]),f(T[D][b])):(f(T[D][b+1]),f(T[D+1][b+1]),f(T[D+1][b]))}}function l(y){let v=new P;for(let M=0;M<r.length;M+=3)v.x=r[M+0],v.y=r[M+1],v.z=r[M+2],v.normalize().multiplyScalar(y),r[M+0]=v.x,r[M+1]=v.y,r[M+2]=v.z}function h(){let y=new P;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];let M=m(y)/2/Math.PI+.5,R=p(y)/Math.PI+.5;o.push(M,1-R)}g(),u()}function u(){for(let y=0;y<o.length;y+=6){let v=o[y+0],M=o[y+2],R=o[y+4],S=Math.max(v,M,R),T=Math.min(v,M,R);S>.9&&T<.1&&(v<.2&&(o[y+0]+=1),M<.2&&(o[y+2]+=1),R<.2&&(o[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,v){let M=y*3;v.x=t[M+0],v.y=t[M+1],v.z=t[M+2]}function g(){let y=new P,v=new P,M=new P,R=new P,S=new tt,T=new tt,D=new tt;for(let _=0,b=0;_<r.length;_+=9,b+=6){y.set(r[_+0],r[_+1],r[_+2]),v.set(r[_+3],r[_+4],r[_+5]),M.set(r[_+6],r[_+7],r[_+8]),S.set(o[b+0],o[b+1]),T.set(o[b+2],o[b+3]),D.set(o[b+4],o[b+5]),R.copy(y).add(v).add(M).divideScalar(3);let U=m(R);x(S,b+0,y,U),x(T,b+2,v,U),x(D,b+4,M,U)}}function x(y,v,M,R){R<0&&y.x===1&&(o[v]=y.x-1),M.x===0&&M.z===0&&(o[v]=R/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}},Go=class s extends Vo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var ki=class extends ko{constructor(t){super(t),this.uuid=Bn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new ko().fromJSON(i))}return this}},tv={triangulate:function(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=nf(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,f,d;if(n&&(r=rv(s,t,r,e)),s.length>80*e){a=l=s[0],c=h=s[1];for(let g=e;g<i;g+=e)u=s[g],f=s[g+1],u<a&&(a=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return vr(r,o,e,a,c,d,0),o}};function nf(s,t,e,n,i){let r,o;if(i===gv(s,t,e,n)>0)for(r=t;r<e;r+=n)o=wu(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=wu(r,s[r],s[r+1],o);return o&&ta(o,o.next)&&(_r(o),o=o.next),o}function Hi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(ta(e,e.next)||xe(e.prev,e,e.next)===0)){if(_r(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function vr(s,t,e,n,i,r,o){if(!s)return;!o&&r&&hv(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?nv(s,n,i,r):ev(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),_r(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=iv(Hi(s),t,e),vr(s,t,e,n,i,r,2)):o===2&&sv(s,t,e,n,i,r):vr(Hi(s),t,e,n,i,r,1);break}}}function ev(s){let t=s.prev,e=s,n=s.next;if(xe(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,f=i>r?i>o?i:o:r>o?r:o,d=a>c?a>l?a:l:c>l?c:l,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&ys(i,a,r,c,o,l,g.x,g.y)&&xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function nv(s,t,e,n){let i=s.prev,r=s,o=s.next;if(xe(i,r,o)>=0)return!1;let a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,f=o.y,d=a<c?a<l?a:l:c<l?c:l,g=h<u?h<f?h:f:u<f?u:f,x=a>c?a>l?a:l:c>l?c:l,m=h>u?h>f?h:f:u>f?u:f,p=Yc(d,g,t,e,n),y=Yc(x,m,t,e,n),v=s.prevZ,M=s.nextZ;for(;v&&v.z>=p&&M&&M.z<=y;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&ys(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&ys(a,h,c,u,l,f,M.x,M.y)&&xe(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&ys(a,h,c,u,l,f,v.x,v.y)&&xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=y;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&ys(a,h,c,u,l,f,M.x,M.y)&&xe(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function iv(s,t,e){let n=s;do{let i=n.prev,r=n.next.next;!ta(i,r)&&sf(i,n,n.next,r)&&yr(i,r)&&yr(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),_r(n),_r(n.next),n=s=r),n=n.next}while(n!==s);return Hi(n)}function sv(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&dv(o,a)){let c=rf(o,a);o=Hi(o,o.next),c=Hi(c,c.next),vr(o,t,e,n,i,r,0),vr(c,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function rv(s,t,e,n){let i=[],r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:s.length,l=nf(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(fv(l));for(i.sort(ov),r=0;r<i.length;r++)e=av(i[r],e);return e}function ov(s,t){return s.x-t.x}function av(s,t){let e=cv(s,t);if(!e)return t;let n=rf(e,s);return Hi(n,n.next),Hi(e,e.next)}function cv(s,t){let e=t,n=-1/0,i,r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let f=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=r&&f>n&&(n=f,i=e.x<e.next.x?e:e.next,f===r))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,c=i.x,l=i.y,h=1/0,u;e=i;do r>=e.x&&e.x>=c&&r!==e.x&&ys(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),yr(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&lv(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function lv(s,t){return xe(s.prev,s,t.prev)<0&&xe(t.next,s,s.next)<0}function hv(s,t,e,n){let i=s;do i.z===0&&(i.z=Yc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,uv(i)}function uv(s){let t,e,n,i,r,o,a,c,l=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,l*=2}while(o>1);return s}function Yc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function fv(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function ys(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function dv(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!pv(s,t)&&(yr(s,t)&&yr(t,s)&&mv(s,t)&&(xe(s.prev,s,t.prev)||xe(s,t.prev,t))||ta(s,t)&&xe(s.prev,s,s.next)>0&&xe(t.prev,t,t.next)>0)}function xe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function ta(s,t){return s.x===t.x&&s.y===t.y}function sf(s,t,e,n){let i=uo(xe(s,t,e)),r=uo(xe(s,t,n)),o=uo(xe(e,n,s)),a=uo(xe(e,n,t));return!!(i!==r&&o!==a||i===0&&ho(s,e,t)||r===0&&ho(s,n,t)||o===0&&ho(e,s,n)||a===0&&ho(e,t,n))}function ho(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function uo(s){return s>0?1:s<0?-1:0}function pv(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&sf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function yr(s,t){return xe(s.prev,s,s.next)<0?xe(s,t,s.next)>=0&&xe(s,s.prev,t)>=0:xe(s,t,s.prev)<0||xe(s,s.next,t)<0}function mv(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function rf(s,t){let e=new Zc(s.i,s.x,s.y),n=new Zc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function wu(s,t,e,n){let i=new Zc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function _r(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Zc(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function gv(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var ur=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Tu(t),Au(n,t);let o=t.length;e.forEach(Tu);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,Au(n,e[c]);let a=tv.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Tu(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Au(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var Wo=class s extends oe{constructor(t=new ki([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new jt(i,3)),this.setAttribute("uv",new jt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:xv,v,M=!1,R,S,T,D;p&&(v=p.getSpacedPoints(h),M=!0,f=!1,R=p.computeFrenetFrames(h,!1),S=new P,T=new P,D=new P),f||(m=0,d=0,g=0,x=0);let _=a.extractPoints(l),b=_.shape,U=_.holes;if(!ur.isClockWise(b)){b=b.reverse();for(let w=0,V=U.length;w<V;w++){let F=U[w];ur.isClockWise(F)&&(U[w]=F.reverse())}}let H=ur.triangulateShape(b,U),I=b;for(let w=0,V=U.length;w<V;w++){let F=U[w];b=b.concat(F)}function z(w,V,F){return V||console.error("THREE.ExtrudeGeometry: vec does not exist"),w.clone().addScaledVector(V,F)}let O=b.length,K=H.length;function Q(w,V,F){let j,G,rt,it=w.x-V.x,A=w.y-V.y,E=F.x-w.x,k=F.y-w.y,st=it*it+A*A,ot=it*k-A*E;if(Math.abs(ot)>Number.EPSILON){let et=Math.sqrt(st),bt=Math.sqrt(E*E+k*k),pt=V.x-A/et,yt=V.y+it/et,Tt=F.x-k/bt,Ot=F.y+E/bt,at=((Tt-pt)*k-(Ot-yt)*E)/(it*k-A*E);j=pt+it*at-w.x,G=yt+A*at-w.y;let te=j*j+G*G;if(te<=2)return new tt(j,G);rt=Math.sqrt(te/2)}else{let et=!1;it>Number.EPSILON?E>Number.EPSILON&&(et=!0):it<-Number.EPSILON?E<-Number.EPSILON&&(et=!0):Math.sign(A)===Math.sign(k)&&(et=!0),et?(j=-A,G=it,rt=Math.sqrt(st)):(j=it,G=A,rt=Math.sqrt(st/2))}return new tt(j/rt,G/rt)}let Z=[];for(let w=0,V=I.length,F=V-1,j=w+1;w<V;w++,F++,j++)F===V&&(F=0),j===V&&(j=0),Z[w]=Q(I[w],I[F],I[j]);let X=[],Y,ct=Z.concat();for(let w=0,V=U.length;w<V;w++){let F=U[w];Y=[];for(let j=0,G=F.length,rt=G-1,it=j+1;j<G;j++,rt++,it++)rt===G&&(rt=0),it===G&&(it=0),Y[j]=Q(F[j],F[rt],F[it]);X.push(Y),ct=ct.concat(Y)}for(let w=0;w<m;w++){let V=w/m,F=d*Math.cos(V*Math.PI/2),j=g*Math.sin(V*Math.PI/2)+x;for(let G=0,rt=I.length;G<rt;G++){let it=z(I[G],Z[G],j);vt(it.x,it.y,-F)}for(let G=0,rt=U.length;G<rt;G++){let it=U[G];Y=X[G];for(let A=0,E=it.length;A<E;A++){let k=z(it[A],Y[A],j);vt(k.x,k.y,-F)}}}let J=g+x;for(let w=0;w<O;w++){let V=f?z(b[w],ct[w],J):b[w];M?(T.copy(R.normals[0]).multiplyScalar(V.x),S.copy(R.binormals[0]).multiplyScalar(V.y),D.copy(v[0]).add(T).add(S),vt(D.x,D.y,D.z)):vt(V.x,V.y,0)}for(let w=1;w<=h;w++)for(let V=0;V<O;V++){let F=f?z(b[V],ct[V],J):b[V];M?(T.copy(R.normals[w]).multiplyScalar(F.x),S.copy(R.binormals[w]).multiplyScalar(F.y),D.copy(v[w]).add(T).add(S),vt(D.x,D.y,D.z)):vt(F.x,F.y,u/h*w)}for(let w=m-1;w>=0;w--){let V=w/m,F=d*Math.cos(V*Math.PI/2),j=g*Math.sin(V*Math.PI/2)+x;for(let G=0,rt=I.length;G<rt;G++){let it=z(I[G],Z[G],j);vt(it.x,it.y,u+F)}for(let G=0,rt=U.length;G<rt;G++){let it=U[G];Y=X[G];for(let A=0,E=it.length;A<E;A++){let k=z(it[A],Y[A],j);M?vt(k.x,k.y+v[h-1].y,v[h-1].x+F):vt(k.x,k.y,u+F)}}}nt(),mt();function nt(){let w=i.length/3;if(f){let V=0,F=O*V;for(let j=0;j<K;j++){let G=H[j];Rt(G[2]+F,G[1]+F,G[0]+F)}V=h+m*2,F=O*V;for(let j=0;j<K;j++){let G=H[j];Rt(G[0]+F,G[1]+F,G[2]+F)}}else{for(let V=0;V<K;V++){let F=H[V];Rt(F[2],F[1],F[0])}for(let V=0;V<K;V++){let F=H[V];Rt(F[0]+O*h,F[1]+O*h,F[2]+O*h)}}n.addGroup(w,i.length/3-w,0)}function mt(){let w=i.length/3,V=0;Mt(I,V),V+=I.length;for(let F=0,j=U.length;F<j;F++){let G=U[F];Mt(G,V),V+=G.length}n.addGroup(w,i.length/3-w,1)}function Mt(w,V){let F=w.length;for(;--F>=0;){let j=F,G=F-1;G<0&&(G=w.length-1);for(let rt=0,it=h+m*2;rt<it;rt++){let A=O*rt,E=O*(rt+1),k=V+j+A,st=V+G+A,ot=V+G+E,et=V+j+E;Ct(k,st,ot,et)}}}function vt(w,V,F){c.push(w),c.push(V),c.push(F)}function Rt(w,V,F){Et(w),Et(V),Et(F);let j=i.length/3,G=y.generateTopUV(n,i,j-3,j-2,j-1);Dt(G[0]),Dt(G[1]),Dt(G[2])}function Ct(w,V,F,j){Et(w),Et(V),Et(j),Et(V),Et(F),Et(j);let G=i.length/3,rt=y.generateSideWallUV(n,i,G-6,G-3,G-2,G-1);Dt(rt[0]),Dt(rt[1]),Dt(rt[3]),Dt(rt[1]),Dt(rt[2]),Dt(rt[3])}function Et(w){i.push(c[w*3+0]),i.push(c[w*3+1]),i.push(c[w*3+2])}function Dt(w){r.push(w.x),r.push(w.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return vv(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Xc[i.type]().fromJSON(i)),new s(n,t.options)}},xv={generateTopUV:function(s,t,e,n,i){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[i*3],h=t[i*3+1];return[new tt(r,o),new tt(a,c),new tt(l,h)]},generateSideWallUV:function(s,t,e,n,i,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[i*3],d=t[i*3+1],g=t[i*3+2],x=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new tt(o,1-c),new tt(l,1-u),new tt(f,1-g),new tt(x,1-p)]:[new tt(a,1-c),new tt(h,1-u),new tt(d,1-g),new tt(m,1-p)]}};function vv(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Ds=class s extends Vo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var Vi=class s extends oe{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new P,f=new P,d=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let y=[],v=p/n,M=0;p===0&&o===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let R=0;R<=e;R++){let S=R/e;u.x=-t*Math.cos(i+S*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(i+S*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(S+M,1-v),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){let v=h[p][y+1],M=h[p][y],R=h[p+1][y],S=h[p+1][y+1];(p!==0||o>0)&&d.push(v,M,S),(p!==n-1||c<Math.PI)&&d.push(M,R,S)}this.setIndex(d),this.setAttribute("position",new jt(g,3)),this.setAttribute("normal",new jt(x,3)),this.setAttribute("uv",new jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Xo=class s extends oe{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new P,u=new P,f=new P;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){let x=g/i*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(x),u.y=(t+e*Math.cos(m))*Math.sin(x),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/i),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){let x=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,y=(i+1)*d+g;o.push(x,m,y),o.push(m,p,y)}this.setIndex(o),this.setAttribute("position",new jt(a,3)),this.setAttribute("normal",new jt(c,3)),this.setAttribute("uv",new jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var vi=class extends ve{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},At=class extends ti{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wu,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Mr=class extends At{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new tt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ue(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new lt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new lt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new lt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};function fo(s,t,e){return!s||!e&&s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function yv(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var Us=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},$c=class extends Us{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ch,endingEnd:Ch}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ph:r=t,a=2*e-n;break;case Ih:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ph:o=t,c=2*n-e;break;case Ih:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-e)/(i-e),x=g*g,m=x*g,p=-f*m+2*f*x-f*g,y=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,v=(-1-d)*m+(1.5+d)*x+.5*g,M=d*m-d*x;for(let R=0;R!==a;++R)r[R]=p*o[h+R]+y*o[l+R]+v*o[c+R]+M*o[u+R];return r}},Jc=class extends Us{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}},Kc=class extends Us{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Cn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=fo(e,this.TimeBufferType),this.values=fo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:fo(t.times,Array),values:fo(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Kc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Jc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new $c(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case mo:e=this.InterpolantFactoryMethodDiscrete;break;case go:e=this.InterpolantFactoryMethodLinear;break;case ka:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return mo;case this.InterpolantFactoryMethodLinear:return go;case this.InterpolantFactoryMethodSmooth:return ka}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&yv(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ka,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let x=e[u+g];if(x!==e[f+g]||x!==e[d+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)e[f+d]=e[u+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};Cn.prototype.TimeBufferType=Float32Array;Cn.prototype.ValueBufferType=Float32Array;Cn.prototype.DefaultInterpolation=go;var Gi=class extends Cn{};Gi.prototype.ValueTypeName="bool";Gi.prototype.ValueBufferType=Array;Gi.prototype.DefaultInterpolation=mo;Gi.prototype.InterpolantFactoryMethodLinear=void 0;Gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Qc=class extends Cn{};Qc.prototype.ValueTypeName="color";var jc=class extends Cn{};jc.prototype.ValueTypeName="number";var tl=class extends Us{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)fn.slerpFlat(r,0,o,l-a,o,l,c);return r}},br=class extends Cn{InterpolantFactoryMethodLinear(t){return new tl(this.times,this.values,this.getValueSize(),t)}};br.prototype.ValueTypeName="quaternion";br.prototype.DefaultInterpolation=go;br.prototype.InterpolantFactoryMethodSmooth=void 0;var Wi=class extends Cn{};Wi.prototype.ValueTypeName="string";Wi.prototype.ValueBufferType=Array;Wi.prototype.DefaultInterpolation=mo;Wi.prototype.InterpolantFactoryMethodLinear=void 0;Wi.prototype.InterpolantFactoryMethodSmooth=void 0;var el=class extends Cn{};el.prototype.ValueTypeName="vector";var nl=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let d=l[u],g=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null}}},_v=new nl,il=class{constructor(t){this.manager=t!==void 0?t:_v,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};il.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ns=class extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new lt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},qo=class extends Ns{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new lt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},dc=new Kt,Ru=new P,Cu=new P,Sr=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pr,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Ru.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ru),Cu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Cu),e.updateMatrixWorld(),dc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(dc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},sl=class extends Sr{constructor(){super(new Be(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=ws*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},Yo=class extends Ns{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new sl}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Pu=new Kt,sr=new P,pc=new P,rl=class extends Sr{constructor(){super(new Be(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),sr.setFromMatrixPosition(t.matrixWorld),n.position.copy(sr),pc.copy(n.position),pc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(pc),n.updateMatrixWorld(),i.makeTranslation(-sr.x,-sr.y,-sr.z),Pu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pu)}},Xi=class extends Ns{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new rl}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},ol=class extends Sr{constructor(){super(new Rs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Zo=class extends Ns{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new ol}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var $o=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Iu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=Iu();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function Iu(){return(typeof performance>"u"?Date:performance).now()}var yl="\\[\\]\\.:\\/",Mv=new RegExp("["+yl+"]","g"),_l="[^"+yl+"]",bv="[^"+yl.replace("\\.","")+"]",Sv=/((?:WC+[\/:])*)/.source.replace("WC",_l),Ev=/(WCOD+)?/.source.replace("WCOD",bv),wv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_l),Tv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_l),Av=new RegExp("^"+Sv+Ev+wv+Tv+"$"),Rv=["material","materials","bones","map"],al=class{constructor(t,e,n){let i=n||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},me=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Mv,"")}static parseTrackName(t){let e=Av.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Rv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=al;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var sy=new Float32Array(1);var Lu=new tt,Jo=class{constructor(t=new tt(1/0,1/0),e=new tt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Lu.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Lu).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var Fs=class s extends ht{constructor(){let t=s.SkyShader,e=new ve({name:t.name,uniforms:On.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:Ze,depthWrite:!1});super(new It(1,1,1),e),this.isSky=!0}};Fs.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new P},up:{value:new P(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of tha
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var wr=class s extends ht{constructor(){super(s.Geometry,new Me({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;let t=new P,e=new P,n=new gr(16,16),i=new gr(16,16),r=An,o=s.Geometry,a=new vi({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),c=new vi({uniforms:{map:{value:n},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),l=new ht(o,a),h=[],u=Hn.Shader,f=new vi({name:u.name,uniforms:{map:{value:null},occlusionMap:{value:i},color:{value:new lt(16777215)},scale:{value:new tt},screenPosition:{value:new P}},vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:ke,transparent:!0,depthWrite:!1}),d=new ht(o,f);this.addElement=function(y){h.push(y)};let g=new tt,x=new tt,m=new Jo,p=new de;this.onBeforeRender=function(y,v,M){y.getCurrentViewport(p);let R=y.getRenderTarget(),S=R!==null?R.texture.type:An;r!==S&&(n.dispose(),i.dispose(),n.type=i.type=S,r=S);let T=p.w/p.z,D=p.z/2,_=p.w/2,b=16/p.w;if(g.set(b*T,b),m.min.set(p.x,p.y),m.max.set(p.x+(p.z-16),p.y+(p.w-16)),e.setFromMatrixPosition(this.matrixWorld),e.applyMatrix4(M.matrixWorldInverse),!(e.z>0)&&(t.copy(e).applyMatrix4(M.projectionMatrix),x.x=p.x+t.x*D+D-8,x.y=p.y+t.y*_+_-8,m.containsPoint(x))){y.copyFramebufferToTexture(x,n);let U=a.uniforms;U.scale.value=g,U.screenPosition.value=t,y.renderBufferDirect(M,null,o,a,l,null),y.copyFramebufferToTexture(x,i),U=c.uniforms,U.scale.value=g,U.screenPosition.value=t,y.renderBufferDirect(M,null,o,c,l,null);let L=-t.x*2,H=-t.y*2;for(let I=0,z=h.length;I<z;I++){let O=h[I],K=f.uniforms;K.color.value.copy(O.color),K.map.value=O.texture,K.screenPosition.value.x=t.x+L*O.distance,K.screenPosition.value.y=t.y+H*O.distance,b=O.size/p.w;let Q=p.w/p.z;K.scale.value.set(b*Q,b),f.uniformsNeedUpdate=!0,y.renderBufferDirect(M,null,o,f,d,null)}}},this.dispose=function(){a.dispose(),c.dispose(),f.dispose(),n.dispose(),i.dispose();for(let y=0,v=h.length;y<v;y++)h[y].texture.dispose()}}},Hn=class{constructor(t,e=1,n=0,i=new lt(16777215)){this.texture=t,this.size=e,this.distance=n,this.color=i}};Hn.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`};wr.Geometry=(function(){let s=new oe,t=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),e=new Is(t,5);return s.setIndex([0,1,2,0,2,3]),s.setAttribute("position",new gi(e,3,0,!1)),s.setAttribute("uv",new gi(e,2,3,!1)),s})();function Bs(s,t=!1){let e=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,c=new oe,l=0;for(let h=0;h<s.length;++h){let u=s[h],f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0,u=[];for(let f=0;f<s.length;++f){let d=s[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=s[f].attributes.position.count}c.setIndex(u)}for(let h in r){let u=of(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);let g=of(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function of(s){let t,e,n,i=-1,r=0;for(let l=0;l<s.length;++l){let h=s[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}let o=new t(r),a=0;for(let l=0;l<s.length;++l)o.set(s[l].array,a),a+=s[l].array.length;let c=new Qt(o,e,n);return i!==void 0&&(c.gpuType=i),c}var dt=(s,t,e)=>s<t?t:s>e?e:s,ae=(s,t,e)=>s+(t-s)*e,Ce=(s,t,e)=>{let n=dt((e-s)/(t-s),0,1);return n*n*(3-2*n)},_i=s=>{for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;return s},nn=(s,t,e,n)=>ae(s,t,1-Math.exp(-e*n)),af=(s,t,e,n)=>s+_i(t-s)*(1-Math.exp(-e*n));function qi(s){let t=s>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Ml=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];function dn(s=1){let t=qi(s),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){let a=Math.floor(t()*(o+1)),c=e[o];e[o]=e[a],e[a]=c}let n=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255];let i=.5*(Math.sqrt(3)-1),r=(3-Math.sqrt(3))/6;return function(o,a){let c=0,l=0,h=0,u=(o+a)*i,f=Math.floor(o+u),d=Math.floor(a+u),g=(f+d)*r,x=o-(f-g),m=a-(d-g),p,y;x>m?(p=1,y=0):(p=0,y=1);let v=x-p+r,M=m-y+r,R=x-1+2*r,S=m-1+2*r,T=f&255,D=d&255,_=.5-x*x-m*m;if(_>=0){let L=Ml[n[T+n[D]]&7];_*=_,c=_*_*(L[0]*x+L[1]*m)}let b=.5-v*v-M*M;if(b>=0){let L=Ml[n[T+p+n[D+y]]&7];b*=b,l=b*b*(L[0]*v+L[1]*M)}let U=.5-R*R-S*S;if(U>=0){let L=Ml[n[T+1+n[D+1]]&7];U*=U,h=U*U*(L[0]*R+L[1]*S)}return 70*(c+l+h)}}function Pn(s,t,e,n=4,i=2,r=.5){let o=1,a=1,c=0,l=0;for(let h=0;h<n;h++)c+=o*s(t*a,e*a),l+=o,o*=r,a*=i;return c/l}var Vn=()=>new Promise(s=>requestAnimationFrame(()=>s()));var Ge=2e3,$e=600,Os=120,cf=10,Mi=-1.5,lf=400,ei=Ge*2/lf,Cv=dn(1337),Pv=dn(4242),Iv=dn(777);function na(s,t){let e=Math.max(Math.abs(s),Math.abs(t)),n=Ce(680,1050,e),i=(Pn(Cv,s/750,t/750,4)*60+22+Pn(Pv,s/210,t/210,3)*9)*n,r=Math.max(-s,Math.abs(t)),o=1-Ce(1250,1600,s),a=Ce(1580,2050,r)*o;i+=a*(200+140*Pn(Iv,s/260,t/260,4));let c=s+45*Math.sin(t/170)+25*Math.sin(t/61),l=Ce(1510,1720,c);return i=ae(i,-28,l),i}var ea=class{constructor(){this.n=lf+1,this.data=new Float32Array(this.n*this.n),this.rd=new Float32Array(this.n*this.n).fill(999)}roadDist(t,e){let n=this.n,i=(t+Ge)/ei,r=(e+Ge)/ei;i=dt(i,0,n-1.001),r=dt(r,0,n-1.001);let o=Math.floor(i),a=Math.floor(r),c=i-o,l=r-a,h=this.rd,u=h[a*n+o],f=h[a*n+o+1],d=h[(a+1)*n+o],g=h[(a+1)*n+o+1];return(u*(1-c)+f*c)*(1-l)+(d*(1-c)+g*c)*l}onRoad(t,e){return Math.abs(t)<612&&Math.abs(e)<612?!0:this.roadDist(t,e)<.5}build(t){let e=this.n,n=64,i=new Map,r=(o,a)=>o*100003+a;for(let o of t){let a=o.pts,c=o.closed?a.length:a.length-1;for(let l=0;l<c;l++){let h=a[l],u=a[(l+1)%a.length],f=Math.floor((Math.min(h.x,u.x)-50)/n),d=Math.floor((Math.max(h.x,u.x)+50)/n),g=Math.floor((Math.min(h.z,u.z)-50)/n),x=Math.floor((Math.max(h.z,u.z)+50)/n);for(let m=f;m<=d;m++)for(let p=g;p<=x;p++){let y=r(m,p),v=i.get(y);v||i.set(y,v=[]),v.push({a:h,b:u,hw:o.halfW})}}}for(let o=0;o<e;o++){let a=-Ge+o*ei;for(let c=0;c<e;c++){let l=-Ge+c*ei,h=na(l,a),u=i.get(r(Math.floor(l/n),Math.floor(a/n)));if(u){let f=1e9,d=0,g=10;for(let x of u){let m=x.b.x-x.a.x,p=x.b.z-x.a.z,y=m*m+p*p||1e-6,v=((l-x.a.x)*m+(a-x.a.z)*p)/y;v=dt(v,0,1);let M=x.a.x+m*v,R=x.a.z+p*v,S=Math.hypot(l-M,a-R)-x.hw;S<f&&(f=S,d=ae(x.a.h,x.b.h,v),g=x.hw)}if(this.rd[o*e+c]=Math.min(f,999),f<42){let x=Ce(2,42,f);h=ae(d-.05,h,x)}}this.data[o*e+c]=h}}}get(t,e){let n=this.n,i=(t+Ge)/ei,r=(e+Ge)/ei;i=dt(i,0,n-1.001),r=dt(r,0,n-1.001);let o=Math.floor(i),a=Math.floor(r),c=i-o,l=r-a,h=this.data,u=h[a*n+o],f=h[a*n+o+1],d=h[(a+1)*n+o],g=h[(a+1)*n+o+1];return c+l<=1?u+(f-u)*c+(d-u)*l:g+(d-g)*(1-c)+(f-g)*(1-l)}normal(t,e,n){let r=this.get(t+2,e)-this.get(t-2,e),o=this.get(t,e+2)-this.get(t,e-2);return n.set(-r,4,-o).normalize(),n}};var ia=13,Lv=10;function Dv(s){return 1320+110*Math.sin(3*s+.5)+50*Math.sin(7*s+1.3)+22*Math.sin(11*s+2.1)}function hf(s){let t=Dv(s);return{x:Math.cos(s)*t,z:Math.sin(s)*t}}function Uv(s,t,e,n,i){let r=i*i,o=r*i;return{x:.5*(2*t.x+(-s.x+e.x)*i+(2*s.x-5*t.x+4*e.x-n.x)*r+(-s.x+3*t.x-3*e.x+n.x)*o),z:.5*(2*t.z+(-s.z+e.z)*i+(2*s.z-5*t.z+4*e.z-n.z)*r+(-s.z+3*t.z-3*e.z+n.z)*o)}}function bl(s,t){let e=[{x:s[0].x,z:s[0].z}],n=s[0],i=0;for(let a=1;a<s.length;a++){let c=s[a],l=n,h=Math.hypot(c.x-l.x,c.z-l.z);for(;i+h>=t&&h>1e-9;){let u=(t-i)/h,f={x:l.x+(c.x-l.x)*u,z:l.z+(c.z-l.z)*u};e.push(f),l=f,h=Math.hypot(c.x-l.x,c.z-l.z),i=0}i+=h,n=c}let r=s[s.length-1],o=e[e.length-1];return Math.hypot(r.x-o.x,r.z-o.z)>t*.4?e.push({x:r.x,z:r.z}):e[e.length-1]={x:r.x,z:r.z},e}function uf(s,t,e,n){let i=s.length,r=s.map(o=>o.h);for(let o=0;o<n;o++){let a=new Array(i);for(let c=0;c<i;c++){let l=0,h=0;for(let u=-e;u<=e;u++){let f=c+u;t?f=(f+i)%i:f=dt(f,0,i-1),l+=r[f],h++}a[c]=l/h}r=a}for(let o=0;o<i;o++)s[o].h=r[o]}function ff(){let s=[],t=[];for(let u=0;u<=4e3;u++)t.push(hf(u/4e3*Math.PI*2));let n=bl(t,10);n.pop();for(let u of n)u.h=Math.max(na(u.x,u.z),3);uf(n,!0,10,4);for(let u of n)u.h=Math.max(u.h,3.5);let i={name:"COAST HIGHWAY",pts:n,halfW:ia,closed:!0,kind:"highway"};s.push(i);let r=u=>{let f=hf(u),d=0,g=1e18;return n.forEach((x,m)=>{let p=(x.x-f.x)**2+(x.z-f.z)**2;p<g&&(g=p,d=m)}),d},o=[{name:"NORTH AVE",s:{x:0,z:-$e},dir:{x:0,z:-1},ang:-Math.PI/2,wig:60,freq:1},{name:"SOUTH AVE",s:{x:0,z:$e},dir:{x:0,z:1},ang:Math.PI/2,wig:-70,freq:1},{name:"OCEAN BLVD",s:{x:$e,z:0},dir:{x:1,z:0},ang:0,wig:50,freq:1},{name:"WEST PARKWAY",s:{x:-$e,z:0},dir:{x:-1,z:0},ang:Math.PI,wig:-60,freq:1},{name:"CANYON ROAD",s:{x:-$e,z:-$e},dir:{x:-.7071,z:-.7071},ang:-Math.PI*.75,wig:90,freq:3},{name:"HARBOR DRIVE",s:{x:$e,z:$e},dir:{x:.7071,z:.7071},ang:Math.PI*.25,wig:70,freq:2}],a=[],c=[],l=n.length,h=u=>{let f=n[(u-1+l)%l],d=n[(u+1)%l],g=d.x-f.x,x=d.z-f.z,m=Math.hypot(g,x);return{x:g/m,z:x/m}};for(let u of o){let f=r(u.ang),d=n[f],g=u.s,x=Math.hypot(d.x,d.z),m={x:d.x-d.x/x*190,z:d.z-d.z/x*190},p={x:g.x+u.dir.x*70,z:g.z+u.dir.z*70},y=m.x-p.x,v=m.z-p.z,M=Math.hypot(y,v),R=-v/M,S=y/M,T=[g,p],D=4;for(let X=1;X<D;X++){let Y=X/D,ct=Math.sin(Y*Math.PI*u.freq)*u.wig*(X%2===0&&u.freq>1?-1:1);T.push({x:p.x+y*Y+R*ct,z:p.z+v*Y+S*ct})}let _={x:m.x-d.x/x*50,z:m.z-d.z/x*50};T.push(_,{x:m.x,z:m.z});let b=[],U=[T[0],...T,T[T.length-1]];for(let X=1;X<U.length-2;X++)for(let Y=0;Y<1;Y+=.02)b.push(Uv(U[X-1],U[X],U[X+1],U[X+2],Y));b.push({x:m.x,z:m.z});let L=bl(b,10);L[0]={x:g.x,z:g.z},L[L.length-1]={x:m.x,z:m.z};for(let X of L)X.h=na(X.x,X.z);uf(L,!1,8,4);let H=d.h,I=L[0].h,z=L[L.length-1].h,O=0-I,K=H-z;L.forEach((X,Y)=>{let ct=Y/(L.length-1);X.h+=ae(O,K,ct),Y>=12&&(X.h=Math.max(X.h,2.5))});for(let X=0;X<Math.min(8,L.length);X++)L[X].h*=X/8;let Q={name:u.name,pts:L,halfW:Lv,closed:!1,kind:"conn",loopIndex:f};s.push(Q),a.push(Q);let Z={x:d.x/x,z:d.z/x};Q.ramps=[];for(let X of[1,-1]){let Y=(f+X*20+l)%l,ct=n[Y],J=h(Y),nt=J.x*X,mt=J.z*X,Mt={x:m.x+Z.x*80,z:m.z+Z.z*80},vt={x:ct.x-nt*90,z:ct.z-mt*90},Rt=[];for(let V=0;V<=1.0001;V+=.01){let F=1-V;Rt.push({x:F*F*F*m.x+3*F*F*V*Mt.x+3*F*V*V*vt.x+V*V*V*ct.x,z:F*F*F*m.z+3*F*F*V*Mt.z+3*F*V*V*vt.z+V*V*V*ct.z})}let Ct=bl(Rt,10);Ct[0]={x:m.x,z:m.z},Ct[Ct.length-1]={x:ct.x,z:ct.z};let Et=L[L.length-1].h,Dt=ct.h;Ct.forEach((V,F)=>{let j=F/(Ct.length-1),G=j*j*(3-2*j);V.h=ae(Et,Dt,G)});let w={name:u.name+" RAMP",pts:Ct,halfW:9,closed:!1,kind:"ramp",loopIndex:Y,parent:Q};s.push(w),c.push(w),Q.ramps.push(w)}}return{roads:s,loop:i,connectors:a,ramps:c,loopIndexAtAngle:r}}var Sl=class{constructor(){this.nodes=[],this.keyMap=new Map}add(t,e,n=0,i=null){if(i&&this.keyMap.has(i))return this.keyMap.get(i);let r=this.nodes.length;return this.nodes.push({id:r,x:t,z:e,h:n,edges:[]}),i&&this.keyMap.set(i,r),r}link(t,e){if(t===e)return;let n=this.nodes[t],i=this.nodes[e];if(n.edges.some(o=>o.to===e))return;let r=Math.hypot(n.x-i.x,n.z-i.z);n.edges.push({to:e,cost:r}),i.edges.push({to:t,cost:r})}buildGrid(){this.grid=new Map;for(let e of this.nodes){let n=Math.floor(e.x/60)*10007+Math.floor(e.z/60),i=this.grid.get(n);i||this.grid.set(n,i=[]),i.push(e)}this.gcs=60}nearest(t,e,n=400){let i=this.gcs,r=Math.floor(t/i),o=Math.floor(e/i),a=null,c=1e18;for(let l=0;l<=Math.ceil(n/i);l++){for(let h=r-l;h<=r+l;h++)for(let u=o-l;u<=o+l;u++){if(Math.max(Math.abs(h-r),Math.abs(u-o))!==l)continue;let f=this.grid.get(h*10007+u);if(f)for(let d of f){let g=(d.x-t)**2+(d.z-e)**2;g<c&&(c=g,a=d)}}if(a&&Math.sqrt(c)<l*i)break}return a}astar(t,e){let n=this.nodes,i=new Float64Array(n.length).fill(1/0),r=new Int32Array(n.length).fill(-1),o=new Uint8Array(n.length),a=n[e],c=[],l=(g,x)=>{c.push([x,g]);let m=c.length-1;for(;m>0;){let p=m-1>>1;if(c[p][0]<=c[m][0])break;[c[p],c[m]]=[c[m],c[p]],m=p}},h=()=>{let g=c[0],x=c.pop();if(c.length){c[0]=x;let m=0;for(;;){let p=2*m+1,y=p+1,v=m;if(p<c.length&&c[p][0]<c[v][0]&&(v=p),y<c.length&&c[y][0]<c[v][0]&&(v=y),v===m)break;[c[v],c[m]]=[c[m],c[v]],m=v}}return g};i[t]=0,l(t,0);let u=0;for(;c.length&&u++<2e4;){let[,g]=h();if(g===e)break;if(!o[g]){o[g]=1;for(let x of n[g].edges){let m=i[g]+x.cost;if(m<i[x.to]){i[x.to]=m,r[x.to]=g;let p=n[x.to];l(x.to,m+Math.hypot(p.x-a.x,p.z-a.z))}}}}if(r[e]===-1&&t!==e)return null;let f=[e],d=e;for(;d!==t;){if(d=r[d],d<0)return null;f.push(d)}return f.reverse(),f}};function df(s){let t=new Sl,e=Os,n=$e,i=20,r=(a,c)=>`c${Math.round(a)},${Math.round(c)}`;for(let a=-n;a<=n;a+=e){let c=-1,l=-1;for(let h=-n;h<=n;h+=i){let u=t.add(h,a,0,r(h,a));c>=0&&t.link(c,u),c=u;let f=t.add(a,h,0,r(a,h));l>=0&&t.link(l,f),l=f}}let o=s.loop.pts.map((a,c)=>t.add(a.x,a.z,a.h,`l${c}`));for(let a=0;a<o.length;a++)t.link(o[a],o[(a+1)%o.length]);s.loop.navIds=o;for(let a of s.connectors){let c=a.pts.map((h,u)=>u===0?t.keyMap.get(r(h.x,h.z)):t.add(h.x,h.z,h.h));for(let h=0;h<c.length-1;h++)t.link(c[h],c[h+1]);a.navIds=c;let l=c[c.length-1];for(let h of a.ramps){let u=h.pts.map((f,d)=>d===0?l:d===h.pts.length-1?o[h.loopIndex]:t.add(f.x,f.z,f.h));for(let f=0;f<u.length-1;f++)t.link(u[f],u[f+1]);h.navIds=u}}return t.buildGrid(),t.cityId=(a,c)=>t.keyMap.get(r(a,c)),t.loopId=a=>o[s.loopIndexAtAngle(a)],t}function pf(s,t){let e=[];for(let o=0;o<t.length-1;o++){let a=s.astar(t[o],t[o+1]);a&&(e.length&&a.shift(),e.push(...a))}let n=e.map(o=>({x:s.nodes[o].x,z:s.nodes[o].z})),i=[];for(let o=0;o<n.length;o++)i.push(n[o]);let r=0;i[0].d=0;for(let o=1;o<i.length;o++)r+=Math.hypot(i[o].x-i[o-1].x,i[o].z-i[o-1].z),i[o].d=r;return{pts:i,length:r,ids:e}}function Tr(s,t,e,n=0,i=40){let r=s.pts,o=n,a=1e18,c=0,l=Math.max(0,n-i),h=Math.min(r.length-2,n+i);for(let d=l;d<=h;d++){let g=r[d],x=r[d+1],m=x.x-g.x,p=x.z-g.z,y=m*m+p*p||1e-6,v=((t-g.x)*m+(e-g.z)*p)/y;v=dt(v,0,1);let M=g.x+m*v,R=g.z+p*v,S=(t-M)**2+(e-R)**2;S<a&&(a=S,o=d,c=v)}let u=r[o],f=r[Math.min(o+1,r.length-1)];return{index:o,dist:u.d+(f.d-u.d)*c,off:Math.sqrt(a)}}function Pe(s,t,e={}){let n=s.pts;t=dt(t,0,s.length);let i=0,r=n.length-1;for(;r-i>1;){let h=i+r>>1;n[h].d<=t?i=h:r=h}let o=n[i],a=n[r],c=(t-o.d)/(a.d-o.d||1);e.x=o.x+(a.x-o.x)*c,e.z=o.z+(a.z-o.z)*c,e.dx=a.x-o.x,e.dz=a.z-o.z;let l=Math.hypot(e.dx,e.dz)||1;return e.dx/=l,e.dz/=l,e.index=i,e}var sa=class{constructor(){this.grid=new Map,this.list=[],this.stamp=0}_key(t,e){return t*73856+e}_insert(t,e,n,i,r){t.stamp=0,this.list.push(t);for(let o=Math.floor(e/40);o<=Math.floor(i/40);o++)for(let a=Math.floor(n/40);a<=Math.floor(r/40);a++){let c=this._key(o,a),l=this.grid.get(c);l||this.grid.set(c,l=[]),l.push(t)}}addBox(t,e,n,i,r="wall"){let o={t:0,minx:t,minz:e,maxx:n,maxz:i,tag:r};return this._insert(o,t,e,n,i),o}addCircle(t,e,n,i="tree"){let r={t:1,x:t,z:e,r:n,tag:i};return this._insert(r,t-n,e-n,t+n,e+n),r}addSeg(t,e,n,i,r="rail"){let o={t:2,ax:t,az:e,bx:n,bz:i,tag:r};return this._insert(o,Math.min(t,n),Math.min(e,i),Math.max(t,n),Math.max(e,i)),o}collide(t,e,n,i){this.stamp++;let r=0,o=0,a=!1,c=0,l=0,h=0,u=null,f=Math.floor((t-n)/40),d=Math.floor((t+n)/40),g=Math.floor((e-n)/40),x=Math.floor((e+n)/40);for(let m=f;m<=d;m++)for(let p=g;p<=x;p++){let y=this.grid.get(this._key(m,p));if(y)for(let v of y){if(v.stamp===this.stamp)continue;v.stamp=this.stamp;let M,R,S,T;if(v.t===0){let b=t<v.minx?v.minx:t>v.maxx?v.maxx:t,U=e<v.minz?v.minz:e>v.maxz?v.maxz:e;if(M=t-b,R=e-U,S=Math.hypot(M,R),S===0){let L=t-v.minx,H=v.maxx-t,I=e-v.minz,z=v.maxz-e,O=Math.min(L,H,I,z);O===L?(M=-1,R=0,T=L+n):O===H?(M=1,R=0,T=H+n):O===I?(M=0,R=-1,T=I+n):(M=0,R=1,T=z+n),S=1}else{if(S>=n)continue;T=n-S}}else if(v.t===1){if(M=t-v.x,R=e-v.z,S=Math.hypot(M,R),S>=n+v.r||S===0)continue;T=n+v.r-S}else{let b=v.bx-v.ax,U=v.bz-v.az,L=b*b+U*U,H=((t-v.ax)*b+(e-v.az)*U)/L;if(H=H<0?0:H>1?1:H,M=t-(v.ax+b*H),R=e-(v.az+U*H),S=Math.hypot(M,R),S>=n+.2||S===0)continue;T=n+.2-S}let D=M/S,_=R/S;r+=D*T,o+=_*T,a=!0,T>c&&(c=T,l=D,h=_,u=v.tag)}}return a?(i.px=r,i.pz=o,i.nx=l,i.nz=h,i.depth=c,i.tag=u,i):null}los(t,e,n,i){this.stamp++;let r=Math.hypot(n-t,i-e),o=Math.ceil(r/(40*.5));for(let a=0;a<=o;a++){let c=a/o,l=t+(n-t)*c,h=e+(i-e)*c,u=this.grid.get(this._key(Math.floor(l/40),Math.floor(h/40)));if(u){for(let f of u)if(!(f.t!==0||f.stamp===this.stamp)&&(f.stamp=this.stamp,Nv(t,e,n,i,f)))return!1}}return!0}};function Nv(s,t,e,n,i){let r=0,o=1,a=e-s,c=n-t,l=[-a,a,-c,c],h=[s-i.minx,i.maxx-s,t-i.minz,i.maxz-t];for(let u=0;u<4;u++)if(l[u]===0){if(h[u]<0)return!1}else{let f=h[u]/l[u];if(l[u]<0){if(f>o)return!1;f>r&&(r=f)}else{if(f<r)return!1;f<o&&(o=f)}}return!0}function bi(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,e}function Si(s,t=!0,e=!0){let n=new No(s);return t&&(n.wrapS=n.wrapT=fr),n.anisotropy=8,e&&(n.colorSpace=Se),n.needsUpdate=!0,n}function ra(s,t,e,n,i,r,o=1){let a=s.getImageData(0,0,t,e),c=qi(r),l=dn(r);for(let h=0;h<e;h++)for(let u=0;u<t;u++){let f=(h*t+u)*4,d=(c()-.5)*i+l(u/(18*o),h/(18*o))*i*.6;a.data[f]=Math.max(0,Math.min(255,n[0]+d)),a.data[f+1]=Math.max(0,Math.min(255,n[1]+d)),a.data[f+2]=Math.max(0,Math.min(255,n[2]+d)),a.data[f+3]=255}s.putImageData(a,0,0)}function mf(){let s=bi(512,512),t=s.getContext("2d");ra(t,512,512,[58,58,62],26,11);let e=qi(5);for(let n=0;n<40;n++)t.fillStyle=`rgba(${20+e()*30},${20+e()*30},${24+e()*30},${.08+e()*.12})`,t.beginPath(),t.ellipse(e()*512,e()*512,20+e()*70,10+e()*40,e()*3,0,7),t.fill();t.strokeStyle="rgba(15,15,15,0.35)",t.lineWidth=1;for(let n=0;n<14;n++){t.beginPath();let i=e()*512,r=e()*512;t.moveTo(i,r);for(let o=0;o<8;o++)i+=(e()-.5)*40,r+=(e()-.5)*40,t.lineTo(i,r);t.stroke()}return Si(s)}function oa(s,t){let i=bi(512,1024),r=i.getContext("2d");ra(r,512,1024,[52,52,56],24,21);let o=512*.86/(s*2),a=512*.07;for(let l=0;l<s*2;l++)for(let h of[.28,.72]){let u=r.createLinearGradient(a+o*(l+h)-14,0,a+o*(l+h)+14,0);u.addColorStop(0,"rgba(0,0,0,0)"),u.addColorStop(.5,"rgba(10,10,12,0.28)"),u.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=u,r.fillRect(a+o*(l+h)-14,0,28,1024)}r.fillStyle="#e8e8e0",r.fillRect(a-8,0,7,1024),r.fillRect(512-a+1,0,7,1024),r.fillStyle="#e0b020",r.fillRect(512/2-9,0,6,1024),r.fillRect(512/2+3,0,6,1024),r.fillStyle="#e8e8e0";for(let l=1;l<s*2;l++){if(l===s)continue;let h=a+o*l;for(let u=0;u<1024;u+=256)r.fillRect(h-3,u,6,110)}if(t){r.fillStyle="rgba(255,255,255,0.12)";for(let l=0;l<1024;l+=16)r.fillRect(a-26,l,14,8),r.fillRect(512-a+12,l,14,8)}return r.fillStyle="rgba(70,62,50,0.9)",r.fillRect(0,0,a-30,1024),r.fillRect(512-a+30,0,a-30,1024),Si(i)}function gf(){let s=bi(512,512),t=s.getContext("2d");return ra(t,512,512,[150,150,150],70,31,.4),Si(s,!0,!1)}function xf(){let s=bi(256,256),t=s.getContext("2d");ra(t,256,256,[150,148,142],22,41),t.strokeStyle="rgba(60,60,60,0.5)",t.lineWidth=2;for(let e=0;e<=256;e+=64)t.beginPath(),t.moveTo(e,0),t.lineTo(e,256),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(256,e),t.stroke();return Si(s)}function vf(){let t=bi(256,256),e=t.getContext("2d"),n=e.createImageData(256,256),i=dn(99),r=(o,a)=>{let c=o/256*Math.PI*2,l=a/256*Math.PI*2;return i(Math.cos(c)*2+10,Math.sin(c)*2+Math.cos(l)*2)*.6+i(Math.cos(c)*5,Math.sin(l)*5+Math.sin(c))*.3+i(Math.sin(l)*9+3,Math.cos(c)*9)*.15};for(let o=0;o<256;o++)for(let a=0;a<256;a++){let c=r(a+1,o)-r(a-1,o),l=r(a,o+1)-r(a,o-1),h=-c*4,u=-l*4,f=1,d=Math.hypot(h,u,f),g=(o*256+a)*4;n.data[g]=(h/d*.5+.5)*255,n.data[g+1]=(u/d*.5+.5)*255,n.data[g+2]=(f/d*.5+.5)*255,n.data[g+3]=255}return e.putImageData(n,0,0),Si(t,!0,!1)}function pn(s="rgba(255,255,255,1)",t="rgba(255,255,255,0)",e=128){let n=bi(e,e),i=n.getContext("2d"),r=i.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);return r.addColorStop(0,s),r.addColorStop(.25,s.replace(/[\d.]+\)$/,"0.5)")),r.addColorStop(1,t),i.fillStyle=r,i.fillRect(0,0,e,e),Si(n,!1,!0)}function yf(){let t=bi(128,128),e=t.getContext("2d"),n=e.createImageData(128,128),i=dn(7);for(let r=0;r<128;r++)for(let o=0;o<128;o++){let a=(o-64)/64,c=(r-128/2)/(128/2),l=Math.sqrt(a*a+c*c),h=i(o/20,r/20)*.5+i(o/9,r/9)*.25,u=Math.max(0,1-l)**1.5*(.7+h),f=(r*128+o)*4;n.data[f]=n.data[f+1]=n.data[f+2]=255,n.data[f+3]=Math.max(0,Math.min(255,u*255))}return e.putImageData(n,0,0),Si(t,!1,!0)}function aa(s,t={}){let{w:e=512,h:n=128,bg:i="#0b5d2a",fg:r="#fff",font:o="bold 64px Arial",border:a=!0,sub:c=null}=t,l=bi(e,n),h=l.getContext("2d");return h.fillStyle=i,h.fillRect(0,0,e,n),a&&(h.strokeStyle=r,h.lineWidth=6,h.strokeRect(8,8,e-16,n-16)),h.fillStyle=r,h.font=o,h.textAlign="center",h.textBaseline="middle",h.fillText(s,e/2,c?n*.38:n/2),c&&(h.font="bold 34px Arial",h.fillText(c,e/2,n*.75)),Si(l,!1,!0)}var Fv={time:{value:0}},ca=class{constructor(t,e){this.renderer=t,this.scene=e,this.statics=new sa,this.hf=new ea,this.updaters=[]}async build(t=()=>{}){t(.02,"\u9053\u8DEF\u7DB2\u3092\u751F\u6210\u4E2D\u2026"),await Vn(),this.net=ff(),t(.08,"\u5730\u5F62\u3092\u751F\u6210\u4E2D\u2026"),await Vn(),this.hf.build(this.net.roads),this.nav=df(this.net),t(.25,"\u7A7A\u3068\u5149\u3092\u8A2D\u5B9A\u4E2D\u2026"),await Vn(),this.buildSky(),t(.32,"\u5730\u5F62\u30E1\u30C3\u30B7\u30E5\u3092\u69CB\u7BC9\u4E2D\u2026"),await Vn(),this.buildTerrain(),this.buildFarLand(),this.buildWater(),t(.45,"\u30CF\u30A4\u30A6\u30A7\u30A4\u3092\u8217\u88C5\u4E2D\u2026"),await Vn(),this.buildRoadMeshes(),t(.58,"\u30C0\u30A6\u30F3\u30BF\u30A6\u30F3\u3092\u5EFA\u8A2D\u4E2D\u2026"),await Vn(),this.buildCity(),t(.75,"\u68EE\u3068\u5CA9\u3092\u914D\u7F6E\u4E2D\u2026"),await Vn(),this.buildNature(),t(.85,"\u30DF\u30CB\u30DE\u30C3\u30D7\u3092\u63CF\u753B\u4E2D\u2026"),await Vn(),this.buildMinimap(),t(.9,"\u30B7\u30A7\u30FC\u30C0\u30FC\u3092\u30B3\u30F3\u30D1\u30A4\u30EB\u4E2D\u2026"),await Vn()}heightAt(t,e){return this.hf.get(t,e)}buildSky(){let t=this.scene,e=new Fs;e.scale.setScalar(2e4);let n=e.material.uniforms;n.turbidity.value=7.5,n.rayleigh.value=2.6,n.mieCoefficient.value=.006,n.mieDirectionalG.value=.86;let i=gl.degToRad(4.5),r=gl.degToRad(-128),o=new P().setFromSphericalCoords(1,Math.PI/2-i,r);n.sunPosition.value.copy(o),this.sunDir=o.clone(),t.add(e),this.sky=e;let a=new Cs(this.renderer),c=new Ps,l=new Fs;l.scale.setScalar(1e3),Object.assign(l.material.uniforms.sunPosition.value,o);for(let y of["turbidity","rayleigh","mieCoefficient","mieDirectionalG"])l.material.uniforms[y].value=n[y].value;c.add(l);let h=new ht(new Ve(4e3,4e3),new Me({color:2761504}));h.rotation.x=-Math.PI/2,h.position.y=-30,c.add(h),this.envMap=a.fromScene(c,.02).texture,t.environment=this.envMap,a.dispose(),t.fog=new Do(new lt(.62,.46,.4),28e-5);let u=new qo(10466520,4864554,.9);t.add(u);let f=new Zo(16756858,3.2);f.position.copy(o).multiplyScalar(400),f.castShadow=!0,f.shadow.mapSize.set(2048,2048);let d=110;Object.assign(f.shadow.camera,{left:-d,right:d,top:d,bottom:-d,near:1,far:1200}),f.shadow.bias=-4e-4,f.shadow.normalBias=.6,t.add(f),t.add(f.target),this.sunLight=f;let g=pn("rgba(255,230,190,1)","rgba(255,160,80,0)",256),x=pn("rgba(255,180,120,0.5)","rgba(255,120,60,0)",128),m=new wr;m.addElement(new Hn(g,280,0,new lt(.6,.45,.35))),m.addElement(new Hn(x,50,.6,new lt(.25,.18,.12))),m.addElement(new Hn(x,80,.7,new lt(.2,.15,.1))),m.addElement(new Hn(x,110,.9,new lt(.18,.13,.1))),m.addElement(new Hn(x,60,1,new lt(.2,.15,.1)));let p=new Ee;p.position.copy(o).multiplyScalar(9e3),p.add(m),t.add(p),this.flare=p}updateSun(t){let e=this.sunLight,n=220/2048,i=Math.round(t.x/n)*n,r=Math.round(t.z/n)*n;e.target.position.set(i,t.y,r),e.position.set(i+this.sunDir.x*500,t.y+this.sunDir.y*500+60,r+this.sunDir.z*500),this.flare.position.set(t.x+this.sunDir.x*9e3,this.sunDir.y*9e3,t.z+this.sunDir.z*9e3)}buildTerrain(){let t=this.hf.n,e=new Float32Array(t*t*3),n=new Float32Array(t*t*3),i=new Float32Array(t*t*2),r=dn(55),o=dn(66),a=new P,c=new lt(.26,.34,.12),l=new lt(.5,.44,.22),h=new lt(.18,.28,.1),u=new lt(.36,.32,.29),f=new lt(.78,.68,.5),d=new lt(.42,.36,.28),g=new lt(.92,.93,.96),x=new lt(.32,.29,.22),m=new lt(.3,.3,.3),p=new lt;for(let T=0;T<t;T++)for(let D=0;D<t;D++){let _=T*t+D,b=-Ge+D*ei,U=-Ge+T*ei,L=this.hf.data[_];e[_*3]=b,e[_*3+1]=L,e[_*3+2]=U,i[_*2]=b/12,i[_*2+1]=U/12,this.hf.normal(b,U,a);let H=1-a.y,I=Pn(r,b/300,U/300,3)*.5+.5;p.copy(c).lerp(l,Ce(.35,.75,I)),p.lerp(h,Ce(.6,.9,Pn(o,b/90,U/90,2)*.5+.5)*.6),p.lerp(u,Ce(.12,.3,H)),p.lerp(u,Ce(140,200,L)),p.lerp(g,Ce(260,320,L+Pn(r,b/80,U/80,2)*30));let z=this.hf.rd[_];p.lerp(d,(1-Ce(0,6,z))*.8),b>1300&&p.lerp(f,1-Ce(1,6,L)),L<Mi&&p.copy(x),Math.abs(b)<640&&Math.abs(U)<640&&p.lerp(m,.5),n[_*3]=p.r,n[_*3+1]=p.g,n[_*3+2]=p.b}let y=[];for(let T=0;T<t-1;T++)for(let D=0;D<t-1;D++){let _=T*t+D,b=_+1,U=_+t,L=U+1;y.push(_,U,b,b,U,L)}let v=new oe;v.setAttribute("position",new Qt(e,3)),v.setAttribute("color",new Qt(n,3)),v.setAttribute("uv",new Qt(i,2)),v.setIndex(y),v.computeVertexNormals();let M=gf(),R=new At({vertexColors:!0,map:M,roughness:.95,metalness:0}),S=new ht(v,R);S.receiveShadow=!0,this.scene.add(S),this.terrain=S}buildFarLand(){let n=new Ve(18e3,18e3,180,180);n.rotateX(-Math.PI/2);let i=n.attributes.position,r=dn(909),o=new Float32Array(i.count*3),a=new lt;for(let l=0;l<i.count;l++){let h=i.getX(l),u=i.getZ(l),f=Math.max(Math.abs(h),Math.abs(u)),d,g=Ce(1e3,2400,h)*(1-Ce(2500,5e3,Math.abs(u)));f<2080?d=-70:(d=160+Ce(2080,5e3,f)*700*(.55+.45*Pn(r,h/1400,u/1400,4))+Pn(r,h/300,u/300,3)*80,d=d*(1-g)+-40*g),i.setY(l,d),a.setRGB(.3,.28,.25).lerp(new lt(.2,.26,.14),.4),d>480&&a.lerp(new lt(.9,.92,.95),Ce(480,600,d)),o[l*3]=a.r,o[l*3+1]=a.g,o[l*3+2]=a.b}n.setAttribute("color",new Qt(o,3)),n.computeVertexNormals();let c=new ht(n,new At({vertexColors:!0,roughness:1}));c.position.y=-.5,this.scene.add(c)}buildWater(){let t=vf();t.repeat.set(600,600);let e=new At({color:862778,roughness:.06,metalness:.1,normalMap:t,normalScale:new tt(.35,.35),envMapIntensity:1.2}),n=new Ve(4e4,4e4);n.rotateX(-Math.PI/2);let i=new ht(n,e);i.position.y=Mi,i.receiveShadow=!0,this.scene.add(i),this.updaters.push((r,o)=>{t.offset.set(o*.004,o*.0025)})}ribbon(t,e,n,i,r,o=-1,a=1){let c=t.length,l=e?c+1:c,h=new Float32Array(l*2*3),u=new Float32Array(l*2*2),f=new Float32Array(l*2*3),d=0;for(let m=0;m<l;m++){let p=m%c,y=t[p],v=t[e?(p-1+c)%c:Math.max(0,p-1)],M=t[e?(p+1)%c:Math.min(c-1,p+1)],R=M.x-v.x,S=M.z-v.z,T=Math.hypot(R,S)||1;R/=T,S/=T;let D=-S,_=R;if(m>0){let b=t[(m-1)%c];d+=Math.hypot(y.x-b.x,y.z-b.z)}for(let b=0;b<2;b++){let U=(b===0?o:a)*n,L=m*2+b;h[L*3]=y.x+D*U,h[L*3+1]=y.h+i,h[L*3+2]=y.z+_*U,u[L*2]=b,u[L*2+1]=d/r,f[L*3+1]=1}}let g=[];for(let m=0;m<l-1;m++){let p=m*2,y=p+1,v=p+2,M=p+3;g.push(p,y,v,y,M,v)}let x=new oe;return x.setAttribute("position",new Qt(h,3)),x.setAttribute("uv",new Qt(u,2)),x.setAttribute("normal",new Qt(f,3)),x.setIndex(g),x.computeVertexNormals(),x}buildRoadMeshes(){let t=oa(3,!0),e=oa(2,!1),n=new At({map:t,roughness:.78,metalness:0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=new At({map:e,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),r=oa(1,!1),o=new At({map:r,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-.8,polygonOffsetUnits:-.8}),a=new At({color:4866616,roughness:1,polygonOffset:!0,polygonOffsetFactor:-.5,polygonOffsetUnits:-.5});for(let c of this.net.roads){let l=c.kind==="highway",h=this.ribbon(c.pts,c.closed,c.halfW+(l?1.2:.8),l?.14:c.kind==="ramp"?.1:.12,l?36:30),u=new ht(h,l?n:c.kind==="ramp"?o:i);u.receiveShadow=!0,this.scene.add(u);let f=this.ribbon(c.pts,c.closed,c.halfW+4,.06,30),d=new ht(f,a);d.receiveShadow=!0,this.scene.add(d)}this.buildRails(),this.buildHighwayLamps(),this.buildGantries()}buildRails(){let e=this.net.loop.pts,n=e.length,i=ia+1.9,r=[];for(let m=0;m<n;m++){let p=e[m],y=e[(m-1+n)%n],v=e[(m+1)%n],M=v.x-y.x,R=v.z-y.z,S=Math.hypot(M,R);M/=S,R/=S;let T=-R,D=M;T*p.x+D*p.z<0&&(T=-T,D=-D),r.push({x:p.x+T*i,z:p.z+D*i,h:p.h})}let o=n+1,a=new Float32Array(o*2*3);for(let m=0;m<o;m++){let p=r[m%n];a.set([p.x,p.h+.45,p.z,p.x,p.h+.95],m*6),a[m*6+5]=p.z}let c=[];for(let m=0;m<o-1;m++){let p=m*2;c.push(p,p+1,p+2,p+1,p+3,p+2)}let l=new oe;l.setAttribute("position",new Qt(a,3)),l.setIndex(c),l.computeVertexNormals();let h=new At({color:12106944,metalness:.85,roughness:.35,side:Oe}),u=new ht(l,h);u.castShadow=!0,u.receiveShadow=!0,this.scene.add(u);let f=new It(.15,1,.15);f.translate(0,.5,0);let d=new Re(f,new At({color:7830400,metalness:.7,roughness:.5}),n),g=new Kt;for(let m=0;m<n;m++){let p=r[m];g.makeTranslation(p.x,p.h,p.z),d.setMatrixAt(m,g)}this.scene.add(d);let x=new Re(new It(.1,.1,.1),new Me({color:new lt(3,1.2,.2)}),Math.ceil(n/3));for(let m=0,p=0;m<n;m+=3,p++){let y=r[m];g.makeTranslation(y.x,y.h+.75,y.z),x.setMatrixAt(p,g)}this.scene.add(x);for(let m=0;m<n;m++){let p=r[m],y=r[(m+1)%n];this.statics.addSeg(p.x,p.z,y.x,y.z,"rail")}this.railPts=r}lampGeometry(t,e){let n=new ze(.1,.16,t,8);n.translate(0,t/2,0);let i=new It(.12,.12,e);i.translate(0,t-.1,e/2);let r=new ze(.3,.35,.6,8);r.translate(0,.3,0);let o=Bs([n,i,r]),a=new It(.45,.14,1.1);return a.translate(0,t-.22,e-.3),{g:o,head:a}}buildHighwayLamps(){let t=this.net.loop.pts,e=t.length,{g:n,head:i}=this.lampGeometry(11,3.2),r=6,o=Math.ceil(e/r),a=new At({color:5922402,metalness:.8,roughness:.4}),c=new At({color:2236962,emissive:new lt(1,.72,.4),emissiveIntensity:5}),l=new Re(n,a,o),h=new Re(i,c,o);l.castShadow=!0;let u=[],f=new Kt,d=new fn,g=new P(1,1,1),x=new P(0,1,0),m=0;for(let p=0;p<e;p+=r){let y=this.railPts[p],v=t[p],M=Math.atan2(v.x-y.x,v.z-y.z);d.setFromAxisAngle(x,M),f.compose(new P(y.x+(y.x-v.x)*.04,y.h,y.z+(y.z-v.z)*.04),d,g),l.setMatrixAt(m,f),h.setMatrixAt(m,f),m++,u.push({x:y.x+Math.sin(M)*3.5,z:y.z+Math.cos(M)*3.5,y:v.h+.2,s:13})}this.scene.add(l,h),this.addLightPools(u)}addLightPools(t){this.poolTex||(this.poolTex=pn("rgba(255,190,120,0.9)","rgba(255,150,80,0)",128));let e=new Ve(1,1);e.rotateX(-Math.PI/2);let n=new Me({map:this.poolTex,transparent:!0,opacity:.28,blending:ke,depthWrite:!1,fog:!0}),i=new Re(e,n,t.length),r=new Kt;t.forEach((o,a)=>{r.makeScale(o.s,1,o.s).setPosition(o.x,o.y,o.z),i.setMatrixAt(a,r)}),i.renderOrder=2,this.scene.add(i)}buildGantries(){let t=this.net.loop,e=t.pts.length,n=new At({color:9080466,metalness:.8,roughness:.4});for(let i of this.net.connectors)for(let r of[1,-1]){let o=(i.loopIndex-r*34+e)%e,a=t.pts[o],c=t.pts[(o+r+e)%e],l=Math.atan2(c.x-a.x,c.z-a.z),h=new Ne,u=ia*2+4,f=new ht(new It(u,.5,.5),n);f.position.y=7.5;let d=new ht(new It(.4,7.8,.4),n);d.position.set(-u/2,3.9,0);let g=d.clone();g.position.x=u/2;let x=aa(i.name,{sub:"NEXT EXIT",w:512,h:200}),m=new ht(new Ve(8,3.1),new At({map:x,emissive:16777215,emissiveMap:x,emissiveIntensity:.35,roughness:.5}));m.position.set(-5,6.2,-.3),m.rotation.y=Math.PI,h.add(f,d,g,m),h.position.set(a.x,a.h,a.z),h.rotation.y=l,h.traverse(v=>{v.isMesh&&(v.castShadow=!0)}),this.scene.add(h);let p=Math.cos(l),y=-Math.sin(l);this.statics.addCircle(a.x+p*u/2,a.z+y*u/2,.5,"post"),this.statics.addCircle(a.x-p*u/2,a.z-y*u/2,.5,"post")}}buildCity(){let t=Os,e=$e,n=cf,i=qi(2024),r=this.scene,o=mf();o.repeat.set(1224/14,1224/14);let a=new ht(new Ve(1224,1224),new At({map:o,roughness:.75,color:11579568}));a.rotation.x=-Math.PI/2,a.position.y=.04,a.receiveShadow=!0,r.add(a);let c=new Ve(1,1);c.rotateX(-Math.PI/2);let l=new At({color:14474452,roughness:.6,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),h=new At({color:14197792,roughness:.6,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),u=[],f=[],d=[];for(let w=-e;w<=e;w+=t)d.push(w);for(let w of d)for(let V=-e;V<e;V+=t){let F=V+n+2,j=V+t-n-2,G=j-F,rt=(F+j)/2;for(let it of[-.25,.25])f.push([rt,w+it,G,.18]),f.push([w+it,rt,.18,G]);for(let it of[-5,5])for(let A=F+2;A<j-3;A+=9)u.push([A+1.5,w+it,3,.16]),u.push([w+it,A+1.5,.16,3])}for(let w of d)for(let V of d)for(let F=-8;F<=8;F+=1.6)u.push([w+F,V-n-1.2,.8,2.6]),u.push([w+F,V+n+1.2,.8,2.6]),u.push([w-n-1.2,V+F,2.6,.8]),u.push([w+n+1.2,V+F,2.6,.8]);let g=(w,V)=>{let F=new Re(c,V,w.length),j=new Kt;w.forEach((G,rt)=>{j.makeScale(G[2],1,G[3]).setPosition(G[0],.06,G[1]),F.setMatrixAt(rt,j)}),F.receiveShadow=!0,r.add(F)};g(u,l),g(f,h);let x=[];for(let w=-e;w<e;w+=t)for(let V=-e;V<e;V+=t){let F=w+t/2,j=V+t/2,G=Math.hypot(F,j),rt=i(),it="build";rt<.09&&G>150?it="park":rt<.13&&G>150&&(it="plaza"),x.push({cx:F,cz:j,type:it,d:G})}let m=t-n*2,p=xf();p.repeat.set(m/4,m/4);let y=new It(m,.3,m);y.translate(0,.15,0);let v=new At({map:p,roughness:.9}),M=new Re(y,v,x.length),R=new At({color:4086308,roughness:1}),S=[],T=new Kt;if(x.forEach((w,V)=>{T.makeTranslation(w.cx,0,w.cz),M.setMatrixAt(V,T),this.statics.addBox(w.cx-m/2,w.cz-m/2,w.cx+m/2,w.cz+m/2,"block"),w.type==="park"&&S.push(w)}),M.receiveShadow=!0,r.add(M),S.length){let w=new It(m-8,.05,m-8),V=new Re(w,R,S.length);S.forEach((F,j)=>{T.makeTranslation(F.cx,.32,F.cz),V.setMatrixAt(j,T)}),V.receiveShadow=!0,r.add(V)}let D=[],_=[9078144,11050120,7172728,5923952,10119762,8288880,11577496,4870232,6969932],b=(w,V,F,j,G,rt,it,A)=>D.push({x:w,z:V,w:F,d:j,h:G,seed:rt,style:it,color:A}),U=[],L=[];for(let w of x){let V=1-dt(w.d/820,0,1),F=m/2-5;if(w.type==="park"){for(let rt=0;rt<26;rt++)U.push({x:w.cx+(i()-.5)*(m-14),z:w.cz+(i()-.5)*(m-14),s:.8+i()*.6});continue}if(w.type==="plaza"){L.push(w);for(let rt=0;rt<8;rt++){let it=rt/8*Math.PI*2;U.push({x:w.cx+Math.cos(it)*34,z:w.cz+Math.sin(it)*34,s:.9})}continue}let j=i(),G=[];if(V>.55&&j<.45)G.push([w.cx,w.cz,F*2,F*2]);else if(j<.7)G.push([w.cx-F/2-3/2,w.cz,F-3,F*2],[w.cx+F/2+3/2,w.cz,F-3,F*2]);else{let it=F/2+1.5,A=F-3;G.push([w.cx-it,w.cz-it,A,A],[w.cx+it,w.cz-it,A,A],[w.cx-it,w.cz+it,A,A],[w.cx+it,w.cz+it,A,A])}for(let[rt,it,A,E]of G){let k=18+V*V*190,st=10+i()*i()*k+V*20,ot=.8+i()*.2,et=V>.4&&i()<.55?.75+i()*.25:i()*.7,bt=_[Math.floor(i()*_.length)],pt=i(),yt=A*ot,Tt=E*(.8+i()*.2);b(rt,it,yt,Tt,st,pt,et,bt),st>70&&(b(rt,it,yt*.7,Tt*.7,st*(.18+i()*.2),pt+.3,et,bt),i()<.6&&b(rt,it,yt*.35,Tt*.35,st*.1,pt+.6,et,3816770)),i()<.5&&b(rt+(i()-.5)*yt*.5,it+(i()-.5)*Tt*.5,4+i()*5,4+i()*5,2+i()*2,.9,.1,5593180)}if(V<.5)for(let rt=-40;rt<=40;rt+=20)U.push({x:w.cx+rt,z:w.cz-m/2+2.2,s:.55},{x:w.cx+rt,z:w.cz+m/2-2.2,s:.55})}let H=new It(1,1,1);H.translate(0,.5,0);let I=this.buildingMaterial(),z=new Re(H,I,D.length),O=new Float32Array(D.length*2),K=new lt,Q=[],Z=[],X=[];if(D.forEach((w,V)=>{let F=.3;for(let j=V-1;j>=Math.max(0,V-3);j--){let G=D[j];if(Math.abs(G.x-w.x)<G.w/2&&Math.abs(G.z-w.z)<G.d/2&&G.w>=w.w){F=G.y+G.h;break}}if(w.y=F,T.makeScale(w.w,w.h,w.d).setPosition(w.x,F,w.z),z.setMatrixAt(V,T),K.set(w.color),z.setColorAt(V,K),O[V*2]=w.seed,O[V*2+1]=w.style,F+w.h>110&&w.w<30&&Z.push([w.x,F+w.h+.6,w.z]),F===.3&&w.h>25&&i()<.35){let j=Math.floor(i()*4),G=8+i()*Math.min(40,w.h-16),rt=[[4,.4,2.2],[.4,2.5,4],[4,2.6,.3],[.3,3.5,3],[4,1.2,3.2]][Math.floor(i()*5)];X.push({x:w.x,z:w.z,y:G,side:j,w:w.w,d:w.d,c:rt,sw:4+i()*6,sh:1.5+i()*3})}}),H.setAttribute("aSeed",new Oi(O,2)),z.castShadow=!0,z.receiveShadow=!1,r.add(z),Z.length){let w=new Me({color:new lt(6,.2,.1)}),V=new Re(new Vi(.6,8,6),w,Z.length);Z.forEach((F,j)=>{T.makeTranslation(F[0],F[1],F[2]),V.setMatrixAt(j,T)}),r.add(V),this.updaters.push((F,j)=>{let G=j%1.6<.25?1:.05;w.color.setRGB(6*G,.2*G,.1*G)})}if(X.length){let w=new Ve(1,1),V=new Me({color:16777215,side:Oe}),F=new Re(w,V,X.length),j=new fn,G=new P(0,1,0);X.forEach((rt,it)=>{let A=[[0,rt.d/2+.15,0],[rt.w/2+.15,0,Math.PI/2],[0,-rt.d/2-.15,Math.PI],[-rt.w/2-.15,0,-Math.PI/2]][rt.side];j.setFromAxisAngle(G,A[2]),T.compose(new P(rt.x+A[0],rt.y,rt.z+A[1]),j,new P(rt.sw,rt.sh,1)),F.setMatrixAt(it,T),K.setRGB(rt.c[0],rt.c[1],rt.c[2]),F.setColorAt(it,K)}),r.add(F)}for(let w of L){let V=new ht(new ze(12,12.5,1,32),new At({color:10130570,roughness:.8}));V.position.set(w.cx,.8,w.cz);let F=new ht(new ze(11.3,11.3,.1,32),new At({color:1917008,roughness:.05,metalness:.2}));F.position.set(w.cx,1.2,w.cz);let j=new ht(new ze(1,1.5,5,12),V.material);j.position.set(w.cx,3,w.cz);let G=new ht(new Vi(1.2,16,8),new Me({color:new lt(.6,2.2,3)}));G.position.set(w.cx,5.8,w.cz),V.castShadow=j.castShadow=!0,r.add(V,F,j,G)}let Y=[];for(let w of d)for(let V=-e+20;V<=e-20;V+=40){let F=(V%t+t)%t;if(!(F<14||F>t-14))for(let j of[-1,1])Math.abs(w+j*(n+1.3))>e||(Y.push({x:V,z:w+j*(n+1.3),ang:j>0?Math.PI:0}),Y.push({x:w+j*(n+1.3),z:V,ang:j>0?-Math.PI/2:Math.PI/2}))}let{g:ct,head:J}=this.lampGeometry(8,2.2),nt=new At({color:2764080,metalness:.7,roughness:.5}),mt=new At({color:1118481,emissive:new lt(1,.78,.5),emissiveIntensity:5}),Mt=new Re(ct,nt,Y.length),vt=new Re(J,mt,Y.length),Rt=new fn,Ct=new P(0,1,0),Et=new P(1,1,1),Dt=[];Y.forEach((w,V)=>{Rt.setFromAxisAngle(Ct,w.ang),T.compose(new P(w.x,.3,w.z),Rt,Et),Mt.setMatrixAt(V,T),vt.setMatrixAt(V,T),Dt.push({x:w.x+Math.sin(w.ang)*2.5,z:w.z+Math.cos(w.ang)*2.5,y:.08,s:10})}),Mt.castShadow=!0,r.add(Mt,vt),this.addLightPools(Dt),this.cityTrees=U}buildingMaterial(){let t=new At({color:16777215,roughness:.85,metalness:0,envMapIntensity:1});return t.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
        attribute vec2 aSeed; varying vec2 vSeed; varying vec3 vBW; varying vec3 vBN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vec4 bwp = vec4(transformed, 1.0);
        vec3 bn = normal;
        #ifdef USE_INSTANCING
          bwp = instanceMatrix * bwp;
          bn = mat3(instanceMatrix) * bn;
        #endif
        vBW = (modelMatrix * bwp).xyz; vBN = bn; vSeed = aSeed;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
        varying vec2 vSeed; varying vec3 vBW; varying vec3 vBN;
        float bhash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }`).replace("#include <color_fragment>",`#include <color_fragment>
        vec3 bN = normalize(vBN);
        float isWall = 1.0 - step(0.5, abs(bN.y));
        vec2 tg = normalize(vec2(-bN.z, bN.x) + 1e-5);
        float bu = dot(vBW.xz, tg);
        float bv = vBW.y;
        float glassy = step(0.75, vSeed.y);
        float cw = mix(3.0, 4.4, fract(vSeed.y * 7.0));
        vec2 cell = vec2(bu / cw, bv / 3.6);
        vec2 fw = fract(cell); vec2 wid = floor(cell);
        float mx = mix(0.17, 0.04, glassy), my = mix(0.24, 0.06, glassy);
        float win = step(mx, fw.x) * step(fw.x, 1.0 - mx) * step(my, fw.y) * step(fw.y, 1.0 - my * 0.6) * step(4.6, bv) * isWall;
        float bRnd = bhash(wid + vSeed.x * 91.7);
        float bLit = step(0.66 - glassy * 0.12, bRnd) * win * step(vSeed.y, 0.99);
        vec3 glassCol = mix(vec3(0.03, 0.045, 0.07), vec3(0.05, 0.09, 0.12), glassy);
        diffuseColor.rgb = mix(diffuseColor.rgb, glassCol, win);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.4 + 0.05, 1.0 - isWall);
        float bShop = isWall * step(bv, 4.1) * step(0.9, bv) * step(vSeed.y, 0.99);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02), bShop);
        float bWin = win;`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.16, max(bWin, bShop));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        vec3 warm = mix(vec3(1.0, 0.7, 0.4), vec3(0.7, 0.85, 1.0), step(0.86, bRnd));
        totalEmissiveRadiance += warm * bLit * (0.5 + bRnd * 1.5);
        vec3 shopCol = mix(vec3(1.0, 0.55, 0.25), vec3(0.35, 0.75, 1.0), fract(vSeed.x * 13.0));
        totalEmissiveRadiance += shopCol * bShop * 1.4 * step(0.25, fract(bu * 0.07 + vSeed.x));`)},t}buildNature(){let t=qi(8080),e=dn(3131),n=[],i=[],r=[];for(let L=0;L<6e4&&n.length+i.length<9e3;L++){let H=(t()*2-1)*1980,I=(t()*2-1)*1980;if(Math.abs(H)<660&&Math.abs(I)<660)continue;let z=this.hf.get(H,I);if(z<Mi+1.5||z>240||this.hf.roadDist(H,I)<9)continue;let O=Pn(e,H/260,I/260,3)*.5+.5;if(t()>Ce(.35,.75,O)*.95+.03)continue;let K=new P;if(this.hf.normal(H,I,K),K.y<.8){t()<.1&&r.push({x:H,z:I,h:z,s:1+t()*3});continue}let Q=.8+t()*.8;z>60||t()<.45?n.push({x:H,z:I,h:z,s:Q}):i.push({x:H,z:I,h:z,s:Q})}for(let L=0;L<900;L++){let H=(t()*2-1)*1950,I=(t()*2-1)*1950;if(Math.abs(H)<660&&Math.abs(I)<660)continue;let z=this.hf.get(H,I);z<Mi||this.hf.roadDist(H,I)<8||r.push({x:H,z:I,h:z,s:.8+t()*2.8})}for(let L of this.cityTrees)i.push({x:L.x,z:L.z,h:.3,s:L.s,city:!0});let o=new Kt,a=new fn,c=new P(0,1,0),l=new P,h=new P,u=new lt,f=(L,H,I,z,O)=>{let Q=new Map;for(let Z of L){let X=Math.floor(Z.x/700)*1e3+Math.floor(Z.z/700),Y=Q.get(X);Y||Q.set(X,Y=[]),Y.push(Z)}for(let Z of Q.values()){let X=H.map((Y,ct)=>new Re(Y,I[ct],Z.length));Z.forEach((Y,ct)=>{z(Y,o);for(let J of X)J.setMatrixAt(ct,o);Y.col&&X[X.length-1].setColorAt(ct,Y.col)});for(let Y of X)Y.castShadow=O,Y.receiveShadow=!0,Y.computeBoundingSphere(),this.scene.add(Y)}},d=new At({color:4863270,roughness:1}),g=new ze(.25,.4,4,5);g.translate(0,2,0);let x=new xi(3.2,7,7);x.translate(0,6.5,0);let m=new xi(2.5,6,7);m.translate(0,9.5,0);let p=new xi(1.6,4.5,6);p.translate(0,12.5,0);let y=Bs([x,m,p]),v=new At({color:16777215,roughness:.95,flatShading:!0});for(let L of n)L.rot=t()*6.28,L.sy=L.s*(.9+t()*.4),L.col=new lt().setHSL(.3+t()*.06,.35+t()*.2,.18+t()*.08),this.statics.addCircle(L.x,L.z,.45*L.s,"tree");f(n,[g,y],[d,v],(L,H)=>{a.setFromAxisAngle(c,L.rot),l.set(L.s,L.sy,L.s),h.set(L.x,L.h-.3,L.z),H.compose(h,a,l)},!0);let M=new ze(.22,.35,3.5,5);M.translate(0,1.75,0);let R=new Ds(2.8,0);R.translate(0,5,0);let S=new Ds(2.1,0);S.translate(1.3,6.2,.6);let T=new Ds(2,0);T.translate(-1.1,5.8,-.8);let D=Bs([R,S,T]),_=new At({color:16777215,roughness:.9,flatShading:!0});for(let L of i)L.rot=t()*6.28,L.col=new lt().setHSL(.18+t()*.12,.45+t()*.2,.2+t()*.12),L.city||this.statics.addCircle(L.x,L.z,.4*L.s,"tree");f(i,[M,D],[d,_],(L,H)=>{a.setFromAxisAngle(c,L.rot),l.setScalar(L.s),h.set(L.x,L.h-.2,L.z),H.compose(h,a,l)},!0);let b=new Go(1,0),U=new At({color:7827562,roughness:.95,flatShading:!0});for(let L of r)L.e=new Ts(t()*3,t()*3,t()*3),L.sc=new P(L.s*(.8+t()*.6),L.s*(.5+t()*.4),L.s*(.8+t()*.6)),L.s>1.2&&this.statics.addCircle(L.x,L.z,L.s*.8,"rock");f(r,[b],[U],(L,H)=>{a.setFromEuler(L.e),h.set(L.x,L.h,L.z),H.compose(h,a,L.sc)},!0)}buildMinimap(){let e=2048/(Ge*2),n=document.createElement("canvas");n.width=n.height=2048;let i=n.getContext("2d"),r=i.createImageData(2048/4,2048/4);for(let c=0;c<2048/4;c++)for(let l=0;l<2048/4;l++){let h=l*4/e-Ge,u=c*4/e-Ge,f=this.hf.get(h,u),d=(c*(2048/4)+l)*4;if(f<Mi)r.data[d]=10,r.data[d+1]=30,r.data[d+2]=52;else{let g=dt(26+f*.18,20,90);r.data[d]=g*.8,r.data[d+1]=g,r.data[d+2]=g*.85}r.data[d+3]=255}let o=document.createElement("canvas");o.width=o.height=2048/4,o.getContext("2d").putImageData(r,0,0),i.imageSmoothingEnabled=!0,i.drawImage(o,0,0,2048,2048);let a=c=>(c+Ge)*e;i.fillStyle="#2b3036",i.fillRect(a(-612),a(-612),1224*e,1224*e),i.fillStyle="#15181c";for(let c=-$e;c<$e;c+=Os)for(let l=-$e;l<$e;l+=Os)i.fillRect(a(c+10),a(l+10),100*e,100*e);i.lineCap="round",i.lineJoin="round";for(let c of this.net.roads)i.strokeStyle=c.kind==="highway"?"#8f9aa6":"#727c86",i.lineWidth=c.halfW*2*e*1.2,i.beginPath(),c.pts.forEach((l,h)=>h?i.lineTo(a(l.x),a(l.z)):i.moveTo(a(l.x),a(l.z))),c.closed&&i.closePath(),i.stroke();this.minimapCanvas=n,this.minimapScale=e}update(t,e){Fv.time.value=e;for(let n of this.updaters)n(t,e)}};var la={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Bv=new Rs(-1,1,1,-1,0,1),El=class extends oe{constructor(){super(),this.setAttribute("position",new jt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new jt([0,2,0,0,2,0],2))}},Ov=new El,Ei=class{constructor(t){this._mesh=new ht(Ov,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Bv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var ks=class extends mn{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof ve?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=On.clone(t.uniforms),this.material=new ve({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ei(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Ar=class extends mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},ha=class extends mn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var ua=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new tt);this._width=n.width,this._height=n.height,e=new He(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ks(la),this.copyPass.material.blending=Fn,this.clock=new $o}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ar!==void 0&&(o instanceof Ar?n=!0:o instanceof ha&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new tt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var fa=class extends mn{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new lt}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}};var _f={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new lt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Hs=class s extends mn{constructor(t,e,n,i){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new tt(t.x,t.y):new tt(256,256),this.clearColor=new lt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new He(r,o,{type:hn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let f=new He(r,o,{type:hn});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let d=new He(r,o,{type:hn});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=_f;this.highPassUniforms=On.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ve({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new tt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let h=la;this.copyUniforms=On.clone(h.uniforms),this.blendMaterial=new ve({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:ke,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new lt,this.oldClearAlpha=1,this.basic=new Me,this.fsQuad=new Ei(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new tt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){let e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new ve({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new tt(.5,.5)},direction:{value:new tt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new ve({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};Hs.BlurDirectionX=new tt(1,0);Hs.BlurDirectionY=new tt(0,1);var Mf={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var da=class extends mn{constructor(){super();let t=Mf;this.uniforms=On.clone(t.uniforms),this.material=new vi({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ei(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ee.getTransfer(this._outputColorSpace)===le&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ll?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===hl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ul?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Er?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===fl&&(this.material.defines.AGX_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var kv={uniforms:{tDiffuse:{value:null},uSpeed:{value:0},uBlur:{value:1},uTime:{value:0},uDamage:{value:0},uNitro:{value:0},uVig:{value:1},uRes:{value:new tt(1,1)},uSiren:{value:new P}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uSpeed, uBlur, uTime, uDamage, uNitro, uVig; uniform vec2 uRes; uniform vec3 uSiren;
    varying vec2 vUv;
    float h(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    void main(){
      vec2 c = vec2(0.5, 0.52);
      vec2 d = vUv - c;
      float r = length(d);
      float mask = smoothstep(0.18, 0.75, r);
      float amt = uSpeed * uBlur;
      vec3 col = vec3(0.0);
      if (amt > 0.01) {
        float st = 0.028 * amt * mask;
        float tot = 0.0;
        for (int i = 0; i < 8; i++) { float f = float(i) / 7.0; float w = 1.0 - f * 0.6; col += texture2D(tDiffuse, vUv - d * st * f).rgb * w; tot += w; }
        col /= tot;
      } else col = texture2D(tDiffuse, vUv).rgb;
      // chromatic aberration toward edges
      float ca = (0.0012 + 0.0035 * amt) * mask;
      col.r = mix(col.r, texture2D(tDiffuse, vUv + d * ca * 2.0).r, 0.7);
      col.b = mix(col.b, texture2D(tDiffuse, vUv - d * ca * 2.0).b, 0.7);
      // speed streaks
      if (amt > 0.05) {
        float ang = atan(d.y, d.x);
        float lane = floor(ang * 70.0);
        float s = step(0.965, h(vec2(lane + 300.0, mod(floor(uTime * 14.0 + lane * 0.37), 997.0))));
        float along = fract(r * 3.0 - uTime * 4.0 + h(vec2(lane, 1.0)));
        col += vec3(0.7, 0.8, 1.0) * s * smoothstep(0.35, 0.9, r) * smoothstep(0.0, 0.3, along) * (1.0 - along) * amt * 0.5;
      }
      // grading: slight saturation + contrast in linear
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, 1.12);
      // vignette
      float vig = 1.0 - smoothstep(0.45, 1.05, r * 1.25) * 0.55 * uVig;
      col *= vig;
      // damage & nitro & siren edge glow
      float edge = smoothstep(0.35, 0.85, r);
      col = mix(col, col * vec3(1.6, 0.3, 0.3) + vec3(0.25, 0.0, 0.0), edge * uDamage);
      col += vec3(0.1, 0.3, 1.0) * edge * uNitro * 0.35;
      col += vec3(uSiren.x, 0.0, uSiren.y) * edge * 0.25 * uSiren.z;
      // grain
      col += (h(vUv * uRes + fract(uTime * 7.0) * 311.0) - 0.5) * 0.015;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`},pa=class{constructor(t,e,n){this.renderer=t;let i=t.getSize(new tt),r=t.getPixelRatio(),o=new He(i.x*r,i.y*r,{type:hn,samples:4});this.composer=new ua(t,o),this.render=new fa(e,n),this.composer.addPass(this.render),this.bloom=new Hs(new tt(i.x,i.y),.5,.5,1),this.composer.addPass(this.bloom),this.final=new ks(kv),this.composer.addPass(this.final),this.composer.addPass(new da),this.u=this.final.uniforms}setSize(t,e){this.composer.setSize(t,e),this.u.uRes.value.set(t,e)}setQuality(t){this.bloom.enabled=t>0}draw(t){this.u.uTime.value+=t,this.composer.render(t)}};var Vs=[{id:"chase",label:"3\u4EBA\u79F0 (\u8FD1)"},{id:"far",label:"3\u4EBA\u79F0 (\u9060)"},{id:"cockpit",label:"1\u4EBA\u79F0 (\u30B3\u30C3\u30AF\u30D4\u30C3\u30C8)"},{id:"hood",label:"1\u4EBA\u79F0 (\u30DC\u30F3\u30CD\u30C3\u30C8)"}],bf=new P,wl=new P,ma=class{constructor(t,e,n){this.cam=t,this.world=e,this.settings=n,this.modeIndex=0,this.yaw=0,this.pitch=0,this.pos=new P(0,50,0),this.look=new P,this.shake=0,this.shakeT=0,this.fov=65,this.lookBack=!1,this.cine=null,this.orbitT=0}get mode(){return Vs[this.modeIndex].id}cycle(){return this.modeIndex=(this.modeIndex+1)%Vs.length,this.snap=!0,Vs[this.modeIndex]}setMode(t){this.modeIndex=t,this.snap=!0}addShake(t){let e=this.settings.shake;e&&(this.shake=Math.min(1.2,this.shake+t*(e===2?1:.45)))}applyCarVisibility(t){let e=this.mode==="cockpit"&&!this.cine;t.interior&&(t.interior.group.visible=e);let n=t.model.parts;for(let i=0;i<2;i++)n[i]&&(n[i].visible=!e);for(let i of t.model.heads)i.visible=!e}update(t,e,n){let i=this.cam,r=this.settings;if(this.cine){this.updateCine(t,n);return}if(!e)return;this.applyCarVisibility(e);let o=Math.sin(e.yaw),a=Math.cos(e.yaw),c=e.speed,l=this.snap;this.snap=!1;let h=l?1e3:1,u=r.fov;r.speedFx&&(u+=dt((c-20)/70,0,1)*9+(e.nitroActive?5:0));let f=this.mode;if(f==="chase"||f==="far"){let g=e.yaw;if(c>5){let S=Math.atan2(e.vel.x,e.vel.y);e.vF>0&&(g=e.yaw+_i(S-e.yaw)*.45)}this.lookBack&&(g+=Math.PI),this.yaw=l?g:af(this.yaw,g,this.lookBack?30:4.2,t);let x=f==="far",m=(x?9.5:6.3)+dt(c*.012,0,1),p=x?3.4:2.05,y=e.pos.x-Math.sin(this.yaw)*m,v=e.pos.z-Math.cos(this.yaw)*m,M=e.pos.y+p,R=this.world.heightAt(y,v)+1;M<R&&(M=R),l?this.pos.set(y,M,v):(this.pos.x=nn(this.pos.x,y,18,t),this.pos.z=nn(this.pos.z,v,18,t),this.pos.y=nn(this.pos.y,M,7,t)),this.look.set(e.pos.x+Math.sin(this.yaw)*4,e.pos.y+(x?1.3:1.15),e.pos.z+Math.cos(this.yaw)*4),i.position.copy(this.pos),i.up.set(0,1,0),i.lookAt(this.look)}else{let g=e.model.profile,x,m,p;f==="cockpit"?(x=.38,m=g.belt+(g.roofH-g.belt)*.62,p=g.roofF-.4,u+=6):(x=0,m=(g.hoodFront||.9)+.3,p=g.L/2-.42,u+=4);let y=e.pitch*.5+e.bodyPitch*.3;this.pitch=l?y:nn(this.pitch,y,6,t);let v=Math.cos(e.yaw),M=Math.sin(e.yaw),R=e.pos.x+x*v+p*M,S=e.pos.z-x*M+p*v,T=e.pos.y+m-p*Math.sin(this.pitch);i.position.set(R,T,S);let D=e.yaw+dt(e.angVel*.12,-.2,.2);this.lookBack&&(D+=Math.PI),i.up.set(0,1,0),bf.set(R+Math.sin(D)*10,T-Math.tan(this.pitch)*10-.35,S+Math.cos(D)*10),i.lookAt(bf),this.yaw=e.yaw,this.pos.copy(i.position)}let d=r.shake?this.shake+(r.shake===2?dt((c-55)/40,0,1)*.08:0):0;d>.001&&(this.shakeT+=t*30,i.rotateY(Math.sin(this.shakeT*1.3)*.012*d),i.rotateX(Math.sin(this.shakeT*1.7+1)*.012*d)),this.shake=nn(this.shake,0,5,t),this.fov=l?u:nn(this.fov,u,3,t),Math.abs(i.fov-this.fov)>.01&&(i.fov=this.fov,i.updateProjectionMatrix())}startCine(t){this.cine={t:0,...t}}endCine(){this.cine=null,this.snap=!0}updateCine(t,e){let n=this.cine;n.t+=t;let i=this.cam,r=n.target();if(n.type==="orbit"){let o=(n.a0||0)+n.t*(n.speed??.25),a=n.r||9,c=n.h||2.5,l=r.x+Math.sin(o)*a,h=r.z+Math.cos(o)*a,u=Math.max(r.y+c,this.world.heightAt(l,h)+1.2);i.position.set(l,u,h),i.lookAt(r.x,r.y+(n.ly??.9),r.z)}else if(n.type==="attract"){let o=n.path,a=e*.012%1,c=o.length,l=a*c,h=Math.floor(l),u=l-h,f=o[h%c],d=o[(h+1)%c],g=ae(f.x,d.x,u),x=ae(f.z,d.z,u),m=Math.max(ae(f.y,d.y,u),this.world.heightAt(g,x)+4);this.pos.set(g,m,x),i.position.copy(this.pos);let p=o[(h+2)%c];wl.set(ae(d.x,p.x,u),ae(d.y,p.y,u)-8,ae(d.z,p.z,u)),this.look.lengthSq()||this.look.copy(wl),this.look.lerp(wl,Math.min(1,t*1.5)),i.lookAt(this.look)}else if(n.type==="side"){let o=n.dir||{x:1,z:0},a=n.px??r.x+o.z*8-o.x*3,c=n.pz??r.z-o.x*8-o.z*3;n.px===void 0&&(n.px=a,n.pz=c,n.py=Math.max(r.y+1.6,this.world.heightAt(a,c)+1.2)),i.position.set(n.px,n.py,n.pz),i.lookAt(r.x,r.y+.8,r.z)}Math.abs(i.fov-60)>.01&&(i.fov=60,i.updateProjectionMatrix())}};var Hv={0:"PadA",1:"PadB",2:"PadX",3:"PadY",4:"PadLB",5:"PadRB",8:"PadBack",9:"PadStart",12:"PadUp",13:"PadDown",14:"PadLeft",15:"PadRight"},ga=class{constructor(){this.keys=new Set,this.pressed=new Set,this.pad=null,this.padCount=0,this.padPrev=[],this.padVals=[],this.padAxes=[0,0],this.navDir=null,this.navNext=0,this.lastPadInput=0,this.steerSmooth=0,window.addEventListener("keydown",t=>{["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(t.code)&&t.preventDefault(),this.keys.has(t.code)||this.pressed.add(t.code),this.keys.add(t.code)}),window.addEventListener("keyup",t=>this.keys.delete(t.code)),window.addEventListener("blur",()=>this.keys.clear())}k(...t){return t.some(e=>this.keys.has(e))}hit(...t){return t.some(e=>this.pressed.has(e))}pollPad(){let t=[];try{t=[...navigator.getGamepads?navigator.getGamepads():[]].filter(l=>l&&l.connected)}catch{t=[]}this.padCount=t.length,this.pad=t.find(l=>l.mapping==="standard")||t[0]||null;let e=[],n=[],i=0,r=0;for(let l of t){l.buttons.forEach((f,d)=>{let g=typeof f=="object"?f.value:f;(typeof f=="object"?f.pressed||f.value>.5:f>.5)&&(e[d]=!0),n[d]=Math.max(n[d]||0,g||0)});let h=l.axes[0]||0,u=l.axes[1]||0;Math.abs(h)>Math.abs(i)&&(i=h),Math.abs(u)>Math.abs(r)&&(r=u)}this.padVals=n,this.padAxes=[i,r];let o=!1;for(let[l,h]of Object.entries(Hv))e[l]&&!this.padPrev[l]&&(this.pressed.add(h),o=!0),e[l]?this.keys.add(h):this.keys.delete(h);if(!o){for(let l=0;l<e.length;l++)if(e[l]&&!this.padPrev[l]){o=!0;break}}this.padPrev=e;let a=null;e[12]?a="NavUp":e[13]?a="NavDown":e[14]?a="NavLeft":e[15]?a="NavRight":(Math.abs(i)>.55||Math.abs(r)>.55)&&(a=Math.abs(i)>Math.abs(r)?i>0?"NavRight":"NavLeft":r>0?"NavDown":"NavUp");let c=performance.now();a!==this.navDir?(this.navDir=a,a&&(this.pressed.add(a),this.navNext=c+380,o=!0)):a&&c>this.navNext&&(this.pressed.add(a),this.navNext=c+120),o&&(this.lastPadInput=c)}drive(t){let e=0,n=0,i=0,r=this.k("KeyA","ArrowLeft"),o=this.k("KeyD","ArrowRight"),a=(r?1:0)-(o?1:0),c=a===0?7:Math.sign(a)!==Math.sign(this.steerSmooth)?9:4.2;this.steerSmooth+=Math.max(-c*t,Math.min(c*t,a-this.steerSmooth)),e=this.steerSmooth,n=this.k("KeyW","ArrowUp")?1:0,i=this.k("KeyS","ArrowDown")?1:0;let l=this.k("Space")?1:0,h=this.k("ShiftLeft","ShiftRight","KeyN")?1:0;if(this.padCount){let u=this.padAxes[0];Math.abs(u)>.12&&(e=-Math.sign(u)*((Math.abs(u)-.12)/.88)**1.4);let f=this.padVals[7]||0,d=this.padVals[6]||0;f>.05&&(n=Math.max(n,f)),d>.05&&(i=Math.max(i,d)),this.k("PadX","PadB")&&(l=1),this.k("PadA")&&(h=1)}return{steer:e,throttle:n,brake:i,handbrake:l,nitro:h}}endFrame(){this.pressed.clear()}};var ni=s=>440*Math.pow(2,(s-69)/12),xa=class{constructor(){this.ready=!1,this.settings={master:.8,music:.6,sfx:.9}}init(){if(this.ready){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=this.ctx=new t;this.master=e.createGain();let n=e.createDynamicsCompressor();n.threshold.value=-14,n.knee.value=10,n.ratio.value=4,n.attack.value=.004,n.release.value=.2,this.master.connect(n),n.connect(e.destination),this.musicBus=e.createGain(),this.musicBus.connect(this.master),this.sfxBus=e.createGain(),this.sfxBus.connect(this.master);let i=e.sampleRate*2;this.noise=e.createBuffer(1,i,e.sampleRate);let r=this.noise.getChannelData(0);for(let h=0;h<i;h++)r[h]=Math.random()*2-1;this.reverb=e.createConvolver();let o=e.sampleRate*2.2,a=e.createBuffer(2,o,e.sampleRate);for(let h=0;h<2;h++){let u=a.getChannelData(h);for(let f=0;f<o;f++)u[f]=(Math.random()*2-1)*Math.pow(1-f/o,3)}this.reverb.buffer=a,this.revSend=e.createGain(),this.revSend.gain.value=.35,this.revSend.connect(this.reverb),this.reverb.connect(this.musicBus),this.sfxRev=e.createGain(),this.sfxRev.gain.value=.25,this.sfxRev.connect(this.reverb),this.delay=e.createDelay(1),this.delay.delayTime.value=60/128*.75;let c=e.createGain();c.gain.value=.35;let l=e.createBiquadFilter();l.type="lowpass",l.frequency.value=2500,this.delay.connect(l),l.connect(c),c.connect(this.delay),l.connect(this.musicBus),this.delaySend=e.createGain(),this.delaySend.gain.value=.3,this.delaySend.connect(this.delay),this.ready=!0,this.applyVolumes(),this.buildLoops(),this.music=new Tl(this)}applyVolumes(){if(!this.ready)return;let t=this.settings;this.master.gain.value=t.master,this.musicBus.gain.value=t.music*.55,this.sfxBus.gain.value=t.sfx}noiseSrc(t=!0){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t,e.loopStart=Math.random(),e.loopEnd=e.loopStart+.9,e}buildLoops(){let t=this.ctx,e=(u,f)=>{let d=t.createOscillator();return d.type=u,d.frequency.value=f,d},n=this.engine={};n.out=t.createGain(),n.out.gain.value=0,n.out.connect(this.sfxBus),n.filter=t.createBiquadFilter(),n.filter.type="lowpass",n.filter.Q.value=2.5,n.shaper=t.createWaveShaper();let i=new Float32Array(1024);for(let u=0;u<1024;u++){let f=u/512-1;i[u]=Math.tanh(f*2.6)}n.shaper.curve=i,n.am=t.createGain(),n.am.gain.value=.7,n.o1=e("sawtooth",60),n.o2=e("sawtooth",60.6),n.o3=e("square",30),n.o4=e("triangle",120),n.lfo=e("sine",30),n.lfoG=t.createGain(),n.lfoG.gain.value=.3,n.lfo.connect(n.lfoG),n.lfoG.connect(n.am.gain);let r=t.createGain();r.gain.value=.6;let o=t.createGain();o.gain.value=.25,n.o1.connect(n.am),n.o2.connect(n.am),n.o3.connect(r),r.connect(n.am),n.o4.connect(o),o.connect(n.am),n.am.connect(n.shaper),n.shaper.connect(n.filter),n.filter.connect(n.out),n.nz=this.noiseSrc(),n.nzF=t.createBiquadFilter(),n.nzF.type="bandpass",n.nzF.frequency.value=600,n.nzF.Q.value=.8,n.nzG=t.createGain(),n.nzG.gain.value=0,n.nz.connect(n.nzF),n.nzF.connect(n.nzG),n.nzG.connect(n.out),n.turbo=e("sine",3e3),n.turboG=t.createGain(),n.turboG.gain.value=0,n.turbo.connect(n.turboG),n.turboG.connect(this.sfxBus),[n.o1,n.o2,n.o3,n.o4,n.lfo,n.nz,n.turbo].forEach(u=>u.start());let a=this.tire={};a.src=this.noiseSrc(),a.f1=t.createBiquadFilter(),a.f1.type="bandpass",a.f1.frequency.value=1100,a.f1.Q.value=3,a.f2=t.createBiquadFilter(),a.f2.type="bandpass",a.f2.frequency.value=2600,a.f2.Q.value=4,a.g=t.createGain(),a.g.gain.value=0,a.src.connect(a.f1),a.src.connect(a.f2),a.f1.connect(a.g),a.f2.connect(a.g),a.g.connect(this.sfxBus),a.src.start();let c=this.wind={};c.src=this.noiseSrc(),c.f=t.createBiquadFilter(),c.f.type="lowpass",c.f.frequency.value=400,c.g=t.createGain(),c.g.gain.value=0,c.src.connect(c.f),c.f.connect(c.g),c.g.connect(this.sfxBus),c.src.start();let l=this.rumble={};l.src=this.noiseSrc(),l.f=t.createBiquadFilter(),l.f.type="lowpass",l.f.frequency.value=180,l.g=t.createGain(),l.g.gain.value=0,l.src.connect(l.f),l.f.connect(l.g),l.g.connect(this.sfxBus),l.src.start();let h=this.nitro={};h.src=this.noiseSrc(),h.f=t.createBiquadFilter(),h.f.type="bandpass",h.f.frequency.value=350,h.f.Q.value=.7,h.g=t.createGain(),h.g.gain.value=0,h.src.connect(h.f),h.f.connect(h.g),h.g.connect(this.sfxBus),h.src.start(),this.sirens=[0,1].map(u=>{let f=e("square",800),d=e("sawtooth",803),g=t.createBiquadFilter();g.type="lowpass",g.frequency.value=2200;let x=t.createGain();x.gain.value=0;let m=t.createStereoPanner?t.createStereoPanner():t.createGain(),p=t.createGain();return p.gain.value=.4,f.connect(g),d.connect(p),p.connect(g),g.connect(x),x.connect(m),m.connect(this.sfxBus),f.start(),d.start(),{o:f,o2:d,g:x,p:m,mode:u,t:u*1.3}}),this.lastThrottle=0}update(t,e){if(!this.ready)return;let n=this.ctx,i=n.currentTime,r=this.engine,o=e.active?1:0,a=e.rpm??.2,c=e.throttle??0,l=34+a*175,h=.05;r.o1.frequency.setTargetAtTime(l,i,h),r.o2.frequency.setTargetAtTime(l*1.008,i,h),r.o3.frequency.setTargetAtTime(l*.5,i,h),r.o4.frequency.setTargetAtTime(l*2,i,h),r.lfo.frequency.setTargetAtTime(l*.5,i,h),r.filter.frequency.setTargetAtTime(300+c*2200+a*1600,i,.06),r.out.gain.setTargetAtTime(o*(.14+c*.1+a*.05),i,.08),r.nzG.gain.setTargetAtTime(o*c*a*.12,i,.08),r.nzF.frequency.setTargetAtTime(400+a*1400,i,.1),r.turbo.frequency.setTargetAtTime(1800+a*3200,i,.2),r.turboG.gain.setTargetAtTime(o*c*a*a*.012,i,.15),this.lastThrottle>.8&&c<.2&&a>.6&&o&&(this.blowoff(),Math.random()<.6&&this.backfire()),this.lastThrottle=c,e.shifted&&o&&this.shiftPop();let u=o*dt(e.skid??0,0,1)*dt((e.speed??0)/12,0,1);this.tire.g.gain.setTargetAtTime(u*.22,i,.05),this.tire.f1.frequency.setTargetAtTime(900+u*500+Math.random()*60,i,.05);let f=e.speed??0;this.wind.g.gain.setTargetAtTime(o*dt(f/90,0,1)**2*.22,i,.1),this.wind.f.frequency.setTargetAtTime(250+f*14,i,.1),this.rumble.g.gain.setTargetAtTime(o*(e.offroad?dt(f/30,0,1)*.5:0),i,.08),this.nitro.g.gain.setTargetAtTime(o*(e.nitro?.28:0),i,.06),this.nitro.f.frequency.setTargetAtTime(e.nitro?700:300,i,.3);let d=e.sirens||[];this.sirens.forEach((g,x)=>{let m=d[x];if(!m||!o){g.g.gain.setTargetAtTime(0,i,.1);return}g.t+=t;let p=m.mode??g.mode,y;p===0?y=650+520*(.5-.5*Math.cos(g.t/3.4*Math.PI*2)):y=700+480*(g.t/.32%1);let v=dt(343/(343+(m.vrel||0)),.8,1.25);g.o.frequency.setTargetAtTime(y*v,i,.02),g.o2.frequency.setTargetAtTime(y*v*1.005,i,.02),g.g.gain.setTargetAtTime(m.gain*.09,i,.08),g.p.pan&&g.p.pan.setTargetAtTime(dt(m.pan,-.9,.9),i,.05)})}silence(){this.ready&&this.update(.016,{active:!1})}env(t,e,n,i,r){t.gain.setValueAtTime(1e-4,e),t.gain.linearRampToValueAtTime(i,e+n),t.gain.exponentialRampToValueAtTime(1e-4,e+n+r)}burst({t=0,dur:e=.3,type:n="lowpass",f0:i=1e3,f1:r=null,q:o=1,gain:a=.5,attack:c=.002,bus:l=null,rev:h=0}){let u=this.ctx,f=u.currentTime+t,d=this.noiseSrc(!1),g=u.createBiquadFilter();g.type=n,g.frequency.setValueAtTime(i,f),g.Q.value=o,r&&g.frequency.exponentialRampToValueAtTime(r,f+e);let x=u.createGain();if(this.env(x,f,c,a,e),d.connect(g),g.connect(x),x.connect(l||this.sfxBus),h){let m=u.createGain();m.gain.value=h,x.connect(m),m.connect(this.sfxRev)}d.start(f,Math.random()),d.stop(f+e+c+.05)}tone({t=0,type:e="sine",f0:n=440,f1:i=null,dur:r=.2,gain:o=.3,attack:a=.005,bus:c=null,rev:l=0}){let h=this.ctx,u=h.currentTime+t,f=h.createOscillator();f.type=e,f.frequency.setValueAtTime(n,u),i&&f.frequency.exponentialRampToValueAtTime(i,u+r);let d=h.createGain();if(this.env(d,u,a,o,r),f.connect(d),d.connect(c||this.sfxBus),l){let g=h.createGain();g.gain.value=l,d.connect(g),g.connect(this.sfxRev)}f.start(u),f.stop(u+r+a+.05)}crash(t=1){if(!this.ready)return;let e=dt(t,.1,1.5);this.burst({dur:.25+e*.35,f0:2500,f1:300,gain:.35*e,rev:.4}),this.tone({type:"sine",f0:90,f1:38,dur:.35,gain:.6*e});for(let n=0;n<3;n++)this.tone({type:"square",f0:300+Math.random()*900,f1:200+Math.random()*200,dur:.12+Math.random()*.2,gain:.05*e,t:Math.random()*.05});if(e>.7)for(let n=0;n<5;n++)this.burst({t:.03+Math.random()*.25,dur:.06,type:"highpass",f0:5e3,gain:.12*e})}scrape(t=.5){this.ready&&this.burst({dur:.2,type:"bandpass",f0:1800,q:4,gain:.2*t})}landing(t=1){this.ready&&(this.tone({f0:70,f1:35,dur:.3,gain:.5*t}),this.burst({dur:.2,f0:400,gain:.25*t}))}blowoff(){this.ready&&this.burst({dur:.35,type:"highpass",f0:2500,f1:5e3,gain:.07})}backfire(){if(this.ready)for(let t=0;t<2+Math.random()*3;t++)this.burst({t:.05+t*(.06+Math.random()*.07),dur:.05,f0:900,gain:.3})}shiftPop(){this.ready&&this.burst({dur:.06,f0:1200,gain:.12})}nitroStart(){this.ready&&(this.burst({dur:.6,type:"bandpass",f0:300,f1:2e3,q:1,gain:.35}),this.tone({f0:60,f1:120,dur:.5,gain:.25}))}nearMiss(){this.ready&&this.burst({dur:.35,type:"bandpass",f0:600,f1:2400,q:2,gain:.25})}checkpoint(){this.ready&&[0,4,7,12].forEach((t,e)=>this.tone({t:e*.06,type:"triangle",f0:ni(76+t),dur:.25,gain:.18,rev:.4}))}beep(t=!1){this.ready&&this.tone({type:"square",f0:t?1320:660,dur:t?.6:.18,gain:.12,rev:.3})}click(){this.ready&&this.tone({type:"triangle",f0:1200,f1:800,dur:.05,gain:.08})}hover(){this.ready&&this.tone({type:"sine",f0:1800,dur:.03,gain:.03})}spikes(){if(this.ready){for(let t=0;t<4;t++)this.burst({t:t*.07,dur:.1,type:"highpass",f0:1500,gain:.35});this.burst({t:.1,dur:1.2,type:"bandpass",f0:3e3,f1:600,gain:.15})}}takedown(){this.ready&&(this.crash(1.4),this.tone({type:"sine",f0:160,f1:30,dur:1.2,gain:.7}),this.burst({dur:1.5,f0:6e3,f1:200,gain:.25,rev:.8}),[0,3,7].forEach((t,e)=>this.tone({t:.15,type:"sawtooth",f0:ni(45+t),dur:1.4,gain:.08,rev:.6})))}busted(){this.ready&&([0,3,6,10].forEach(t=>this.tone({type:"sawtooth",f0:ni(40+t),dur:2.5,attack:.05,gain:.1,rev:.8})),this.tone({f0:80,f1:30,dur:2,gain:.5}))}victory(){this.ready&&([0,4,7,12,16,19,24].forEach((t,e)=>this.tone({t:e*.09,type:"square",f0:ni(64+t),dur:.4,gain:.08,rev:.5})),[0,4,7].forEach(t=>this.tone({t:.65,type:"sawtooth",f0:ni(52+t),dur:2,attack:.05,gain:.08,rev:.6})))}empCharge(t){this.ready&&this.tone({type:"sine",f0:300+t*1500,dur:.08,gain:.05})}empFire(){this.ready&&(this.tone({type:"square",f0:2e3,f1:80,dur:.6,gain:.25}),this.burst({dur:.5,type:"bandpass",f0:4e3,f1:500,q:3,gain:.3}))}radio(){this.ready&&(this.burst({dur:.18,type:"bandpass",f0:2500,q:2,gain:.12}),this.tone({type:"square",f0:1400,dur:.05,gain:.04}))}whoosh(){this.ready&&this.burst({dur:.5,type:"bandpass",f0:300,f1:1500,q:1,gain:.3})}},Tl=class{constructor(t){this.a=t,this.ctx=t.ctx,this.bpm=128,this.step=0,this.nextTime=0,this.level=0,this.targetLevel=0,this.playing=!1,this.bar=0,this.prog=[{root:45,tones:[0,3,7]},{root:41,tones:[0,4,7]},{root:48,tones:[0,4,7]},{root:43,tones:[0,4,7]}],this.progB=[{root:45,tones:[0,3,7]},{root:45,tones:[0,3,7]},{root:41,tones:[0,4,7]},{root:43,tones:[0,4,7]},{root:38,tones:[0,3,7]},{root:41,tones:[0,4,7]},{root:40,tones:[0,4,7]},{root:40,tones:[0,4,7]}],this.lead=[12,-1,10,12,-1,15,-1,12,10,-1,7,-1,10,-1,12,-1,7,-1,5,7,-1,10,-1,7,3,-1,5,-1,7,-1,-1,-1],this.out=this.ctx.createGain(),this.out.gain.value=.9,this.out.connect(t.musicBus),this.bassDist=this.ctx.createWaveShaper();let e=new Float32Array(512);for(let n=0;n<512;n++){let i=n/256-1;e[n]=Math.tanh(i*3)}this.bassDist.curve=e,this.bassBus=this.ctx.createGain(),this.bassBus.connect(this.out),this.bassDist.connect(this.bassBus)}start(){this.playing||(this.playing=!0,this.nextTime=this.ctx.currentTime+.1,this.step=0,this.bar=0,this.timer=setInterval(()=>this.schedule(),25))}stop(){this.playing=!1,clearInterval(this.timer)}setLevel(t){this.targetLevel=t}schedule(){let t=60/this.bpm/4;for(;this.nextTime<this.ctx.currentTime+.15;)this.playStep(this.step,this.nextTime,t),this.nextTime+=t,this.step++,this.step%16===0&&(this.bar++,this.level=this.targetLevel)}playStep(t,e,n){let i=t%16,r=this.level,a=r>=2?this.progB:this.prog,c=a[this.bar%a.length];if(i===0&&this.pad(e,c,n*16,r),r>=1&&(i%4===0&&this.kick(e,1),r>=2&&(i===4||i===12)&&this.snare(e,1),r>=2&&this.bar%4===3&&i>=12&&this.snare(e,.4+(i-12)*.15),r>=3&&i===0&&this.bar%4===0&&this.crash(e)),(i%2===1||r>=2)&&this.hat(e,i%4===2?.6:.3,r>=1&&i%4===2),r===0&&i%4===2&&this.hat(e,.15,!1),r===0)i===0&&this.bass(e,c.root-12,n*14,.5,r);else if(r===1)(i%4===2||i%8===0)&&this.bass(e,c.root-12+(i%8===6?12:0),n*1.6,.8,r);else{let l=[0,0,12,0,0,12,0,7,0,0,12,0,0,12,3,0][i];this.bass(e,c.root-12+l,n*.9,.85,r)}if(r>=2){let h=[0,1,2,3,2,1,0,2,1,2,3,4,3,2,1,2][i],u=c.tones[h%3]+12*Math.floor(h/3);this.arp(e,c.root+12+u,n*.9)}else if(r===1&&i%2===0){let l=c.tones[i/2%3];this.arp(e,c.root+24+l,n*.7,.5)}if(r>=3&&i%2===0){let l=(this.bar%4*8+i/2)%this.lead.length,h=this.lead[l];h>=0&&this.leadNote(e,57+h,n*2.2)}}vgain(t){let e=this.ctx.createGain();return e.gain.value=t,e}kick(t,e){let n=this.ctx,i=n.createOscillator();i.type="sine",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(42,t+.12);let r=n.createGain();r.gain.setValueAtTime(1e-4,t),r.gain.linearRampToValueAtTime(.9*e,t+.003),r.gain.exponentialRampToValueAtTime(1e-4,t+.38),i.connect(r),r.connect(this.out),i.start(t),i.stop(t+.4)}snare(t,e){let n=this.ctx,i=this.a.noiseSrc(!1),r=n.createBiquadFilter();r.type="highpass",r.frequency.value=1400;let o=n.createGain();o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(.35*e,t+.002),o.gain.exponentialRampToValueAtTime(1e-4,t+.2),i.connect(r),r.connect(o),o.connect(this.out),o.connect(this.a.revSend),i.start(t,Math.random()),i.stop(t+.25);let a=n.createOscillator();a.type="triangle",a.frequency.setValueAtTime(220,t),a.frequency.exponentialRampToValueAtTime(140,t+.1);let c=n.createGain();c.gain.setValueAtTime(.3*e,t),c.gain.exponentialRampToValueAtTime(1e-4,t+.12),a.connect(c),c.connect(this.out),a.start(t),a.stop(t+.15)}hat(t,e,n){let i=this.ctx,r=this.a.noiseSrc(!1),o=i.createBiquadFilter();o.type="highpass",o.frequency.value=7500;let a=n?.22:.045,c=i.createGain();c.gain.setValueAtTime(1e-4,t),c.gain.linearRampToValueAtTime(.13*e,t+.001),c.gain.exponentialRampToValueAtTime(1e-4,t+a),r.connect(o),o.connect(c),c.connect(this.out),r.start(t,Math.random()),r.stop(t+a+.02)}crash(t){let e=this.ctx,n=this.a.noiseSrc(!1),i=e.createBiquadFilter();i.type="highpass",i.frequency.value=4e3;let r=e.createGain();r.gain.setValueAtTime(.18,t),r.gain.exponentialRampToValueAtTime(1e-4,t+1.6),n.connect(i),i.connect(r),r.connect(this.out),r.connect(this.a.revSend),n.start(t,Math.random()),n.stop(t+1.7)}bass(t,e,n,i,r){let o=this.ctx,a=ni(e),c=o.createOscillator();c.type="sawtooth",c.frequency.value=a;let l=o.createOscillator();l.type="square",l.frequency.value=a/2;let h=o.createBiquadFilter();h.type="lowpass",h.Q.value=6;let u=r>=2?1600:900;h.frequency.setValueAtTime(120,t),h.frequency.linearRampToValueAtTime(u,t+.01),h.frequency.exponentialRampToValueAtTime(180,t+Math.max(.08,n));let f=o.createGain();f.gain.setValueAtTime(1e-4,t),f.gain.linearRampToValueAtTime(.28*i,t+.005),f.gain.setValueAtTime(.28*i,t+n*.8),f.gain.exponentialRampToValueAtTime(1e-4,t+n);let d=this.vgain(.5);c.connect(h),l.connect(d),d.connect(h),h.connect(f),f.connect(r>=3?this.bassDist:this.bassBus),c.start(t),l.start(t),c.stop(t+n+.02),l.stop(t+n+.02)}arp(t,e,n,i=1){let r=this.ctx,o=r.createOscillator();o.type="square",o.frequency.value=ni(e);let a=r.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(3200,t),a.frequency.exponentialRampToValueAtTime(700,t+n);let c=r.createGain();c.gain.setValueAtTime(1e-4,t),c.gain.linearRampToValueAtTime(.05*i,t+.004),c.gain.exponentialRampToValueAtTime(1e-4,t+n),o.connect(a),a.connect(c),c.connect(this.out),c.connect(this.a.delaySend),o.start(t),o.stop(t+n+.02)}leadNote(t,e,n){let i=this.ctx,r=ni(e),o=i.createGain();o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(.06,t+.02),o.gain.setValueAtTime(.05,t+n*.7),o.gain.exponentialRampToValueAtTime(1e-4,t+n);let a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=2800;let c=i.createOscillator();c.frequency.value=5.5;let l=i.createGain();l.gain.value=r*.01,c.connect(l);for(let h of[0,7,-7]){let u=i.createOscillator();u.type="sawtooth",u.frequency.value=r,u.detune.value=h,l.connect(u.frequency),u.connect(a),u.start(t),u.stop(t+n+.02)}a.connect(o),o.connect(this.out),o.connect(this.a.delaySend),o.connect(this.a.revSend),c.start(t),c.stop(t+n+.02)}pad(t,e,n,i){let r=this.ctx,o=r.createGain(),a=i>=2?.035:.05;o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(a,t+.5),o.gain.setValueAtTime(a,t+n-.3),o.gain.linearRampToValueAtTime(1e-4,t+n+.4);let c=r.createBiquadFilter();c.type="lowpass",c.frequency.value=i>=2?1400:900,c.Q.value=1,c.connect(o),o.connect(this.out),o.connect(this.a.revSend);for(let l of e.tones)for(let h of[-8,8]){let u=r.createOscillator();u.type="sawtooth",u.frequency.value=ni(e.root+12+l),u.detune.value=h,u.connect(c),u.start(t),u.stop(t+n+.5)}}};var va=class{constructor(t,e,n,i,r=!1){this.max=e,this.geo=new oe,this.pos=new Float32Array(e*3),this.col=new Float32Array(e*3),this.size=new Float32Array(e),this.alpha=new Float32Array(e),this.rot=new Float32Array(e),this.geo.setAttribute("position",new Qt(this.pos,3).setUsage(yi)),this.geo.setAttribute("pcolor",new Qt(this.col,3).setUsage(yi)),this.geo.setAttribute("size",new Qt(this.size,1).setUsage(yi)),this.geo.setAttribute("alpha",new Qt(this.alpha,1).setUsage(yi)),this.geo.setAttribute("rot",new Qt(this.rot,1).setUsage(yi)),this.geo.boundingSphere=new Rn(new P,1e7),this.mat=new ve({uniforms:{map:{value:n},uScale:{value:800}},vertexShader:`attribute float size; attribute float alpha; attribute vec3 pcolor; attribute float rot;
        uniform float uScale; varying float vA; varying vec3 vC; varying float vR;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = min(size * uScale / max(-mv.z, 0.1), 900.0); vA = alpha; vC = pcolor; vR = rot; }`,fragmentShader:`uniform sampler2D map; varying float vA; varying vec3 vC; varying float vR;
        void main(){ vec2 c = gl_PointCoord - 0.5; float s = sin(vR), co = cos(vR);
          vec2 uv = vec2(c.x*co - c.y*s, c.x*s + c.y*co) + 0.5;
          vec4 t = texture2D(map, uv); float a = t.a * vA; if (a < 0.003) discard;
          gl_FragColor = vec4(vC * t.rgb, a); }`,transparent:!0,depthWrite:r,blending:i}),this.points=new Uo(this.geo,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=5,t.add(this.points),this.parts=[];for(let o=0;o<e;o++)this.parts.push({life:0,max:1,x:0,y:0,z:0,vx:0,vy:0,vz:0,s0:1,s1:1,a0:1,r:1,g:1,b:1,rot:0,vr:0,drag:1,grav:0});this.cursor=0}emit(t){let e=this.parts[this.cursor];this.cursor=(this.cursor+1)%this.max,e.life=e.max=t.life,e.x=t.x,e.y=t.y,e.z=t.z,e.vx=t.vx||0,e.vy=t.vy||0,e.vz=t.vz||0,e.s0=t.s0,e.s1=t.s1,e.a0=t.a,e.r=t.r,e.g=t.g,e.b=t.b,e.rot=Math.random()*6.28,e.vr=(Math.random()-.5)*(t.spin||1),e.drag=t.drag??1.5,e.grav=t.grav||0,e.fadeIn=t.fadeIn||0}update(t){let e=this.parts;for(let n=0;n<this.max;n++){let i=e[n];if(i.life<=0){this.alpha[n]=0,this.size[n]=0;continue}i.life-=t;let r=Math.exp(-i.drag*t);i.vx*=r,i.vy=i.vy*r-i.grav*t,i.vz*=r,i.x+=i.vx*t,i.y+=i.vy*t,i.z+=i.vz*t,i.rot+=i.vr*t;let o=1-i.life/i.max;this.pos[n*3]=i.x,this.pos[n*3+1]=i.y,this.pos[n*3+2]=i.z,this.size[n]=i.s0+(i.s1-i.s0)*o;let a=i.fadeIn?dt(o/i.fadeIn,0,1):1;this.alpha[n]=i.a0*(1-o)*(1-o)*a,this.col[n*3]=i.r,this.col[n*3+1]=i.g,this.col[n*3+2]=i.b,this.rot[n]=i.rot}for(let n of["position","pcolor","size","alpha","rot"])this.geo.attributes[n].needsUpdate=!0}},Al=class{constructor(t,e=2400){this.max=e;let n=new oe;this.pos=new Float32Array(e*4*3),this.alpha=new Float32Array(e*4);let i=new Uint32Array(e*6);for(let o=0;o<e;o++){let a=o*4;i.set([a,a+1,a+2,a+1,a+3,a+2],o*6)}n.setAttribute("position",new Qt(this.pos,3).setUsage(yi)),n.setAttribute("alpha",new Qt(this.alpha,1).setUsage(yi)),n.setIndex(new Qt(i,1)),n.boundingSphere=new Rn(new P,1e7);let r=new ve({vertexShader:"attribute float alpha; varying float vA; void main(){ vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying float vA; void main(){ gl_FragColor = vec4(0.02,0.02,0.02, vA * 0.6); }",transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,side:Oe});this.mesh=new ht(n,r),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,t.add(this.mesh),this.cursor=0,this.last=new Map}add(t,e,n,i,r,o,a){let c=this.last.get(t);if(this.last.set(t,{x:e,y:n,z:i,rx:r,rz:o,t:performance.now()}),!c||performance.now()-c.t>120||(c.x-e)**2+(c.z-i)**2>16)return;let l=this.cursor;this.cursor=(this.cursor+1)%this.max;let h=.16,u=this.pos,f=l*12;u[f]=c.x-c.rx*h,u[f+1]=c.y,u[f+2]=c.z-c.rz*h,u[f+3]=c.x+c.rx*h,u[f+4]=c.y,u[f+5]=c.z+c.rz*h,u[f+6]=e-r*h,u[f+7]=n,u[f+8]=i-o*h,u[f+9]=e+r*h,u[f+10]=n,u[f+11]=i+o*h,this.alpha.fill(a,l*4,l*4+4),this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.attributes.alpha.needsUpdate=!0}clear(){this.pos.fill(0),this.alpha.fill(0),this.mesh.geometry.attributes.position.needsUpdate=!0}},ya=class{constructor(t){this.scene=t,this.smoke=new va(t,1400,yf(),fi),this.glow=new va(t,900,pn("rgba(255,255,255,1)","rgba(255,255,255,0)",64),ke),this.skids=new Al(t),this.debris=[];let e=new It(.3,.08,.2);this.debrisMat=new At({color:2236962,metalness:.6,roughness:.4});for(let n=0;n<60;n++){let i=new ht(e,this.debrisMat);i.visible=!1,i.castShadow=!0,t.add(i),this.debris.push({m:i,life:0,v:new P,w:new P})}this.dcur=0,this.flash=new Xi(16755302,0,40,2),t.add(this.flash),this.flashT=0,this.flameTex=pn("rgba(160,200,255,1)","rgba(40,80,255,0)",64),this.empMesh=new ht(new Vi(3.2,24,16),new Me({color:new lt(.3,.8,3),transparent:!0,opacity:.25,blending:ke,depthWrite:!1,wireframe:!0})),this.empMesh.visible=!1,t.add(this.empMesh)}setScale(t){this.smoke.mat.uniforms.uScale.value=t,this.glow.mat.uniforms.uScale.value=t}tireSmoke(t,e,n,i,r,o,a=!1){let c=a?.35:.85;this.smoke.emit({x:t+(Math.random()-.5)*.4,y:e+.3,z:n+(Math.random()-.5)*.4,vx:i*.2+(Math.random()-.5)*2,vy:.8+Math.random(),vz:r*.2+(Math.random()-.5)*2,life:1.4+Math.random()*1.2,s0:1.2,s1:6+o*4,a:.22*o+.08,r:c,g:c*.98,b:c*.96,drag:1.4,fadeIn:.1})}dust(t,e,n,i,r,o){this.smoke.emit({x:t,y:e+.2,z:n,vx:i*.3+(Math.random()-.5)*2,vy:.5+Math.random(),vz:r*.3+(Math.random()-.5)*2,life:1.5+Math.random(),s0:1.5,s1:7,a:.25*o,r:.62,g:.52,b:.4,drag:1.2,fadeIn:.1})}damageSmoke(t,e,n,i){let r=i?.12:.5;this.smoke.emit({x:t,y:e,z:n,vx:Math.random()-.5,vy:2+Math.random()*2,vz:Math.random()-.5,life:2,s0:1,s1:i?8:5,a:i?.5:.25,r,g:r,b:r,drag:.6}),i&&Math.random()<.5&&this.glow.emit({x:t,y:e,z:n,vx:0,vy:2,vz:0,life:.4,s0:1.4,s1:.4,a:.9,r:3,g:1.2,b:.3,drag:1})}sparks(t,e,n,i,r,o,a=1){for(let c=0;c<o;c++){let l=(4+Math.random()*14)*a;this.glow.emit({x:t,y:e+.4+Math.random()*.4,z:n,vx:i*l+(Math.random()-.5)*10,vy:2+Math.random()*7,vz:r*l+(Math.random()-.5)*10,life:.3+Math.random()*.5,s0:.35,s1:.05,a:1,r:4,g:2.2,b:.8,drag:2,grav:18,spin:0})}}impactFlash(t,e,n,i){this.flash.position.set(t,e+1,n),this.flash.intensity=40*i,this.flashT=.15,this.glow.emit({x:t,y:e+.8,z:n,life:.14,s0:1.6*i,s1:3*i,a:.7,r:2,g:1.2,b:.7,drag:0})}debrisBurst(t,e,n,i,r,o,a){for(let c=0;c<o;c++){let l=this.debris[this.dcur];this.dcur=(this.dcur+1)%this.debris.length,l.m.visible=!0,l.m.position.set(t,e+.8,n),l.life=2.5,l.v.set(i*.5+(Math.random()-.5)*14,4+Math.random()*8,r*.5+(Math.random()-.5)*14),l.w.set(Math.random()*20,Math.random()*20,Math.random()*20);let h=.6+Math.random()*1.4;l.m.scale.set(h,h,h)}}explosion(t,e,n,i=0,r=0){this.impactFlash(t,e,n,1.5);for(let o=0;o<22;o++){let a=Math.random()*6.28,c=3+Math.random()*9;this.glow.emit({x:t,y:e+1,z:n,vx:Math.cos(a)*c+i*.3,vy:2+Math.random()*6,vz:Math.sin(a)*c+r*.3,life:.4+Math.random()*.35,s0:1.2+Math.random()*1.2,s1:.2,a:.85,r:3,g:1.1,b:.25,drag:2.5})}for(let o=0;o<14;o++)this.smoke.emit({x:t+(Math.random()-.5)*3,y:e+1,z:n+(Math.random()-.5)*3,vx:(Math.random()-.5)*5+i*.2,vy:2+Math.random()*3,vz:(Math.random()-.5)*5+r*.2,life:2.2+Math.random()*1.5,s0:1.5,s1:7,a:.5,r:.1,g:.09,b:.085,drag:1.2,fadeIn:.08});this.sparks(t,e,n,i*.03,r*.03,40,1.4),this.debrisBurst(t,e,n,i,r,12)}nitroFlame(t,e,n,i,r,o,a){this.glow.emit({x:t,y:e,z:n,vx:-i*14+o,vy:.3,vz:-r*14+a,life:.12+Math.random()*.06,s0:.9,s1:.2,a:.95,r:.8,g:1.4,b:4,drag:0}),this.glow.emit({x:t,y:e,z:n,vx:-i*6+o,vy:0,vz:-r*6+a,life:.07,s0:.5,s1:.2,a:1,r:4,g:3,b:3,drag:0})}empBurst(t,e,n){for(let i=0;i<40;i++){let r=Math.random()*6.28,o=Math.random()*3.14;this.glow.emit({x:t,y:e+1,z:n,vx:Math.cos(r)*Math.sin(o)*12,vy:Math.cos(o)*12,vz:Math.sin(r)*Math.sin(o)*12,life:.5,s0:.8,s1:.1,a:1,r:.8,g:1.8,b:5,drag:3})}}update(t){this.smoke.update(t),this.glow.update(t);for(let e of this.debris)e.life<=0||(e.life-=t,e.v.y-=22*t,e.m.position.addScaledVector(e.v,t),e.m.rotation.x+=e.w.x*t,e.m.rotation.y+=e.w.y*t,e.m.rotation.z+=e.w.z*t,e.life<=0&&(e.m.visible=!1));this.flashT>0&&(this.flashT-=t,this.flashT<=0?this.flash.intensity=0:this.flash.intensity*=.8)}carEffects(t,e,n){if(!t.visible)return;let i=Math.sin(t.yaw),r=Math.cos(t.yaw),o=-r,a=i,c=t.dims.wb,l=t.dims.W/2-.2,h=t.speed,u=Math.abs(t.vR),f=t.input.throttle>.8&&t.vF<14&&t.vF>.5&&t.grounded&&t.role==="player",d=t.grounded?dt((u-2.5)/8,0,1)+(t.input.handbrake&&h>5?.5:0)+(f?.6:0)+(t.input.brake>.7&&t.vF>18?.35:0):0;if(t.skidAmt=dt(d,0,1),d>.15&&!t.offroad){for(let g of[-1,1]){let x=t.pos.x-i*c+o*l*g,m=t.pos.z-r*c+a*l*g,p=t.pos.y-.12;this.skids.add(t.id*4+(g>0?1:0),x,p,m,o,a,dt(d,.2,1)),Math.random()<d*e*40&&this.tireSmoke(x,p,m,t.vel.x,t.vel.y,d)}if(t.input.brake>.7&&t.vF>18)for(let g of[-1,1]){let x=t.pos.x+i*c+o*l*g,m=t.pos.z+r*c+a*l*g;this.skids.add(t.id*4+2+(g>0?1:0),x,t.pos.y-.12,m,o,a,.5)}}if(t.offroad&&h>8&&t.grounded&&Math.random()<e*h*.6&&this.dust(t.pos.x-i*c,t.pos.y,t.pos.z-r*c,t.vel.x,t.vel.y,dt(h/40,.3,1)),t.nitroActive)for(let g of[-.45,.45]){let x=t.pos.x-i*(t.dims.L/2+.15)+o*g,m=t.pos.z-r*(t.dims.L/2+.15)+a*g;this.nitroFlame(x,t.pos.y+.18,m,i,r,t.vel.x,t.vel.y)}t.health<.45&&Math.random()<e*(t.wrecked?18:6)&&this.damageSmoke(t.pos.x+i*t.dims.L*.35,t.pos.y+.9,t.pos.z+r*t.dims.L*.35,t.health<.2||t.wrecked)}};function Ef(s){let t=new Map;for(let n of[...s.children]){if(!n.isMesh)continue;let i=t.get(n.material);i||t.set(n.material,i=[]),i.push(n)}let e=new Map;for(let[n,i]of t){if(i.length<2){e.set(n,i[0]);continue}let r=i.map(c=>{c.updateMatrix();let l=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();l.applyMatrix4(c.matrix);for(let h of Object.keys(l.attributes))["position","normal","uv"].includes(h)||l.deleteAttribute(h);return l.attributes.uv||l.setAttribute("uv",new jt(new Float32Array(l.attributes.position.count*2),2)),l}),o=Bs(r);i.forEach(c=>s.remove(c));let a=new ht(o,n);s.add(a),e.set(n,a)}return e}var Je={};function Cl(){return Je.ready||(Je.glass=new Mr({color:658964,metalness:.2,roughness:.05,clearcoat:1,envMapIntensity:1.6}),Je.tire=new At({color:1381653,roughness:.92}),Je.rim=new At({color:13159632,metalness:1,roughness:.22}),Je.darkRim=new At({color:2237480,metalness:.9,roughness:.3}),Je.black=new At({color:789518,roughness:.6,metalness:.3}),Je.chrome=new At({color:16777215,metalness:1,roughness:.1}),Je.head=new At({color:16777215,emissive:16774368,emissiveIntensity:3.5}),Je.glowW=pn("rgba(255,250,235,1)","rgba(255,240,220,0)",128),Je.glowR=pn("rgba(255,40,30,1)","rgba(255,0,0,0)",128),Je.glowB=pn("rgba(40,90,255,1)","rgba(0,40,255,0)",128),Je.policeTex=aa("POLICE",{bg:"rgba(0,0,0,0)",fg:"#0a0a0a",font:"bold 90px Arial Black, Arial",border:!1}),Je.interior=new At({color:1710878,roughness:.8}),Je.ready=!0),Je}var Sf={super:{L:4.55,W:1.98,roofH:1.18,belt:.86,hoodFront:.6,wsBase:.45,roofF:-.35,roofR:-1.05,rearWin:-1.85,deck:.92,tail:.86,wheelR:.36,wb:1.38,spoiler:!0,cabinW:1.5},gt:{L:4.7,W:1.96,roofH:1.28,belt:.9,hoodFront:.66,wsBase:.55,roofF:-.15,roofR:-1,rearWin:-1.95,deck:.95,tail:.9,wheelR:.37,wb:1.45,spoiler:!1,cabinW:1.52},muscle:{L:4.8,W:1.98,roofH:1.34,belt:.98,hoodFront:.82,wsBase:.3,roofF:-.35,roofR:-1.25,rearWin:-1.9,deck:1,tail:.98,wheelR:.38,wb:1.5,spoiler:!0,cabinW:1.55},sedan:{L:4.7,W:1.85,roofH:1.48,belt:.95,hoodFront:.78,wsBase:.85,roofF:.25,roofR:-1.1,rearWin:-1.7,deck:1,tail:.98,wheelR:.34,wb:1.42,spoiler:!1,cabinW:1.6},suv:{L:4.8,W:1.95,roofH:1.85,belt:1.15,hoodFront:1,wsBase:1,roofF:.5,roofR:-2.1,rearWin:-2.3,deck:1.8,tail:1.2,wheelR:.42,wb:1.5,spoiler:!1,cabinW:1.75}};function Vv(s){let t=s.L/2,e=new ki,n=.26,i=s.wheelR+.08;return e.moveTo(-t+.12,n),e.lineTo(-s.wb-i-.02,n),e.absarc(-s.wb,n+.06,i,Math.PI,0,!0),e.lineTo(s.wb-i,n),e.absarc(s.wb,n+.06,i,Math.PI,0,!0),e.lineTo(t-.1,n),e.quadraticCurveTo(t+.05,n+.05,t+.02,n+.22),e.quadraticCurveTo(t,s.hoodFront,t-.28,s.hoodFront+.02),e.quadraticCurveTo(s.wsBase+.6,s.belt+.02,s.wsBase,s.belt+.04),e.lineTo(s.rearWin,s.belt+.06),e.quadraticCurveTo(-t+.3,s.deck+.02,-t+.05,s.tail),e.quadraticCurveTo(-t-.04,(s.tail+n)/2,-t+.02,n+.12),e.lineTo(-t+.12,n),e}function Gv(s){let t=new ki;return t.moveTo(s.wsBase+.05,s.belt),t.quadraticCurveTo((s.wsBase+s.roofF)/2+.1,(s.belt+s.roofH)/2+.12,s.roofF,s.roofH),t.lineTo(s.roofR,s.roofH+.01),t.quadraticCurveTo((s.roofR+s.rearWin)/2-.1,(s.roofH+s.belt)/2+.1,s.rearWin-.05,s.belt+.04),t.lineTo(s.wsBase+.05,s.belt),t}function Rl(s,t,e=.1){let n=new Wo(s,{depth:t-e*2,bevelEnabled:!0,bevelThickness:e,bevelSize:e*.9,bevelSegments:4,curveSegments:14});return n.translate(0,0,-(t-e*2)/2),n.rotateY(-Math.PI/2),n.computeVertexNormals(),n}function Wv(s,t="plain",e=16777215){let n=new Mr({color:s,metalness:.55,roughness:.32,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.25}),i={uC2:{value:new lt(e)},uLiv:{value:{plain:0,stripe:1,police:2,taxi:3,split:4}[t]||0},uDmg:{value:0}};return n.userData.u=i,n.onBeforeCompile=r=>{Object.assign(r.uniforms,i),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLoc;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLoc = position;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vLoc; uniform vec3 uC2; uniform float uLiv; uniform float uDmg;
      float dh(vec3 p){ vec3 p3 = fract(p * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }`).replace("#include <color_fragment>",`#include <color_fragment>
      float m2 = 0.0;
      if (uLiv > 0.5 && uLiv < 1.5) { float ax = abs(vLoc.x); m2 = step(0.1, ax) * step(ax, 0.26) * step(0.7, vLoc.y); }
      else if (uLiv > 1.5 && uLiv < 2.5) { m2 = step(abs(vLoc.z - 0.1), 1.05) * step(vLoc.y, 0.84) + step(1.1, vLoc.y); m2 = clamp(m2, 0.0, 1.0); }
      else if (uLiv > 2.5 && uLiv < 3.5) { m2 = step(abs(vLoc.y - 0.62), 0.05) * step(0.9, abs(vLoc.x)); }
      else if (uLiv > 3.5) { m2 = step(vLoc.y, 0.62); }
      diffuseColor.rgb = mix(diffuseColor.rgb, uC2, m2);
      float scr = dh(floor(vLoc * 18.0));
      diffuseColor.rgb *= 1.0 - uDmg * (0.55 + 0.35 * scr);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.85, uDmg * scr);`)},n}function Xv(s,t,e){let n=Cl(),i=new Ne,r=new ht(new ze(s,s,t,18,1),n.tire);r.rotation.z=Math.PI/2,i.add(r);let o=new ht(new ze(s*.68,s*.68,t+.02,18,1),n.darkRim);o.rotation.z=Math.PI/2,i.add(o);let a=new ht(new ze(s*.2,s*.2,t+.06,8),e);a.rotation.z=Math.PI/2,i.add(a);for(let c=0;c<5;c++){let l=new ht(new It(t+.04,s*1.2,.07),e);l.rotation.x=c/5*Math.PI,i.add(l)}return Ef(i),i}function Gs(s,t,e=16777215){let n=new Bi({map:s,color:e,blending:ke,depthWrite:!1,transparent:!0,fog:!0}),i=new Ls(n);return i.scale.set(t,t,1),i}function wf(s,t={}){let e=Cl(),n=new Ne,i=new Ne;n.add(i);let r=Sf[s]||Sf.sedan,o=Wv(t.color??13373456,t.livery||"plain",t.color2??16777215),a=[];if(s==="truck"){r={L:6.6,W:2.3,wheelR:.45,wb:2.2};let R=new ht(new It(2.2,1.9,1.9),o);R.position.set(0,1.45,2.2);let S=new ht(new It(2,.7,.05),e.glass);S.position.set(0,1.95,3.16);let T=new ht(new It(2.4,2.6,4.3),new At({color:t.color2??15263976,roughness:.6}));T.position.set(0,1.85,-1);let D=new ht(new It(2,.4,6.4),e.black);D.position.set(0,.55,0),a.push(R,S,T,D),i.add(R,S,T,D)}else{let R=Rl(Vv(r),r.W,.14),S=new ht(R,o);i.add(S),a.push(S);let T=Rl(Gv(r),r.cabinW,.12),D=new ht(T,e.glass);i.add(D),a.push(D);let _=r.roofF-r.roofR,b=new ht(new It(r.cabinW-.18,.06,_*.95),o);b.geometry.translate(0,r.roofH+.08,(r.roofF+r.roofR)/2-.02),i.add(b),a.push(b);let U=new ht(new It(r.W-.1,.12,r.L-.4),e.black);U.position.y=.24,i.add(U);let L=new ht(new It(r.W*.6,.16,.08),e.black);L.position.set(0,.4,r.L/2+.02),i.add(L);for(let H of[-1,1]){let I=new ht(new It(.22,.12,.16),o);I.geometry.translate(H*(r.W/2+.06),r.belt+.1,r.wsBase-.2),i.add(I)}for(let H of[-.45,.45]){let I=new ht(new ze(.06,.06,.2,10),e.chrome);I.rotation.x=Math.PI/2,I.position.set(H,.34,-r.L/2-.02),i.add(I)}if(r.spoiler&&!t.police){let H=new ht(new It(r.W-.1,.05,.36),o);H.geometry.translate(0,r.tail+.32,-r.L/2+.3),i.add(H);for(let I of[-.55,.55]){let z=new ht(new It(.06,.32,.12),e.black);z.position.set(I,r.tail+.16,-r.L/2+.32),i.add(z)}}if(t.taxi){let H=new ht(new It(.8,.22,.35),new At({color:16768341,emissive:16763955,emissiveIntensity:1.2}));H.position.set(0,r.roofH+.22,(r.roofF+r.roofR)/2),i.add(H)}}let c=r.L/2,l=new At({color:3145728,emissive:16715792,emissiveIntensity:1.2}),h=s==="truck"?.9:r.tail-.1,u=new ht(new It(r.W*.82,.08,.05),l);u.position.set(0,h,-c-.03),i.add(u);for(let R of[-1,1]){let S=new ht(new It(.34,.12,.06),l);S.position.set(R*(r.W/2-.3),h,-c-.03),i.add(S)}let f=s==="truck"?.95:r.hoodFront-.08,d=s==="truck"?3.17:c-.2,g=[];for(let R of[-1,1]){let S=new ht(new It(.42,.09,.2),e.head);S.position.set(R*(r.W/2-.38),f,d),S.rotation.x=-.25,i.add(S);let T=Gs(e.glowW,.75,16773853);T.material.opacity=.6,T.position.set(R*(r.W/2-.38),f,d+.25),i.add(T),g.push(T);let D=Gs(e.glowR,.5);D.material.opacity=.7,D.position.set(R*(r.W/2-.3),h,-c-.15),i.add(D),g.push(D)}let x={};if(t.police){let R=(r.roofH||1.3)+.14,S=((r.roofF??0)+(r.roofR??-1))/2,T=new ht(new It(1.3,.1,.3),e.black);T.position.set(0,R,S),i.add(T);let D=new At({color:4194304,emissive:16711680,emissiveIntensity:0}),_=new At({color:64,emissive:12543,emissiveIntensity:0}),b=new ht(new It(.58,.12,.26),D);b.position.set(.32,R+.08,S),i.add(b);let U=new ht(new It(.58,.12,.26),_);U.position.set(-.32,R+.08,S),i.add(U);let L=Gs(e.glowR,5);L.position.set(.35,R+.15,S),i.add(L);let H=Gs(e.glowB,5);H.position.set(-.35,R+.15,S),i.add(H);let I=Gs(e.glowR,1.5);I.position.set(.3,.45,c+.1),i.add(I);let z=Gs(e.glowB,1.5);z.position.set(-.3,.45,c+.1),i.add(z),Object.assign(x,{rMat:D,bMat:_,rs:L,bs:H,rs2:I,bs2:z});for(let O of[-1,1]){let K=new ht(new Ve(1.6,.4),new At({map:e.policeTex,transparent:!0,roughness:.4,polygonOffset:!0,polygonOffsetFactor:-2}));K.position.set(O*(r.W/2+.005),.58,.1),K.rotation.y=O*Math.PI/2,i.add(K)}}let m=Ef(i),p=[m.get(o),m.get(e.glass)].filter(Boolean);s!=="truck"&&(a.length=0,a.push(...p));let y=[],v=t.police?e.darkRim:e.rim,M=r.W/2-.2;for(let[R,S,T]of[[1,1,!0],[-1,1,!0],[1,-1,!1],[-1,-1,!1]]){let D=new Ne;D.position.set(R*M,r.wheelR,S*r.wb);let _=Xv(r.wheelR,.3,v);D.add(_),n.add(D),y.push({pivot:D,spin:_,front:T,side:R})}return n.traverse(R=>{R.isMesh&&(R.castShadow=!0,R.receiveShadow=!1)}),{root:n,body:i,wheels:y,paint:o,tailMat:l,heads:g,siren:x,dims:{L:r.L,W:r.W,wheelR:r.wheelR,wb:r.wb,roofH:r.roofH||2.5},profile:r,parts:a}}function Tf(s){let t=Cl(),e=s.profile,n=new Ne,i=e.L/2,r=new ki;r.moveTo(i-.06,e.hoodFront-.3),r.lineTo(i-.06,e.hoodFront-.04),r.quadraticCurveTo(i-.1,e.hoodFront+.02,i-.28,e.hoodFront+.02),r.quadraticCurveTo(e.wsBase+.6,e.belt+.02,e.wsBase,e.belt+.04),r.lineTo(e.wsBase,e.belt-.3),r.lineTo(i-.06,e.hoodFront-.3);let o=new ht(Rl(r,e.W-.06,.08),s.paint);n.add(o);let a=e.wsBase-e.rearWin;for(let m of[-1,1]){let p=new ht(new It(.16,.07,a),s.paint);p.geometry.translate(m*(e.W/2-.1),e.belt+.02,(e.wsBase+e.rearWin)/2),n.add(p);let y=new ht(new It(.06,.4,a),t.interior);y.position.set(m*(e.W/2-.2),e.belt-.2,(e.wsBase+e.rearWin)/2),n.add(y)}let c=new ht(new It(e.W-.3,.16,.5),t.interior);c.position.set(0,e.belt-.04,e.wsBase-.15),n.add(c);let l=new ht(new It(.42,.09,.16),t.interior);l.position.set(.38,e.belt+.07,e.wsBase-.34),n.add(l);let h=new ht(new Ve(.38,.07),new Me({color:new lt(.15,.4,.7)}));h.position.set(.38,e.belt+.07,e.wsBase-.425),h.rotation.y=Math.PI,n.add(h);let u=new Ne,f=new ht(new Xo(.18,.024,8,32),t.interior);u.add(f);let d=new ht(new It(.34,.035,.03),t.interior);u.add(d);let g=new ht(new It(.035,.17,.03),t.interior);g.position.y=-.085,u.add(g);let x=new ht(new Ho(.022,16),new At({color:16751130,emissive:16738816,emissiveIntensity:.2}));x.position.z=-.02,x.rotation.y=Math.PI,u.add(x),u.position.set(.38,e.belt-.06,e.wsBase-.62),u.rotation.x=-.3,n.add(u);for(let m of[-1,1]){let p=Math.hypot(e.wsBase-e.roofF,e.roofH-e.belt),y=new ht(new It(.08,.06,p),t.interior);y.position.set(m*(e.cabinW/2-.06),(e.belt+e.roofH)/2,(e.wsBase+e.roofF)/2),y.rotation.x=Math.atan2(e.roofH-e.belt,e.wsBase-e.roofF),n.add(y)}return n.visible=!1,s.body.add(n),{group:n,wheel:u}}var In=[{id:"viper",name:"VIPER GT",kind:"super",top:88,accel:17.5,grip:9.5,steer:1,mass:1,armor:1,color:13111322,color2:1052688,livery:"stripe",desc:"\u30D0\u30E9\u30F3\u30B9\u578B\u30B9\u30FC\u30D1\u30FC\u30AB\u30FC"},{id:"kaiser",name:"KAISER RS",kind:"gt",top:96,accel:15.8,grip:8.6,steer:.9,mass:1.1,armor:1.1,color:15265008,color2:1591039,livery:"stripe",desc:"\u6700\u9AD8\u901F\u91CD\u8996\u306EGT\u30AF\u30FC\u30DA"},{id:"bruiser",name:"BRUISER V8",kind:"muscle",top:85,accel:19,grip:8.8,steer:.95,mass:1.45,armor:1.5,color:16742912,color2:1118481,livery:"split",desc:"\u4F53\u5F53\u305F\u308A\u6700\u5F37\u306E\u30DE\u30C3\u30B9\u30EB"}],Ma=[[2017535,1052688],[10157854,1052688],[16765952,1052688],[10494207,16777215],[16777215,16719952],[2105376,16738816]],Pl=[{kind:"sedan",colors:[6975608,2767450,9051164,14211288,3158064,4872762]},{kind:"suv",colors:[2763306,5921376,12103840,3820138]},{kind:"sedan",taxi:!0,colors:[16040960]},{kind:"truck",colors:[16777215,1723040,10492442]}],w_=new P,Af=new P,qv={},T_=new P(0,1,0),_a=class{constructor(t,e,n={}){this.game=t,this.spec=e,this.role=n.role||"traffic",this.name=n.name||e.name||"CAR";let i=this.role==="cop"||n.police;this.police=i,this.model=wf(e.kind,{color:i?723725:n.color??e.color,color2:i?15921906:n.color2??e.color2,livery:i?"police":n.livery??e.livery??"plain",police:i,taxi:n.taxi}),t.scene.add(this.model.root),this.dims=this.model.dims,this.radius=Math.min(this.dims.W/2+.05,1.15),this.circOff=this.dims.L/2-this.radius*.9,this.mass=e.mass||(e.kind==="truck"?3:e.kind==="suv"?1.5:1.1),this.pos=new P,this.vel=new tt,this.yaw=0,this.angVel=0,this.vy=0,this.grounded=!0,this.airTime=0,this.steerAngle=0,this.input={throttle:0,brake:0,steer:0,handbrake:0,nitro:0},this.nitro=.5,this.nitroActive=!1,this.health=1,this.wrecked=!1,this.wreckTime=0,this.drifting=!1,this.slip=0,this.speed=0,this.vF=0,this.vR=0,this.flatTimer=0,this.empTimer=0,this.offroad=!1,this.wheelSpin=0,this.pitch=0,this.roll=0,this.bodyPitch=0,this.bodyRoll=0,this.accelLong=0,this.accelLat=0,this.normal=new P(0,1,0),this.lastImpact=0,this.gear=1,this.rpm=.2,this.sirenPhase=Math.random()*10,this.active=!0,this.visible=!0}get fwdX(){return Math.sin(this.yaw)}get fwdZ(){return Math.cos(this.yaw)}place(t,e,n,i=0){this.pos.set(t,this.game.world.heightAt(t,e)+.17,e),this.yaw=n,this.vel.set(Math.sin(n)*i,Math.cos(n)*i),this.angVel=0,this.vy=0,this.grounded=!0,this.syncVisual(0)}addInterior(){this.interior=Tf(this.model)}setVisible(t){this.visible=t,this.model.root.visible=t}step(t){if(!this.active)return;let e=this.spec,n=this.wrecked?{throttle:0,brake:.3,steer:0,handbrake:1,nitro:0}:this.input,i=this.empTimer>0,r=Math.sin(this.yaw),o=Math.cos(this.yaw),a=-o,c=r,l=this.vel.x*r+this.vel.y*o,h=this.vel.x*a+this.vel.y*c,u=this.game.world;this.offroad=!u.hf.onRoad(this.pos.x,this.pos.z);let f=Math.abs(l);this.nitroActive=!!(n.nitro&&this.nitro>.01&&n.throttle>.1&&!i),this.nitroActive&&(this.nitro=Math.max(0,this.nitro-t*(this.role==="player"?.22:.3)));let d=e.top*(this.nitroActive?1.2:1)*(this.flatTimer>0?.55:1)*(.82+.18*this.health)*(i?.5:1);this.offroad&&(d*=.62),this.boost&&(d*=this.boost);let g=0;if(this.grounded){if(n.throttle>0)if(l<d){let U=dt(l/d,0,1);g+=e.accel*.82*(1-Math.pow(U,1.5)*.85)*n.throttle*(this.boost||1),this.nitroActive&&(g+=13)}else g-=(l-d)*.8;n.brake>0&&(l>.8?g-=34*n.brake:l>-16&&(g-=9*n.brake)),!n.throttle&&!n.brake&&(g-=Math.sign(l)*Math.min(Math.abs(l)/t,1.4+6e-4*l*l)),this.offroad&&(g-=l*.18),n.handbrake&&f>1&&(g-=Math.sign(l)*7)}let x=l;l+=g*t,this.grounded&&n.brake>0&&x>.8&&l<0&&(l=0);let m=Math.atan2(h,Math.max(Math.abs(l),1));if(n.handbrake&&f>14&&Math.abs(n.steer)>.1&&(this.drifting=!0),this.drifting&&(!n.handbrake&&Math.abs(m)<.1||f<9)&&(this.drifting=!1),this.drifting&&n.brake>.5&&!n.handbrake&&Math.abs(m)<.2&&(this.drifting=!1),this.slip=m,this.grounded){let U=e.grip*(this.offroad?.6:1)*(this.flatTimer>0?.6:1);this.drifting&&(U*=n.handbrake?.14:.3),this.wrecked&&(U=2);let L=h*Math.exp(-U*t),H=Math.abs(h-L);h=L,this.drifting&&l>0&&(l+=H*.45);let I=ae(.6,.14,dt(f/65,0,1));this.steerAngle=nn(this.steerAngle,n.steer*I,10,t);let z=30*e.steer*(this.drifting?1.75:1)*(this.offroad?.8:1),O=f/2.8*Math.tan(Math.abs(n.steer)*.6),K=Math.min(O,z/Math.max(f,1),2.4),Q=Math.sign(n.steer)*K*Math.sign(l||1);this.drifting&&(Q+=-m*.6*Math.sign(l)),this.angVel=nn(this.angVel,Q,this.drifting?5:9,t)}else this.angVel*=Math.exp(-.5*t);let p=r*l+a*h,y=o*l+c*h;this.accelLong=ae(this.accelLong,g,.1),this.accelLat=ae(this.accelLat,this.angVel*l,.1),this.vel.set(p,y),this.yaw=_i(this.yaw+this.angVel*t),this.pos.x+=p*t,this.pos.z+=y*t;let v=u.heightAt(this.pos.x,this.pos.z)+.17;if(this.vy-=22*t,this.pos.y+=this.vy*t,this.pos.y<=v){!this.grounded&&this.airTime>.35&&this.game.onLanding(this,this.airTime);let U=this.prevG!==void 0?(v-this.prevG)/t:0;this.pos.y=v,this.vy=dt(U,-30,14),this.grounded=!0,this.airTime=0}else this.pos.y>v+.25&&(this.grounded=!1,this.airTime+=t);this.prevG=v;let M=1900;Math.abs(this.pos.x)>M&&(this.pos.x=Math.sign(this.pos.x)*M,this.vel.x*=-.3),Math.abs(this.pos.z)>M&&(this.pos.z=Math.sign(this.pos.z)*M,this.vel.y*=-.3),this.collideStatic(),this.vF=this.vel.x*Math.sin(this.yaw)+this.vel.y*Math.cos(this.yaw),this.vR=this.vel.x*-Math.cos(this.yaw)+this.vel.y*Math.sin(this.yaw),this.speed=this.vel.length(),this.flatTimer>0&&(this.flatTimer-=t),this.empTimer>0&&(this.empTimer-=t),this.wheelSpin+=l/this.dims.wheelR*t;let R=[0,16,29,42,56,71,999],S=1;for(;S<6&&Math.abs(l)>R[S];)S++;S!==this.gear&&(this.shifted=S>this.gear?1:-1,this.gear=S);let T=R[S-1],D=Math.min(R[S],e.top*1.2),_=dt((Math.abs(l)-T)/(D-T),0,1),b=this.grounded?.25+_*.72:.95*(n.throttle||.4);this.rpm=nn(this.rpm,Math.max(b,n.throttle>0&&f<3?.55:.18),12,t)}collideStatic(){let t=this.game.world.statics,e=Math.sin(this.yaw),n=Math.cos(this.yaw);for(let i of[1,-1]){let r=this.pos.x+e*this.circOff*i,o=this.pos.z+n*this.circOff*i,a=t.collide(r,o,this.radius,qv);if(!a)continue;this.pos.x+=a.px,this.pos.z+=a.pz;let c=a.nx,l=a.nz,h=this.vel.x*c+this.vel.y*l;if(h<0){let u=-l,f=c,d=this.vel.x*u+this.vel.y*f,g=-h,m=-h*.25,p=d*(1-Math.min(.5,g*.012));this.vel.set(c*m+u*p,l*m+f*p);let y=e*l-n*c;this.angVel+=y*i*g*.04,g>3&&this.game.onImpact(this,null,g,r-c*this.radius,o-l*this.radius,a.tag)}}}syncVisual(t,e=0){let n=this.model,i=this.game.world;n.root.position.copy(this.pos),this.grounded&&(i.hf.normal(this.pos.x,this.pos.z,Af),this.normal.lerp(Af,t?Math.min(1,t*10):1));let r=this.normal,o=Math.sin(this.yaw),a=Math.cos(this.yaw),c=Math.asin(dt(r.x*o+r.z*a,-1,1)),l=Math.asin(dt(r.x*-a+r.z*o,-1,1));this.pitch=t?nn(this.pitch,c,10,t):c,this.roll=t?nn(this.roll,l,10,t):l,n.root.rotation.set(0,0,0),n.root.rotation.order="YXZ",n.root.rotation.y=this.yaw,n.root.rotation.x=this.pitch,n.root.rotation.z=this.roll;let h=dt(-this.accelLong*.004,-.05,.05),u=dt(this.accelLat*.006,-.08,.08);this.bodyPitch=t?nn(this.bodyPitch,h,6,t):h,this.bodyRoll=t?nn(this.bodyRoll,u,6,t):u,n.body.rotation.x=this.bodyPitch,n.body.rotation.z=this.bodyRoll;for(let d of n.wheels)d.spin.rotation.x=this.wheelSpin,d.front&&(d.pivot.rotation.y=this.steerAngle*1.2);this.interior&&(this.interior.wheel.rotation.z=-this.steerAngle*3);let f=this.input.brake>.1&&this.vF>1;if(n.tailMat.emissiveIntensity=f?6:1.4,this.police&&n.siren.rMat){let d=this.sirenOn!==!1&&!this.wrecked,x=(e+this.sirenPhase)*2.2%1,m=d&&(x<.12||x>.2&&x<.32),p=d&&(x>.5&&x<.62||x>.7&&x<.82);n.siren.rMat.emissiveIntensity=m?12:.2,n.siren.bMat.emissiveIntensity=p?14:.2,n.siren.rs.visible=m,n.siren.bs.visible=p,n.siren.rs2.visible=p,n.siren.bs2.visible=m,this.flashA=m,this.flashB=p}n.paint.userData.u.uDmg.value=dt((1-this.health)*.9,0,.9)}dispose(){this.game.scene.remove(this.model.root),this.model.root.traverse(t=>{t.isMesh&&t.geometry&&t.geometry.dispose()})}};var ba={},Rf={};function Il(s,t,e,n=2.6){let i=Math.atan2(t-s.pos.x,e-s.pos.z),r=_i(i-s.yaw);return{steer:dt(r*n,-1,1),diff:r}}function Ll(s,t){let e=s.vF;e<t-1?(s.input.throttle=dt((t-e)/6,.35,1),s.input.brake=0):e>t+4?(s.input.throttle=0,s.input.brake=dt((e-t)/12,.2,1)):(s.input.throttle=.3,s.input.brake=0)}function Dl(s,t,e=32){let n=Math.sin(s.yaw),i=Math.cos(s.yaw),r=-i,o=n,a=0,c=999;for(let l of t){if(l===s||!l.active)continue;let h=l.pos.x-s.pos.x,u=l.pos.z-s.pos.z,f=h*n+u*i;if(f<2||f>e)continue;let d=h*r+u*o;if(Math.abs(d)>4||s.vF-(l.vel.x*n+l.vel.y*i)<2&&f>10)continue;let x=(1-f/e)*(1-Math.abs(d)/4);a+=(d>=0?-1:1)*x,Math.abs(d)<2.2&&(c=Math.min(c,f))}return{push:a,block:c}}function Cf(s,t,e){let n=Pe(s,t+8,ba),i=n.dx,r=n.dz,o=999;for(let a of[25,50,80,120,170]){let c=Pe(s,t+8+a,Rf),l=Math.abs(_i(Math.atan2(c.dx,c.dz)-Math.atan2(i,r)));if(l<.03)continue;let h=a/l,u=Math.sqrt(e*h)+a*.18;o=Math.min(o,u)}return o}var Yi=class{constructor(t,e,n=1){this.car=t,this.route=e,this.skill=n,this.idx=0,this.progress=0,this.lane=(Math.random()-.5)*6,this.laneT=this.lane,this.stuck=0,this.reverseT=0,this.finished=!1}update(t,e){let n=this.car;if(n.wrecked||this.finished){n.input.throttle=0,n.input.brake=1,n.input.nitro=0;return}let i=Tr(this.route,n.pos.x,n.pos.z,this.idx,30);this.idx=i.index,this.progress=i.dist;let r=n.speed,o=10+r*.5,a=Pe(this.route,this.progress+o,ba),c=Dl(n,e.cars),l=Math.abs(n.pos.x)<640&&Math.abs(n.pos.z)<640?4.5:8.5;this.laneT=dt(this.laneT+c.push*t*14,-l,l),Math.abs(c.push)<.01&&(this.laneT=ae(this.laneT,dt(this.lane,-l,l),t*.5));let h=-a.dz,u=a.dx,f=a.x+h*this.laneT,d=a.z+u*this.laneT;if(i.off>30){let p=Pe(this.route,this.progress+8,Rf);f=p.x,d=p.z}let g=Il(n,f,d,2.4);n.input.steer=g.steer;let x=Math.min(n.spec.top,Cf(this.route,this.progress,26*n.spec.steer))*this.skill;if(e.player&&e.mode!=="cop"){let y=(e.playerProgress??this.progress)-this.progress;x*=1+dt(y/900,-.12,.14),n.boost=1+dt(y/1500,-.05,.12)}else if(e.mode==="cop"){let p=e.player.pos.distanceTo(n.pos);n.boost=p<60?1.09:1.04,p<80&&(n.nitro=Math.min(1,n.nitro+t*.06))}c.block<14&&r>10&&(x=Math.min(x,r*.9)),Math.abs(g.diff)>.6&&(x=Math.min(x,18)),Ll(n,x),n.input.handbrake=Math.abs(g.diff)>.5&&r>22?1:0,n.input.nitro=n.nitro>.2&&x>n.spec.top*.85&&Math.abs(g.diff)<.1?1:0,n.nitro=Math.min(1,n.nitro+t*.035),this.handleStuck(t,e)}handleStuck(t,e){let n=this.car;if(this.reverseT>0){this.reverseT-=t,n.input.throttle=0,n.input.brake=1,n.input.steer=-n.input.steer,n.input.handbrake=0,n.input.nitro=0;return}if(n.speed<2.5&&n.input.throttle>.2?this.stuck+=t:this.stuck=Math.max(0,this.stuck-t*2),this.stuck>1.6&&(this.reverseT=1.1,this.stuck=0,this.stuckCount=(this.stuckCount||0)+1),this.stuckCount>3&&(this.stuckCount=0,e.distToCamera(n)>60)){let i=Pe(this.route,this.progress+20,ba);n.place(i.x,i.z,Math.atan2(i.dx,i.dz),15)}}},Sa=class{constructor(t,e){this.car=t,this.target=null,this.path=null,this.pathIdx=0,this.replan=0,this.mode="pursue",this.stuck=0,this.reverseT=0,this.spikeCd=6+Math.random()*6,this.direct=!1,this.parked=!1}update(t,e){let n=this.car;if(n.wrecked){n.input.throttle=0,n.input.brake=1,n.input.nitro=0;return}if(this.patrol&&this.trafficAI){this.trafficAI.update(t,e);return}if(this.parked){n.input.throttle=0,n.input.brake=1,n.input.steer=0,n.input.handbrake=1;return}let i=this.target;if(!i||i.wrecked){n.input.throttle=0,n.input.brake=.5;return}let r=i.pos.x-n.pos.x,o=i.pos.z-n.pos.z,a=Math.hypot(r,o);if(this.dist=a,this.replan-=t,this.replan<=0&&(this.replan=.8+Math.random()*.4,this.direct=a<110&&e.world.statics.los(n.pos.x,n.pos.z,i.pos.x,i.pos.z),!this.direct)){let g=e.world.nav,x=g.nearest(n.pos.x,n.pos.z),m=g.nearest(i.pos.x+i.vel.x*1.5,i.pos.z+i.vel.y*1.5),p=x&&m?g.astar(x.id,m.id):null;if(p&&p.length>1){let y=0,v=p.map((M,R)=>{let S=g.nodes[M];if(R){let T=g.nodes[p[R-1]];y+=Math.hypot(S.x-T.x,S.z-T.z)}return{x:S.x,z:S.z,d:y}});this.path={pts:v,length:y},this.pathIdx=0}else this.path=null}let c,l,h,u=n.speed;if(this.direct||!this.path){let g=dt(a/55,0,1.3);if(c=i.pos.x+i.vel.x*g,l=i.pos.z+i.vel.y*g,a<16){let v=Math.sin(i.yaw),M=Math.cos(i.yaw),R=r*-M+o*v>0?-1:1;c=i.pos.x-v*1.5+-M*R*1.2,l=i.pos.z-M*1.5+v*R*1.2}h=i.speed+dt(a*.6,4,30);let x=Math.cos(n.yaw-i.yaw),m=Math.sin(n.yaw),p=Math.cos(n.yaw),y=r*m+o*p>0;if(x<-.4&&y&&a<90&&a>8){let v=-Math.cos(i.yaw),M=Math.sin(i.yaw),R=(n.pos.x-i.pos.x)*v+(n.pos.z-i.pos.z)*M>=0?1:-1;c=i.pos.x+v*8*R,l=i.pos.z+M*8*R,h=14}}else{let g=Tr(this.path,n.pos.x,n.pos.z,this.pathIdx,20);this.pathIdx=g.index;let x=Pe(this.path,g.dist+10+u*.45,ba);c=x.x,l=x.z,h=Math.min(n.spec.top,Cf(this.path,g.dist,26)),g.dist>this.path.length-30&&(this.replan=0)}let f=Il(n,c,l,2.6),d=Dl(n,e.traffic,26);if(n.input.steer=dt(f.steer+d.push*.5,-1,1),Math.abs(f.diff)>.7&&(h=Math.min(h,16)),h=Math.min(h,n.spec.top*1.1),Ll(n,h),n.input.handbrake=Math.abs(f.diff)>.55&&u>22?1:0,n.input.nitro=n.nitro>.2&&a>45&&Math.abs(f.diff)<.1?1:0,n.nitro=Math.min(1,n.nitro+t*.05),n.boost=a>250?1.18:a>120?1.1:a>40?1.04:1,this.spikeCd-=t,this.spikeCd<0&&e.heat>=2&&a<70&&a>20){let g=Math.sin(i.yaw),x=Math.cos(i.yaw);-r*g+-o*x>20&&i.speed>20&&(e.dropSpike(n,i),this.spikeCd=14+Math.random()*8)}if(this.reverseT>0){this.reverseT-=t,n.input.throttle=0,n.input.brake=1,n.input.steer=-f.steer,n.input.nitro=0;return}u<2.5&&n.input.throttle>.2?this.stuck+=t:this.stuck=Math.max(0,this.stuck-t*2),this.stuck>1.4&&(this.reverseT=1,this.stuck=0)}},Rr=class{constructor(t,e){this.car=t,this.game=e,this.cur=null,this.next=null,this.prev=null,this.stunned=0,this.cruise=14}spawnAt(t,e){let n=e.world.nav;this.prev=null,this.cur=t;let i=t.edges[Math.floor(Math.random()*t.edges.length)];this.next=n.nodes[i.to];let r=this.next.x-t.x,o=this.next.z-t.z,a=Math.hypot(r,o)||1,c=this.lane=this.laneFor(t),l=t.x+-o/a*c,h=t.z+r/a*c;this.car.place(l,h,Math.atan2(r,o),this.cruise*.8),this.car.health=1,this.car.wrecked=!1,this.stunned=0}laneFor(t){if(Math.abs(t.x)<=600&&Math.abs(t.z)<=600)return this.cruise=13+Math.random()*4,5;let n=t.h!==void 0&&t.h>0&&this.game.world.hf.roadDist(t.x,t.z)<0&&Math.hypot(t.x,t.z)>1e3;return this.cruise=n?24+Math.random()*5:19+Math.random()*4,n?6.5:4.8}update(t,e){let n=this.car;if(this.stunned>0){this.stunned-=t,n.input.throttle=0,n.input.brake=1,n.input.steer=0;return}if(!this.next)return;let i=e.world.nav,r=this.cur,o=this.next,a=o.x-r.x,c=o.z-r.z,l=Math.hypot(a,c)||1;a/=l,c/=l;let h=this.lane,u=o.x-c*h,f=o.z+a*h;if(Math.hypot(u-n.pos.x,f-n.pos.z)<9||(u-n.pos.x)*a+(f-n.pos.z)*c<0){let p=o.edges.filter(M=>M.to!==r.id),v=p.length?p[Math.floor(Math.random()*p.length)]:o.edges[0];if(p.length>1&&Math.random()<.65){let M=-2;for(let R of p){let S=i.nodes[R.to],T=S.x-o.x,D=S.z-o.z,_=Math.hypot(T,D)||1,b=(T*a+D*c)/_;b>M&&(M=b,v=R)}}this.prev=r,this.cur=o,this.next=i.nodes[v.to],this.lane=this.laneFor(o)}let g=Il(n,u,f,2);n.input.steer=g.steer;let x=this.cruise;Math.abs(g.diff)>.35&&(x=Math.min(x,9));let m=Dl(n,e.carsNear(n,30),22);m.block<20&&(x=Math.min(x,Math.max(0,(m.block-7)*1.2))),Ll(n,x),n.input.handbrake=0,n.input.nitro=0}};var Cr={name:"INTERCEPTOR",kind:"gt",top:91,accel:17,grip:9.6,steer:1,mass:1.25,armor:1},Ul={name:"PURSUIT SPEC",kind:"super",top:94,accel:18,grip:10,steer:1.05,mass:1.15,armor:.9},Nl={name:"HEAVY SUV",kind:"suv",top:84,accel:15,grip:9,steer:.9,mass:2,armor:1.8},Pf=["KAZE","NOVA","VIPERA","GHOST","RAVEN","ZERO"],Yv=["north","north east","east","south east","south","south west","west","north west"],B_=new P,Ea=class{constructor(t){Object.assign(this,t),this.cars=[],this.traffic=[],this.cops=[],this.racers=[],this.spikes=[],this.roadblocks=[],this.player=null,this.state="idle",this.time=0,this.timeScale=1,this.slowmo=0,this.idc=1,this.acc=0,this.heat=0,this.gates=this.makeGate(),this.copLights=[new Xi(16711680,0,30,2),new Xi(13311,0,30,2)],this.copLights.forEach(e=>this.scene.add(e)),this.headlight=new Yo(16773856,0,90,.5,.6,1.5),this.scene.add(this.headlight),this.scene.add(this.headlight.target),this.radioCd=0}addCar(t,e){let n=new _a(this,t,e);return n.id=this.idc++,this.cars.push(n),n}removeCar(t){t.dispose(),this.cars=this.cars.filter(e=>e!==t),this.cops=this.cops.filter(e=>e!==t),this.traffic=this.traffic.filter(e=>e!==t)}distToCamera(t){return this.camera.position.distanceTo(t.pos)}carsNear(t,e){return this.cars.filter(n=>n!==t&&Math.abs(n.pos.x-t.pos.x)<e&&Math.abs(n.pos.z-t.pos.z)<e)}notify(t,e="",n="#ffb400",i=!1){this.hud.notify(t,e,n,i)}radio(t){if(!(!this.settings.voice||this.radioCd>0)){this.radioCd=5,this.audio.radio(),this.hud.radio(t);try{if(!window.speechSynthesis)return;let e=new SpeechSynthesisUtterance(t);e.lang="en-US",e.rate=1.12,e.pitch=.85,e.volume=.55*this.settings.master;let n=speechSynthesis.getVoices().find(i=>/en-US/.test(i.lang)&&/Male|David|Alex|Daniel|Fred/i.test(i.name))||speechSynthesis.getVoices().find(i=>/en/.test(i.lang));n&&(e.voice=n),speechSynthesis.cancel(),speechSynthesis.speak(e)}catch{}}}headingWord(t){let e=Math.atan2(t.vel.x,-t.vel.y),n=Math.round((e+Math.PI*2)%(Math.PI*2)/(Math.PI/4))%8;return Yv[n]}areaName(t){let e=t.pos;return Math.abs(e.x)<640&&Math.abs(e.z)<640?"downtown":Math.hypot(e.x,e.z)>1100?e.x>1e3?"the coast highway":"the highway":"the hills"}makeGate(){let t=new Ne,e=new Me({color:new lt(1.5,.9,.2),transparent:!0,opacity:.35,blending:ke,depthWrite:!1,side:Oe}),n=new At({color:1118481,emissive:16751136,emissiveIntensity:3}),i=new ht(new It(.6,7,.6),n);i.position.set(-12,3.5,0);let r=i.clone();r.position.x=12;let o=new ht(new It(24.6,.6,.6),n);o.position.y=7;let a=new ht(new ze(3,3,400,16,1,!0),e);a.position.y=200;let c=pn("rgba(255,180,60,1)","rgba(255,120,0,0)",128),l=new Ls(new Bi({map:c,blending:ke,depthWrite:!1,color:16777215}));l.scale.set(14,14,1),l.position.y=7;let h=new ht(new Ve(24,7),new Me({color:new lt(1,.5,.1),transparent:!0,opacity:.12,blending:ke,depthWrite:!1,side:Oe}));return h.position.y=3.5,t.add(i,r,o,a,l,h),t.visible=!1,this.scene.add(t),this.gateMats={pylonMat:n,beamMat:e},t}clear(){for(let t of[...this.cars])t.dispose();this.cars=[],this.traffic=[],this.cops=[],this.racers=[];for(let t of this.spikes)this.scene.remove(t.mesh);this.spikes=[],this.roadblocks=[],this.player=null,this.gates.visible=!1,this.vfx.skids.clear(),this.rig.endCine(),this.timeScale=1,this.slowmo=0,this.copLights.forEach(t=>t.intensity=0),this.headlight.intensity=0}raceRoute(){if(this._route)return this._route;let t=this.world.nav,e=(r,o)=>t.cityId(r,o),n=r=>t.loopId(r*Math.PI/180),i=[e(0,360),e(0,-600),n(-115),n(-135),n(-160),n(180),n(155),n(130),n(108),e(0,600),e(360,600),e(360,240),e(120,240),e(120,-120),e(-240,-120),e(-240,120)];return this._route=pf(t,i),this._route}start(t,e){this.clear(),this.mode=t,this.carIdx=e,this.time=0,this.raceTime=0,this.heat=0,this.bounty=0,this.takedowns=0,this.maxSpeed=0,this.bust=0,this.finished=[],this.pursuit=!1,this.pursuitTime=0,this.lastSeen=0,this.cooldown=0,this.roadblockCd=30,this.nearMiss=new Map,this.driftT=0,this.escapes=0,this.checkIdx=0,this.result=null,this.copSpawnCd=0,this.trafficCd=0,this.patrolSpawned=!1,this.bustedRacers=0,this.escapedRacers=0,this.empState={lock:0,target:null,cd:0},this.spikeCd=0,this.playerFinished=!1,this.playerPlace=0,this.plIdx=0,this.playerProgress=0,this.lastHeat=void 0,this.drown=0,this.position=0,this.standings=[],this.wrongWay=!1,this.drafting=!1,this.sirenGlow=null,this.lastHitWith=null;let n=In[e],i=t==="free"?null:this.raceRoute();this.route=i;let r=t==="cop";if(this.demo=t==="demo",this.demo)return this.startDemo();let o=this.addCar(r?{...n,armor:n.armor*1.3}:n,{role:"player",police:r,name:"YOU"});o.addInterior(),this.player=o,o.nitro=r?1:.6;let a={};if(i){this.checkpoints=[];let c=9;for(let h=1;h<=c;h++)this.checkpoints.push((i.length-60)*(h/c)+30);this.finishDist=this.checkpoints[c-1];let l=(h,u,f)=>{let d=Pe(i,u,a);h.place(d.x+-d.dz*f,d.z+d.dx*f,Math.atan2(d.dx,d.dz),0)};if(t==="race"){let h=[[34,-3.5],[34,3.5],[22,-3.5],[22,3.5]],u=3,f=0;h.forEach((d,g)=>{if(g===u){l(o,d[0],d[1]);return}let x=In[(e+1+f)%3],m=Ma[f%Ma.length],p=this.addCar({...x,top:x.top*(.985+f*.012)},{role:"racer",color:m[0],color2:m[1],livery:"stripe",name:Pf[f]});l(p,d[0],d[1]),p.ai=new Yi(p,i,.97+f*.02),p.ai.lane=d[1],p.nitro=.5,this.racers.push(p),f++}),this.racers.push(o)}else{for(let h=0;h<4;h++){let u=In[h%3],f=Ma[h],d=this.addCar({...u,top:u.top*(.99+h*.008),armor:u.armor*1},{role:"racer",color:f[0],color2:f[1],livery:"stripe",name:Pf[h]});l(d,95+Math.floor(h/2)*12,h%2?3.5:-3.5),d.ai=new Yi(d,i,.99+h*.012),d.ai.lane=h%2?3.5:-3.5,d.nitro=.6,this.racers.push(d)}l(o,40,0);for(let h=0;h<2;h++){let u=this.spawnCop(null,h?Ul:Cr);l(u,26-h*12,h?4:-4),u.ai.target=this.racers[h]}}}else o.place(0,0,Math.PI,0),this.heat=1;this.spawnInitialTraffic(),this.rig.setMode(this.settings.camMode||0),this.rig.snap=!0,this.state="countdown",this.countdown=3.99,this.lastCount=4,this.audio.music&&this.audio.music.setLevel(1),this.hud.setMode(t,this),this.updateGate()}startDemo(){let t=this.raceRoute();this.route=null,this.demoRoute=t;let e=this.addCar(In[Math.floor(Math.random()*3)],{role:"player",name:"DEMO"});this.player=e;let n={},i=200+Math.random()*(t.length-1500),r=Pe(t,i,n);e.place(r.x,r.z,Math.atan2(r.dx,r.dz),30),e.ai=new Yi(e,t,.95),e.ai.idx=r.index,e.ai.lane=0,e.nitro=1;for(let c=0;c<2;c++){let l=Pe(t,i-30-c*25,{}),h=this.spawnCop({x:l.x+(c?3:-3)*-l.dz,z:l.z+(c?3:-3)*l.dx,yaw:Math.atan2(l.dx,l.dz),speed:28});h.ai.target=e}let o=this.addCar({...In[1]},{role:"racer",color:2017535,color2:1052688,livery:"stripe",name:"NOVA"}),a=Pe(t,i+20,{});o.place(a.x+3*-a.dz,a.z+3*a.dx,Math.atan2(a.dx,a.dz),30),o.ai=new Yi(o,t,.97),o.ai.idx=a.index,o.ai.lane=3,this.racers=[o,e],this.spawnInitialTraffic(),this.state="playing",this.pursuit=!0,this.heat=2,this.demoStart=i}spawnCop(t,e=Cr){let n=this.addCar(e,{role:"cop"});return n.ai=new Sa(n,this),n.health=1,this.cops.push(n),t&&n.place(t.x,t.z,t.yaw||0,t.speed||0),n}spawnInitialTraffic(){let t=this.world.nav,e=this.settings.quality===0?18:30;for(let n=0;n<e;n++){let i=Pl[Math.floor(Math.random()*Pl.length)],r={kind:i.kind,top:34,accel:8,grip:8,steer:.8,mass:i.kind==="truck"?3:i.kind==="suv"?1.6:1.1,armor:1},o=this.addCar(r,{role:"traffic",color:i.colors[Math.floor(Math.random()*i.colors.length)],color2:15658734,taxi:i.taxi,livery:i.taxi?"taxi":"plain"});o.ai=new Rr(o,this),this.traffic.push(o),this.respawnTraffic(o,!0)}}respawnTraffic(t,e=!1){let n=this.world.nav,i=this.player,r=new P;this.camera.getWorldDirection(r);for(let o=0;o<30;o++){let a=n.nodes[Math.floor(Math.random()*n.nodes.length)],c=a.x-i.pos.x,l=a.z-i.pos.z,h=Math.hypot(c,l);if(!(e?h<40||h>700:h<260||h>650)&&!(!e&&(c*r.x+l*r.z)/h>.5&&h<400)&&!this.cars.some(u=>u!==t&&(u.pos.x-a.x)**2+(u.pos.z-a.z)**2<400)){t.ai.spawnAt(a,this);return}}}spawnPursuitCop(){let t=this.world.nav,e=this.player;if(this.route&&Math.random()<.6){let r=(this.playerProgress||0)+320+Math.random()*260;if(r<this.route.length-80){let o=Pe(this.route,r,{}),c=!(Math.abs(o.x)<640&&Math.abs(o.z)<640)&&Math.random()<.35,l=(c?-1:1)*(3+Math.random()*3),h=o.x+-o.dz*l,u=o.z+o.dx*l;if(!this.cars.some(f=>(f.pos.x-h)**2+(f.pos.z-u)**2<100)){let f=this.heat>=4&&Math.random()<.3,d=this.spawnCop(null,f?Nl:Math.random()<.5?Cr:Ul);return d.place(h,u,Math.atan2(o.dx,o.dz)+(c?Math.PI:0),c?18:32),d.ai.target=this.pickTarget(d),d}}}let n=Math.sin(e.yaw),i=Math.cos(e.yaw);for(let r=0;r<40;r++){let o=t.nodes[Math.floor(Math.random()*t.nodes.length)],a=o.x-e.pos.x,c=o.z-e.pos.z,l=Math.hypot(a,c);if(l<220||l>480)continue;let h=(a*n+c*i)/l;if(Math.random()<.6&&h>.2||this.cars.some(x=>(x.pos.x-o.x)**2+(x.pos.z-o.z)**2<100))continue;let u=this.heat>=4&&Math.random()<.3,f=this.spawnCop(null,u?Nl:Math.random()<.5?Cr:Ul),d=o.edges[0],g=t.nodes[d.to];return f.place(o.x,o.z,Math.atan2(e.pos.x-o.x,e.pos.z-o.z),20),f.ai.target=this.pickTarget(f),f}return null}pickTarget(t){if(this.mode==="free"||!this.racers.length)return this.player;let e=null,n=1e9;for(let i of this.racers){if(i.wrecked||i.ai&&i.ai.finished||i===this.player&&this.playerFinished)continue;let r=i.pos.distanceTo(t.pos);i===this.player&&(r*=.45),r<n&&(n=r,e=i)}return e}spawnRoadblock(){let t=this.player,e=this.world.nav,n,i,r,o;if(this.route){let f=Pe(this.route,this.playerProgress+520,{});if(this.playerProgress+520>this.route.length-50)return;n=f.x,i=f.z,r=f.dx,o=f.dz}else{let f=t.vel.x/(t.speed||1),d=t.vel.y/(t.speed||1),g=e.nearest(t.pos.x+f*420,t.pos.z+d*420);if(!g)return;let x=null,m=-2;for(let p of g.edges){let y=e.nodes[p.to],v=y.x-g.x,M=y.z-g.z,R=Math.hypot(v,M),S=(v*f+M*d)/R;S>m&&(m=S,x={ex:v/R,ez:M/R})}if(!x)return;n=g.x,i=g.z,r=x.ex,o=x.ez}if(Math.hypot(n-t.pos.x,i-t.pos.z)<250)return;let a=-o,c=r,h=(this.world.hf.roadDist(n,i)<-11?13:10)>12?[-9.5,-3.5,6]:[-6.5,3],u={cars:[],x:n,z:i};if(h.forEach((f,d)=>{let g=this.spawnCop(null,d===1&&this.heat>=4?Nl:Cr),x=Math.atan2(r,o)+Math.PI/2+(d%2?.35:-.35);g.place(n+a*f,i+c*f,x,0),g.ai.parked=!0,g.ai.target=this.player,u.cars.push(g)}),this.heat>=4){let f={pos:new P(n-r*25+a*1,0,i-o*25+c*1),yaw:Math.atan2(r,o)+Math.PI};this.dropSpike(f,null,!0)}this.roadblocks.push(u),this.notify("ROADBLOCK AHEAD","\u524D\u65B9\u306B\u691C\u554F\uFF01\u9699\u9593\u3092\u629C\u3051\u308D","#ff4040"),this.radio("Roadblock is set up ahead. All units hold position.")}dropSpike(t,e,n=!1){let i=Math.sin(t.yaw),r=Math.cos(t.yaw),o=t.pos.x-i*7,a=t.pos.z-r*7,c=new Ne,l=new ht(new It(8,.06,.45),new At({color:1381653,roughness:.6}));c.add(l);let h=new xi(.06,.22,4),u=new Re(h,new At({color:14540253,metalness:1,roughness:.2}),40),f=new Kt;for(let x=0;x<40;x++)f.makeTranslation(-3.9+x%20*.41,.12,x<20?-.12:.12),u.setMatrixAt(x,f);c.add(u);let d=new ht(new It(8.2,.03,.12),new At({color:0,emissive:16752640,emissiveIntensity:2}));d.position.y=.05,c.add(d);let g=this.world.heightAt(o,a)+.18;c.position.set(o,g,a),c.rotation.y=t.yaw,this.scene.add(c),this.spikes.push({mesh:c,x:o,z:a,yaw:t.yaw,t:25,hit:new Set}),!n&&e===this.player&&(this.notify("SPIKE STRIP","\u30B9\u30D1\u30A4\u30AF\u30B9\u30C8\u30EA\u30C3\u30D7\u8A2D\u7F6E\uFF01","#ff4040"),this.radio("Spike strip deployed!"))}onLanding(t,e){t===this.player&&(this.audio.landing(dt(e,.3,1)),this.rig.addShake(.5),e>.6&&(this.notify("AIR TIME",`${e.toFixed(1)}s`,"#40d0ff"),t.nitro=Math.min(1,t.nitro+.1),this.bounty+=500))}onImpact(t,e,n,i,r,o){let a=this.player;if(t.pos.distanceTo(this.camera.position)<120){this.vfx.sparks(i,t.pos.y,r,t.pos.x-i,t.pos.z-r,Math.min(30,n*1.2),.7),n>10&&this.vfx.impactFlash(i,t.pos.y,r,dt(n/40,.3,1));let l=t.pos.distanceTo(a.pos),h=dt(1-l/120,0,1);h>0&&this.audio.crash(dt(n/35,.1,1.2)*h)}if(t===a&&(this.rig.addShake(dt(n/25,.1,1)),this.hud.flashDamage(dt(n/30,.2,1))),!e){let l=Math.max(0,n-7)*.006/(t.spec.armor||1)*(t.role==="traffic"?0:1)*(t.role==="cop"?1.2:t.role==="racer"?.5:1);this.damage(t,l,null)}}damage(t,e,n){if(t.wrecked||e<=0||this.demo||this.state!=="playing")return;let i=t===this.player?.3:.6;(!t.dmgWin||this.time-t.dmgWin.t>.4)&&(t.dmgWin={t:this.time,sum:0}),e=Math.min(e,i-t.dmgWin.sum),!(e<=0)&&(t.dmgWin.sum+=e,t.health-=e,t.health<=0&&(t.health=0,this.wreck(t,n)))}wreck(t,e){t.wrecked=!0,t.wreckTime=this.time,t.angVel+=(Math.random()-.5)*6,t.vy=5+Math.random()*3,t.grounded=!1,t.sirenOn=!1,this.vfx.explosion(t.pos.x,t.pos.y,t.pos.z,t.vel.x,t.vel.y);let n=this.player,i=e===n;if(t.pos.distanceTo(n.pos)<200&&this.audio.takedown(),t===n){this.endGame(this.mode==="cop"?"wrecked_cop":"wrecked");return}t.role==="cop"?i&&(this.takedowns++,this.bounty+=2500,n.nitro=Math.min(1,n.nitro+.35),this.notify("TAKEDOWN!","\u30D1\u30C8\u30AB\u30FC\u6483\u7834  +2500","#ff3060",!0),this.radio(["Unit down! Unit down!","We lost a unit!","Officer down, requesting backup!"][Math.floor(Math.random()*3)]),this.takedownCam(t)):t.role==="racer"&&(this.mode==="cop"?(this.bustedRacers++,i&&(this.takedowns++,n.nitro=Math.min(1,n.nitro+.4),this.takedownCam(t)),this.notify("BUSTED!",`${t.name} \u3092\u6458\u767A (${this.bustedRacers}/4)`,"#3aa0ff",!0),this.radio("Suspect is down. Nice work.")):(this.notify("RACER WRECKED",`${t.name} \u304C\u30EA\u30BF\u30A4\u30A2`,"#ffb400"),i&&(this.takedowns++,n.nitro=Math.min(1,n.nitro+.3),this.takedownCam(t))))}takedownCam(t){if(!this.settings.cinematic){this.slowmo=.5;return}this.slowmo=1.3;let e=this.player,n={x:Math.sin(e.yaw),z:Math.cos(e.yaw)};this.rig.startCine({type:"side",target:()=>t.pos,dir:n,dur:1.3})}carCollisions(){let t=this.cars,e=t.length;for(let n=0;n<e;n++){let i=t[n];if(i.active)for(let r=n+1;r<e;r++){let o=t[r];if(!o.active)continue;let a=o.pos.x-i.pos.x,c=o.pos.z-i.pos.z;if(Math.abs(a)>9||Math.abs(c)>9||Math.abs(o.pos.y-i.pos.y)>2.5)continue;let l=Math.sin(i.yaw),h=Math.cos(i.yaw),u=Math.sin(o.yaw),f=Math.cos(o.yaw),d=!1,g=0,x=null,m=0,p=0;for(let y of[1,-1])for(let v of[1,-1]){let M=i.pos.x+l*i.circOff*y,R=i.pos.z+h*i.circOff*y,S=o.pos.x+u*o.circOff*v,T=o.pos.z+f*o.circOff*v,D=S-M,_=T-R,b=Math.hypot(D,_),U=i.radius+o.radius;if(b>=U||b<1e-4)continue;D/=b,_/=b;let L=U-b,H=1/i.mass,I=1/o.mass,z=H+I;i.pos.x-=D*L*(H/z),i.pos.z-=_*L*(H/z),o.pos.x+=D*L*(I/z),o.pos.z+=_*L*(I/z);let O=(o.vel.x-i.vel.x)*D+(o.vel.y-i.vel.y)*_;if(O<0){let K=-1.3*O/z;i.vel.x-=D*K*H,i.vel.y-=_*K*H,o.vel.x+=D*K*I,o.vel.y+=_*K*I;let Q=-_,Z=D,Y=((o.vel.x-i.vel.x)*Q+(o.vel.y-i.vel.y)*Z)*.15;i.vel.x+=Q*Y*H/z,i.vel.y+=Z*Y*H/z,o.vel.x-=Q*Y*I/z,o.vel.y-=Z*Y*I/z,i.angVel+=(l*_-h*D)*y*-O*.03*H,o.angVel+=(u*-_-f*-D)*v*-O*.03*I,-O>g&&(g=-O,x={x:D,z:_},m=(M+S)/2,p=(R+T)/2),d=!0}}d&&g>2.5&&this.onCarHit(i,o,g,x,m,p)}}}onCarHit(t,e,n,i,r,o){let a=this.player,c=t.vel.x*i.x+t.vel.y*i.z,l=-(e.vel.x*i.x+e.vel.y*i.z),h=c>=l?t:e,u=h===t?e:t,f=t===a||e===a;if(f||t.pos.distanceTo(this.camera.position)<100){this.vfx.sparks(r,(t.pos.y+e.pos.y)/2,o,-i.x,-i.z,Math.min(40,n*1.5),.8),n>12&&this.vfx.impactFlash(r,t.pos.y,o,dt(n/40,.3,1)),n>18&&this.vfx.debrisBurst(r,t.pos.y,o,h.vel.x,h.vel.y,3);let g=dt(1-t.pos.distanceTo(a.pos)/120,0,1);this.audio.crash(dt(n/30,.15,1.3)*g)}if(f){this.rig.addShake(dt(n/20,.15,1.1));let g=t===a?e:t;this.lastHitWith=g,this.lastHitT=this.time,u===a&&this.hud.flashDamage(dt(n/25,.2,1))}for(let g of[t,e])g.role==="traffic"&&n>6&&(g.ai.stunned=2+Math.random()*2);let d=(g,x)=>{let m=n*.016*(x.mass/g.mass)/(g.spec.armor||1);return g.role==="traffic"?0:x.role==="traffic"?m*.25:g.role==="cop"&&x.role==="cop"?0:g===a&&this.mode!=="cop"?m*(x.role==="cop"?.4:.3):g.role==="cop"&&x===a||g.role==="racer"&&x===a&&this.mode==="cop"?m*1.7:g.role==="racer"&&x.role==="cop"?m*(this.mode==="cop"?.45:.4):g.role==="cop"&&x.role==="racer"?m*.9:g.role==="racer"&&x.role==="racer"?m*.3:m*.5};n>4&&(this.damage(u,d(u,h),h),this.damage(h,d(h,u)*.35,u))}update(t){let e=this.input;this.slowmo>0?(this.slowmo-=t,this.timeScale=ae(this.timeScale,.22,.2),this.slowmo<=0&&this.rig.endCine()):this.timeScale=ae(this.timeScale,1,.12);let n=t*this.timeScale,i=this.player;if(i){if(this.radioCd-=t,this.state==="countdown"){this.countdown-=t;let r=Math.ceil(this.countdown);r!==this.lastCount&&r>=1&&(this.lastCount=r,this.hud.countdown(r),this.audio.beep(!1)),this.countdown<=0&&(this.state="playing",this.hud.countdown("GO!"),this.audio.beep(!0),this.mode==="free"?this.radio("All units, be advised. Street racers reported downtown."):this.mode==="cop"&&this.radio("All units, racers are on the move. Take them down!"));let o=e.drive(t);i.rpm=ae(i.rpm,o.throttle?.9:.22,.1),i.input.throttle=o.throttle;for(let a of this.cars)a.syncVisual(t,this.time);this.updateTraffic(t,!0),this.physics(t*1e-4)}if(this.state==="playing"||this.state==="ending"){if(this.time+=n,this.state==="playing"&&(this.raceTime+=n),!this.demo)if(this.state==="playing"&&!i.wrecked){let r=e.drive(t);Object.assign(i.input,r),i.nitroActive===!1&&r.nitro&&i.nitro>.05&&!this._nitroWas&&(this.audio.nitroStart(),this.rig.addShake(.3)),this._nitroWas=r.nitro&&i.nitro>.05,e.hit("KeyR","PadBack")&&this.resetPlayer(),this.mode==="cop"&&this.copAbilities(n)}else i.input.throttle=0,i.input.brake=.6,i.input.nitro=0;for(let r of this.cars)r.ai&&(r!==i||this.demo)&&r.ai.update(n,this);this.physics(n),this.demo?this.demoRules(n):this.rules(n),this.updateTraffic(n),this.updateSpikes(n);for(let r of this.cars)r.syncVisual(n,this.time),this.vfx.carEffects(r,n,this.world)}this.updateLights(),this.maxSpeed=Math.max(this.maxSpeed,i.speed),this.updateAudio(t)}}physics(t){this.acc+=t;let e=1/120,n=0;for(;this.acc>=e&&n<10;){for(let i of this.cars)i.step(e);this.carCollisions(),this.acc-=e,n++}n>=10&&(this.acc=0)}resetPlayer(){let t=this.player;if(this.route){let e=Pe(this.route,Math.max(0,this.playerProgress-10),{});t.place(e.x,e.z,Math.atan2(e.dx,e.dz),0)}else{let e=this.world.nav.nearest(t.pos.x,t.pos.z),n=this.world.nav.nodes[e.edges[0].to];t.place(e.x,e.z,Math.atan2(n.x-e.x,n.z-e.z),0)}this.rig.snap=!0,this.notify("RESET","\u30EA\u30BB\u30C3\u30C8","#aaaaaa")}copAbilities(t){let e=this.player,n=this.input,i=this.empState;this.spikeCd=Math.max(0,this.spikeCd-t),i.cd=Math.max(0,i.cd-t),n.hit("KeyQ","PadLB")&&this.spikeCd<=0&&(this.dropSpike(e,null,!0),this.spikeCd=12,this.audio.spikes(),this.notify("SPIKE STRIP","\u5F8C\u65B9\u306B\u30B9\u30D1\u30A4\u30AF\u8A2D\u7F6E","#3aa0ff"));let r=n.k("KeyE","PadRB");if(r&&i.cd<=0){let o=null,a=1e9,c=Math.sin(e.yaw),l=Math.cos(e.yaw);for(let h of this.racers){if(h.wrecked||h.ai?.finished)continue;let u=h.pos.x-e.pos.x,f=h.pos.z-e.pos.z,d=Math.hypot(u,f);d>130||d<5||(u*c+f*l)/d<.9||d<a&&(a=d,o=h)}if(o&&o===i.target?(i.lock+=t,this.audio.empCharge(i.lock/2)):(i.target=o,i.lock=0),i.target&&i.lock>=2){let h=i.target;this.vfx.empBurst(h.pos.x,h.pos.y,h.pos.z),this.audio.empFire(),h.empTimer=2.5,this.damage(h,.3,e),this.notify("EMP HIT!",`${h.name} \u306BEMP\u547D\u4E2D`,"#40a0ff"),i.cd=14,i.lock=0,i.target=null}}else i.lock=Math.max(0,i.lock-t*2),r||(i.target=null);this.vfx.empMesh.visible=!!(i.target&&i.lock>0),i.target&&i.lock>0&&(this.vfx.empMesh.position.copy(i.target.pos).y+=1,this.vfx.empMesh.rotation.y+=t*3,this.vfx.empMesh.scale.setScalar(1.6-i.lock*.3)),e.nitro=Math.min(1,e.nitro+t*.03)}rules(t){let e=this.player;if(this.route){let n=Tr(this.route,e.pos.x,e.pos.z,this.plIdx||0,40);n.off<120&&(this.plIdx=n.index,this.playerProgress=n.dist),this.playerOff=n.off;let i=Pe(this.route,this.playerProgress,{});this.wrongWay=e.speed>8&&(e.vel.x*i.dx+e.vel.y*i.dz)/e.speed<-.5,this.state==="playing"&&this.checkIdx<this.checkpoints.length&&this.playerProgress>=this.checkpoints[this.checkIdx]&&(this.checkIdx++,this.checkIdx>=this.checkpoints.length?this.mode==="race"?this.finishRace():this.audio.checkpoint():(this.audio.checkpoint(),this.notify("CHECKPOINT",`${this.checkIdx}/${this.checkpoints.length-1}   ${ii(this.raceTime)}`,"#ffb400"),this.mode==="race"&&(e.nitro=Math.min(1,e.nitro+.1))),this.updateGate());for(let o of this.racers)o===e||!o.ai||o.ai.finished||o.wrecked||o.ai.progress>=this.finishDist&&(o.ai.finished=!0,this.finished.push(o),this.mode==="cop"&&(this.escapedRacers++,this.notify("RACER ESCAPED",`${o.name} \u304C\u9003\u8D70\u306B\u6210\u529F`,"#ff6040")));let r=this.racers.filter(o=>o!==e||!0).map(o=>({r:o,p:o===e?this.playerFinished?1e9-this.playerPlace:this.playerProgress:o.ai.finished?1e9-this.finished.indexOf(o):o.wrecked?-1:o.ai.progress}));r.sort((o,a)=>a.p-o.p),this.standings=r.map(o=>o.r),this.position=this.standings.indexOf(e)+1,this.mode==="cop"&&this.racers.filter(a=>!a.wrecked&&!a.ai.finished).length===0&&this.state==="playing"&&this.endGame("cop_done")}if(this.mode!=="cop")this.pursuitRules(t);else{for(let n of this.cops)(!n.ai.target||n.ai.target.wrecked||n.ai.target.ai?.finished||Math.random()<t*.1)&&(n.ai.target=this.pickCopModeTarget(n));if(this.raceTime>45&&this.cops.filter(n=>!n.wrecked).length<3&&this.copSpawnCd<=0){this.copSpawnCd=25;let n=this.standings.find(i=>i!==e&&!i.wrecked&&!i.ai.finished);if(n){let i=Pe(this.route,n.ai.progress+350,{}),r=this.spawnCop({x:i.x,z:i.z,yaw:Math.atan2(-i.dx,-i.dz),speed:0});r.ai.target=n,this.radio("Unit in position ahead of the lead racer.")}}this.copSpawnCd-=t}this.mode!=="cop"&&this.styleRules(t),e.pos.y<Mi+.2&&(this.drown=(this.drown||0)+t,this.drown>1&&(this.drown=0,this.resetPlayer(),e.health-=.1));for(let n of[...this.cars])n.wrecked&&n!==e&&n.role!=="racer"&&this.time-n.wreckTime>8&&this.distToCamera(n)>40&&this.removeCar(n);for(let n of this.roadblocks)for(let i of n.cars){if(!i.ai.parked)continue;let r=i.pos.distanceTo(e.pos),o=Math.sin(e.yaw),a=Math.cos(e.yaw),c=(i.pos.x-e.pos.x)*o+(i.pos.z-e.pos.z)*a<-10;r<30&&c&&(i.ai.parked=!1),i.speed>3&&(i.ai.parked=!1)}this.roadblocks=this.roadblocks.filter(n=>{let i=n.cars.every(r=>!this.cars.includes(r)||r.pos.distanceTo(e.pos)>700);return i&&n.cars.forEach(r=>this.cars.includes(r)&&this.removeCar(r)),!i})}demoRules(t){let e=this.player;for(let n of this.cars)n.health=Math.max(n.health,.8);(e.ai.progress>this.demoRoute.length-200||e.speed<1&&this.time>5&&Math.random()<t*.2)&&this.start("demo");for(let n of this.cops)if(n.pos.distanceTo(e.pos)>400){let i=Pe(this.demoRoute,e.ai.progress-60,{});n.place(i.x,i.z,Math.atan2(i.dx,i.dz),e.speed)}}pickCopModeTarget(t){let e=null,n=1e9;for(let i of this.racers){if(i.wrecked||i.ai.finished)continue;let r=i.pos.distanceTo(t.pos);r<n&&(n=r,e=i)}return e}pursuitRules(t){let e=this.player,n=this.cops.filter(r=>!r.wrecked);if(this.mode==="race")this.pursuit=this.raceTime>8,this.heat=this.pursuit?dt(1+Math.floor(this.raceTime/32),1,5):0;else{let r=!1;for(let o of n){if(o.ai.parked)continue;let a=o.pos.distanceTo(e.pos);if(a<70||a<230&&this.world.statics.los(o.pos.x,o.pos.z,e.pos.x,e.pos.z)){r=!0;break}}if(this.pursuit){if(this.pursuitTime+=t,r?this.lastSeen=0:this.lastSeen+=t,this.heat=dt(Math.max(this.heat,1+Math.floor(this.pursuitTime/40)+Math.floor(this.takedowns/3)),1,5),this.bounty+=t*(10+this.heat*15)*(e.speed>30?2:1),this.lastSeen>14&&!n.some(o=>!o.ai.retire&&!o.ai.parked&&o.pos.distanceTo(e.pos)<160)){this.pursuit=!1,this.escapes++;let o=3e3*this.heat;this.bounty+=o,this.notify("ESCAPED!",`\u9003\u8D70\u6210\u529F  +${o}`,"#30ff90",!0),this.audio.victory(),this.radio("We lost the suspect. All units return to patrol.");for(let a of[...this.cops])a.pos.distanceTo(e.pos)>100,a.sirenOn=!1,a.ai.target=null,a.ai.retire=!0;this.cooldown=20,this.heat=Math.max(1,this.heat-1)}}else{if(this.cooldown-=t,this.cooldown<-28&&this.raceTime>10){this.pursuit=!0,this.lastSeen=-20,this.pursuitTime=0,this.cooldown=0;for(let a of n)a.ai.patrol&&(a.ai.patrol=!1,a.sirenOn=!0,a.ai.target=e);this.notify("PURSUIT!","\u901A\u5831\u306B\u3088\u308A\u8FFD\u8DE1\u958B\u59CB","#ff3050",!0),this.radio(`Dispatch, we have a report of a street racer near ${this.areaName(e)}. All units respond.`)}let o=n.filter(a=>a.ai.patrol);if(this.cooldown<=0&&o.length<2&&this.raceTime>3){let a=this.spawnPursuitCop();if(a){a.ai.patrol=!0,a.sirenOn=!1,a.ai.target=null,a.ai.trafficAI=new Rr(a,this);let c=this.world.nav.nearest(a.pos.x,a.pos.z);a.ai.trafficAI.spawnAt(c,this),a.ai.trafficAI.cruise=16}}for(let a of o){let c=a.pos.distanceTo(e.pos);if((c<40||c<120&&this.world.statics.los(a.pos.x,a.pos.z,e.pos.x,e.pos.z))&&(e.speed>22||c<25)){this.pursuit=!0,this.lastSeen=0,this.pursuitTime=0;for(let h of o)h.ai.patrol=!1,h.sirenOn=!0,h.ai.target=e;this.notify("PURSUIT!","\u8FFD\u8DE1\u958B\u59CB\uFF01\u9003\u3052\u5207\u308C","#ff3050",!0),this.radio(`Suspect spotted heading ${this.headingWord(e)} through ${this.areaName(e)}. In pursuit!`);break}}}for(let o of[...this.cops])o.ai.retire&&o.pos.distanceTo(e.pos)>160&&this.distToCamera(o)>120&&this.removeCar(o)}if(this.copSpawnCd-=t,this.pursuit){let r=[0,2,3,4,5,6][this.heat]+(this.mode==="race",0);if(n.filter(a=>!a.ai.parked&&!a.ai.retire).length<r&&this.copSpawnCd<=0){let a=this.spawnPursuitCop();this.copSpawnCd=4,a&&Math.random()<.4&&this.radio(`Unit responding. Suspect heading ${this.headingWord(e)}.`)}this.heat!==this.lastHeat&&(this.lastHeat!==void 0&&this.heat>this.lastHeat&&(this.notify(`HEAT LEVEL ${this.heat}`,["","","\u5FDC\u63F4\u30D1\u30C8\u30AB\u30FC\u63A5\u8FD1","\u30ED\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF\u5C55\u958B\u958B\u59CB","\u91CD\u88C5\u7532SUV\u51FA\u52D5","\u5168\u8ECA\u4E21\u51FA\u52D5"][this.heat],"#ff4040"),this.radio(["","","Requesting backup!","Setting up roadblocks!","Sending in the heavies!","All units, maximum pursuit authorized!"][this.heat])),this.lastHeat=this.heat),this.roadblockCd-=t,this.heat>=3&&this.roadblockCd<=0&&(this.roadblockCd=40-this.heat*4,this.spawnRoadblock());for(let a of n)a.ai.patrol||a.ai.retire||(!a.ai.target||a.ai.target.wrecked||a.ai.target.ai?.finished||Math.random()<t*.15)&&(a.ai.target=this.pickTarget(a))}let i=!1;for(let r of n)!r.ai.patrol&&r.pos.distanceTo(e.pos)<11&&(i=!0);this.state==="playing"&&i&&e.speed<6&&this.pursuit?this.bust+=t/3.2:this.bust=Math.max(0,this.bust-t*.6),this.bust>=1&&this.state==="playing"&&this.endGame("busted");for(let r of[...this.cops])r.wrecked||r.ai.parked||r.ai.patrol||r.pos.distanceTo(e.pos)>(this.route?650:900)&&this.distToCamera(r)>250&&this.removeCar(r)}styleRules(t){let e=this.player,n=Math.sin(e.yaw),i=Math.cos(e.yaw),r=-i,o=n;for(let a of this.cars){if(a===e||a.wrecked)continue;let c=a.pos.x-e.pos.x,l=a.pos.z-e.pos.z;if(Math.abs(c)>14||Math.abs(l)>14){this.nearMiss.delete(a.id);continue}let h=c*n+l*i,u=Math.abs(c*r+l*o),f=this.nearMiss.get(a.id),d=Math.hypot(e.vel.x-a.vel.x,e.vel.y-a.vel.y);f!==void 0&&f>0&&h<=0&&u<3.6&&d>20&&!(this.lastHitWith===a&&this.time-this.lastHitT<1.5)&&(this.audio.nearMiss(),e.nitro=Math.min(1,e.nitro+.08),this.bounty+=250,this.notify("NEAR MISS","+250","#40d0ff")),this.nearMiss.set(a.id,h)}if(e.drifting&&e.speed>15?(this.driftT+=t,e.nitro=Math.min(1,e.nitro+t*.09),this.bounty+=t*120):this.driftT>0&&(this.driftT>1.2&&this.notify("DRIFT",`${this.driftT.toFixed(1)}s  +${Math.round(this.driftT*120)}`,"#ffd040"),this.driftT=0),this.drafting=!1,e.speed>28)for(let a of this.cars){if(a===e)continue;let c=a.pos.x-e.pos.x,l=a.pos.z-e.pos.z,h=c*n+l*i,u=Math.abs(c*r+l*o);if(h>5&&h<20&&u<1.8){this.drafting=!0,e.nitro=Math.min(1,e.nitro+t*.07);break}}e.grounded||(e.nitro=Math.min(1,e.nitro+t*.1)),e.speed>55&&(this.bounty+=t*40)}updateSpikes(t){for(let e of this.spikes){e.t-=t;let n=Math.sin(e.yaw),i=Math.cos(e.yaw),r=-i,o=n;for(let a of this.cars){if(a.role==="cop"||a.role==="traffic"||e.hit.has(a.id))continue;let c=a.pos.x-e.x,l=a.pos.z-e.z;if(Math.abs(c)>8||Math.abs(l)>8)continue;let h=c*n+l*i,u=c*r+l*o;Math.abs(h)<1.6&&Math.abs(u)<4.4&&(e.hit.add(a.id),a.flatTimer=9,this.damage(a,.22,null),this.vfx.sparks(a.pos.x,a.pos.y,a.pos.z,0,0,30,1),a===this.player?(this.audio.spikes(),this.notify("SPIKED!","\u30BF\u30A4\u30E4\u304C\u30D1\u30F3\u30AF\uFF01","#ff3030"),this.rig.addShake(.6),this.hud.flashDamage(.6)):a.pos.distanceTo(this.player.pos)<150&&(this.audio.spikes(),this.mode==="cop"&&this.notify("SPIKED!",`${a.name} \u304C\u30B9\u30D1\u30A4\u30AF\u3092\u8E0F\u3093\u3060`,"#3aa0ff")))}}this.spikes=this.spikes.filter(e=>e.t<=0?(this.scene.remove(e.mesh),!1):!0)}updateTraffic(t,e=!1){if(e||(this.trafficCd-=t,this.trafficCd>0))return;this.trafficCd=.4;let n=this.player;for(let i of this.traffic){let r=i.pos.distanceTo(n.pos),o=i.speed<.5&&!i.ai.stunned;i.stuckT=o?(i.stuckT||0)+.4:0,(r>700||i.stuckT>12)&&this.distToCamera(i)>150&&(this.respawnTraffic(i),i.stuckT=0)}}updateGate(){if(!this.route||this.checkIdx>=this.checkpoints.length){this.gates.visible=!1;return}let t=this.checkpoints[this.checkIdx],e=Pe(this.route,t,{}),n=this.checkIdx===this.checkpoints.length-1;this.gates.visible=!0,this.gates.position.set(e.x,this.world.heightAt(e.x,e.z),e.z),this.gates.rotation.y=Math.atan2(e.dx,e.dz);let i=this.world.hf.onRoad(e.x,e.z)&&Math.abs(e.x)<640&&Math.abs(e.z)<640?.85:1.05;this.gates.scale.set(i,1,1),this.gateMats.pylonMat.emissive.set(n?3211104:this.mode==="cop"?3178751:16751136),this.gateMats.beamMat.color.set(n?new lt(.3,1.5,.5):this.mode==="cop"?new lt(.3,.7,1.8):new lt(1.5,.9,.2)),this.gatePos=e}finishRace(){let t=this.player;this.playerFinished=!0,this.finished.push(t),this.playerPlace=this.finished.indexOf(t)+1,this.endGame("finish")}endGame(t){if(this.state==="ending"||this.state==="result")return;this.state="ending";let e=this.player;this.result={reason:t,time:this.raceTime,place:this.playerPlace||this.position,takedowns:this.takedowns,bounty:Math.round(this.bounty),maxSpeed:this.maxSpeed*3.6,busted:this.bustedRacers,escaped:this.escapedRacers,escapes:this.escapes,heat:this.heat},t==="busted"?(this.audio.busted(),this.notify("BUSTED","\u902E\u6355\u3055\u308C\u305F\u2026","#ff3050",!0),this.radio("Suspect is in custody. Good work everyone.")):t==="wrecked"||t==="wrecked_cop"?(this.audio.busted(),this.notify("WRECKED","\u8ECA\u4E21\u5927\u7834","#ff3050",!0)):t==="finish"?(this.audio.victory(),this.notify(this.playerPlace===1?"VICTORY!":`FINISH  ${this.playerPlace}\u4F4D`,ii(this.raceTime),"#30ff90",!0)):t==="cop_done"&&(this.audio.victory(),this.notify("EVENT COMPLETE",`\u6458\u767A ${this.bustedRacers}/4`,"#3aa0ff",!0)),this.rig.startCine({type:"orbit",target:()=>e.pos,r:8,h:2.2,speed:.3,a0:e.yaw+Math.PI*.8}),this.audio.music&&this.audio.music.setLevel(0),setTimeout(()=>{this.state="result",this.onResult&&this.onResult(this.result)},3200)}updateLights(){let t=this.player,e=this.cops.filter(u=>!u.wrecked&&u.sirenOn!==!1).sort((u,f)=>u.pos.distanceToSquared(this.camera.position)-f.pos.distanceToSquared(this.camera.position)),n=t.police?t:e[0],i=this.copLights,r=n===t,o=r&&(this.rig.mode==="cockpit"||this.rig.mode==="hood")&&!this.rig.cine;if(n&&!o&&n.pos.distanceTo(this.camera.position)<150){i[0].position.set(n.pos.x,n.pos.y+(r?3:2),n.pos.z),i[1].position.copy(i[0].position);let u=r?.45:1;i[0].intensity=n.flashA?40*u:0,i[1].intensity=n.flashB?55*u:0}else i[0].intensity=i[1].intensity=0;let a=Math.sin(t.yaw),c=Math.cos(t.yaw);this.headlight.intensity=60,this.headlight.position.set(t.pos.x+a*2.2,t.pos.y+.8,t.pos.z+c*2.2),this.headlight.target.position.set(t.pos.x+a*30,t.pos.y-1,t.pos.z+c*30);let l=0,h=0;for(let u of e.slice(0,1)){let f=u.pos.distanceTo(t.pos);l=dt(1-f/25,0,1),h=u.flashA?1:u.flashB?-1:0}this.sirenGlow={r:h>0?1:0,b:h<0?1:0,a:l}}updateAudio(t){let e=this.player,n=this.audio;if(!n.ready)return;let i=[],r=this.cops.filter(c=>!c.wrecked&&c.sirenOn!==!1);e.police&&r.unshift(e),r.sort((c,l)=>c.pos.distanceToSquared(e.pos)-l.pos.distanceToSquared(e.pos));let o=new P;this.camera.getWorldDirection(o);for(let c of r.slice(0,2)){let l=c.pos.x-e.pos.x,h=c.pos.z-e.pos.z,u=Math.hypot(l,h)||1,f=c===e?.55:dt(1-u/420,0,1)**1.6,d=((c.vel.x-e.vel.x)*l+(c.vel.y-e.vel.y)*h)/u,g=(l*-o.z+h*o.x)/u;i.push({gain:f,vrel:c===e?0:d,pan:c===e?0:-g,mode:c.id%2===0&&u<60?1:0})}let a=!this.demo&&(this.state==="playing"||this.state==="countdown"||this.state==="ending");if(n.update(t,{active:a,rpm:e.rpm,throttle:e.input.throttle,speed:e.speed,skid:e.skidAmt||0,offroad:e.offroad&&e.grounded,nitro:e.nitroActive,shifted:e.shifted,sirens:i}),e.shifted=0,n.music&&this.state==="playing"){let c=1;this.mode==="cop"?c=2+(this.raceTime>60?1:0):this.pursuit&&(c=this.heat>=3?3:2),n.music.setLevel(c)}}};function ii(s){let t=Math.floor(s/60),e=s-t*60;return`${t}:${e<10?"0":""}${e.toFixed(2)}`}var Wt=s=>document.getElementById(s),Ln=new P,wa=class{constructor(){this.root=Wt("hud"),this.speedo=Wt("speedo").getContext("2d"),this.mini=Wt("minimap").getContext("2d"),this.notifyBox=Wt("notify"),this.markers=Wt("markers"),this.markerPool=[],this.dmgFlash=0,this.radioBox=Wt("radio")}show(t){this.root.classList.toggle("hidden",!t)}setMode(t,e){this.mode=t,Wt("hud-mode").textContent={race:"HOT PURSUIT RACE",cop:"INTERCEPTOR",free:"FREE RUN"}[t],Wt("abilities").classList.toggle("hidden",t!=="cop"),Wt("pos-box").classList.toggle("hidden",t!=="race"),Wt("bounty-box").classList.toggle("hidden",t!=="free"),Wt("busted-box").classList.toggle("hidden",t!=="cop"),Wt("heat").classList.toggle("hidden",t==="cop"),this.notifyBox.innerHTML=""}notify(t,e,n,i){let r=document.createElement("div");for(r.className="note"+(i?" big":""),r.style.setProperty("--c",n),r.innerHTML=`<div class="nt">${t}</div>${e?`<div class="ns">${e}</div>`:""}`,this.notifyBox.appendChild(r);this.notifyBox.children.length>4;)this.notifyBox.removeChild(this.notifyBox.firstChild);setTimeout(()=>r.classList.add("out"),i?2600:1700),setTimeout(()=>r.remove(),i?3200:2300)}radio(t){let e=this.radioBox;e.innerHTML=`<span class="rtag">POLICE RADIO</span> ${t}`,e.classList.remove("hidden"),e.classList.remove("rfade"),e.offsetWidth,e.classList.add("rfade")}countdown(t){let e=Wt("countdown");e.textContent=t,e.classList.remove("pop"),e.offsetWidth,e.classList.add("pop"),t==="GO!"&&setTimeout(()=>e.textContent="",900)}flashDamage(t){this.dmgFlash=Math.max(this.dmgFlash,t)}camLabel(t){let e=Wt("camlabel");e.textContent="\u8996\u70B9: "+t,e.classList.remove("rfade"),e.offsetWidth,e.classList.add("rfade")}update(t,e,n,i,r){let o=e.player;if(!o)return;this.dmgFlash=Math.max(0,this.dmgFlash-t*1.5);let a=Math.round(o.speed*3.6);this.drawSpeedo(a,o.rpm,o.gear,o.nitro,o.health,o.nitroActive,o.vF<-.5),Wt("hud-time").textContent=ii(e.raceTime||0),e.mode==="race"?(Wt("pos-num").textContent=e.position||"-",Wt("cp").textContent=`CP ${Math.min(e.checkIdx,e.checkpoints.length-1)}/${e.checkpoints.length-1}`,Wt("dist").textContent=`\u6B8B\u308A ${Math.max(0,(e.finishDist-e.playerProgress)/1e3).toFixed(1)} km`):e.mode==="cop"?(Wt("busted-num").textContent=`${e.bustedRacers}/4`,Wt("cp").textContent=`\u9003\u8D70 ${e.escapedRacers}`,Wt("dist").textContent=""):(Wt("bounty-num").textContent=Math.round(e.bounty).toLocaleString(),Wt("cp").textContent=e.pursuit?`\u8FFD\u8DE1 ${ii(e.pursuitTime)}`:e.cooldown>0?"\u30AF\u30FC\u30EB\u30C0\u30A6\u30F3\u4E2D":"\u30D1\u30C8\u30ED\u30FC\u30EB\u8B66\u6212",Wt("dist").textContent=`\u9003\u8D70\u6210\u529F ${e.escapes}\u56DE`);let c=Wt("heat");if(e.mode!=="cop"&&(c.querySelectorAll(".hb").forEach((f,d)=>f.classList.toggle("on",d<e.heat&&e.pursuit)),Wt("heat-label").textContent=e.pursuit?e.mode==="free"&&e.lastSeen>2?`\u898B\u5931\u3044\u4E2D\u2026 ${Math.max(0,14-e.lastSeen).toFixed(0)}`:"PURSUIT":e.mode==="free"?"UNDETECTED":"STANDBY",c.classList.toggle("active",e.pursuit),c.classList.toggle("evade",e.mode==="free"&&e.pursuit&&e.lastSeen>2)),Wt("bustbar").classList.toggle("hidden",e.bust<=.01),Wt("bustfill").style.width=`${Math.round(e.bust*100)}%`,Wt("wrongway").classList.toggle("hidden",!e.wrongWay),Wt("draft").classList.toggle("hidden",!e.drafting),Wt("centerdot").classList.toggle("hidden",!r.centerDot),e.mode==="cop"){let u=e.spikeCd,f=e.empState.cd;Wt("ab-spike").style.setProperty("--p",`${(1-u/12)*100}%`),Wt("ab-spike").classList.toggle("ready",u<=0),Wt("ab-emp").style.setProperty("--p",`${(1-f/14)*100}%`),Wt("ab-emp").classList.toggle("ready",f<=0),Wt("ab-emp").classList.toggle("locking",e.empState.lock>0),Wt("emp-lock").style.width=`${Math.min(100,e.empState.lock/2*100)}%`}let h=Wt("arrow");if(e.gatePos&&e.gates.visible){let u=e.gatePos.x-o.pos.x,f=e.gatePos.z-o.pos.z;n.getWorldDirection(Ln);let d=Math.atan2(Ln.x,Ln.z),g=Math.atan2(u,f)-d;h.classList.remove("hidden"),h.style.transform=`translateX(-50%) rotate(${-g}rad)`,Wt("arrow-d").textContent=`${Math.round(Math.hypot(u,f))} m`}else h.classList.add("hidden");this.drawMinimap(e,i),this.updateMarkers(e,n)}drawSpeedo(t,e,n,i,r,o,a){let c=this.speedo,l=300,h=300,u=150,f=158;c.clearRect(0,0,l,h);let d=Math.PI*.75,g=Math.PI*2.25;c.lineCap="round",c.lineWidth=16,c.strokeStyle="rgba(255,255,255,0.08)",c.beginPath(),c.arc(u,f,118,d,g),c.stroke();let x=dt(e,0,1),m=c.createLinearGradient(30,0,270,0);m.addColorStop(0,"#ffb000"),m.addColorStop(.75,"#ff5a00"),m.addColorStop(1,"#ff1030"),c.strokeStyle=m,c.shadowColor="#ff6a00",c.shadowBlur=16,c.beginPath(),c.arc(u,f,118,d,d+(g-d)*x),c.stroke(),c.shadowBlur=0,c.strokeStyle="rgba(255,255,255,0.55)",c.lineWidth=2;for(let y=0;y<=10;y++){let v=d+(g-d)*(y/10),M=100,R=y%2?94:88;c.beginPath(),c.moveTo(u+Math.cos(v)*M,f+Math.sin(v)*M),c.lineTo(u+Math.cos(v)*R,f+Math.sin(v)*R),c.stroke()}c.lineWidth=8,c.strokeStyle="rgba(80,160,255,0.15)",c.beginPath(),c.arc(u,f,78,Math.PI*.8,Math.PI*1.2),c.stroke(),c.strokeStyle=o?"#9fe0ff":"#2f8cff",c.shadowColor="#3fa0ff",c.shadowBlur=o?20:8,c.beginPath(),c.arc(u,f,78,Math.PI*1.2-Math.PI*.4*dt(i,0,1),Math.PI*1.2),c.stroke(),c.shadowBlur=0,c.strokeStyle="rgba(255,60,60,0.15)",c.beginPath(),c.arc(u,f,78,Math.PI*1.8,Math.PI*2.2),c.stroke();let p=r>.5?"#3cff8a":r>.25?"#ffc400":"#ff3030";c.strokeStyle=p,c.shadowColor=p,c.shadowBlur=8,c.beginPath(),c.arc(u,f,78,Math.PI*1.8,Math.PI*1.8+Math.PI*.4*dt(r,0,1)),c.stroke(),c.shadowBlur=0,c.fillStyle="#fff",c.textAlign="center",c.font='italic 800 78px Rajdhani, "Arial Narrow", sans-serif',c.fillText(String(t),u,f+22),c.font="700 16px Rajdhani, sans-serif",c.fillStyle="rgba(255,255,255,0.6)",c.fillText("km/h",u,f+46),c.font="italic 800 34px Rajdhani, sans-serif",c.fillStyle="#ffb000",c.fillText(a?"R":String(n),u,f+96),c.font="700 12px Rajdhani, sans-serif",c.fillStyle="#6fb8ff",c.fillText("NITRO",u-70,f+4-40),c.fillStyle=p,c.fillText("DAMAGE",u+70,f-36)}drawMinimap(t,e){let n=this.mini,i=240,r=i/2,o=t.player;n.clearRect(0,0,i,i),n.save(),n.beginPath(),n.arc(r,r,r-4,0,Math.PI*2),n.clip(),n.fillStyle="#0b0f14",n.fillRect(0,0,i,i);let a=260+dt(o.speed*3,0,220),c=(r-4)/a;n.translate(r,r),n.rotate(Math.PI+o.yaw);let l=e.minimapCanvas,h=e.minimapScale,u=(o.pos.x+Ge)*h,f=(o.pos.z+Ge)*h,d=c/h;n.globalAlpha=.95,n.drawImage(l,u-a*1.5*h,f-a*1.5*h,a*3*h,a*3*h,-a*1.5*c,-a*1.5*c,a*3*c,a*3*c),n.globalAlpha=1;let g=(v,M)=>[(v-o.pos.x)*c,(M-o.pos.z)*c];if(t.route){n.strokeStyle=t.mode==="cop"?"rgba(80,160,255,0.9)":"rgba(255,180,0,0.9)",n.lineWidth=3.5,n.lineJoin="round",n.beginPath();let v=t.route.pts,M=Math.max(0,(t.plIdx||0)-5),R=!0;for(let S=M;S<v.length;S++){let T=v[S];if(Math.abs(T.x-o.pos.x)>a*1.6||Math.abs(T.z-o.pos.z)>a*1.6){if(!R)break;continue}let[D,_]=g(T.x,T.z);R?(n.moveTo(D,_),R=!1):n.lineTo(D,_)}if(n.stroke(),t.gatePos&&t.gates.visible){let[S,T]=g(t.gatePos.x,t.gatePos.z);n.fillStyle="#ffd000",n.beginPath(),n.arc(S,T,6,0,7),n.fill()}}n.fillStyle="#ff9020";for(let v of t.spikes){let[M,R]=g(v.x,v.z);n.fillRect(M-4,R-1.5,8,3)}let x=performance.now()/250%2<1;for(let v of t.cars){if(v===o)continue;let M=v.pos.x-o.pos.x,R=v.pos.z-o.pos.z;if(Math.abs(M)>a*1.5||Math.abs(R)>a*1.5)continue;let[S,T]=g(v.pos.x,v.pos.z);if(v.role==="traffic"){n.fillStyle="rgba(200,200,200,0.5)",n.fillRect(S-2,T-2,4,4);continue}let D=Math.hypot(S,T);D>r-12&&(S*=(r-12)/D,T*=(r-12)/D),v.role==="cop"?(n.fillStyle=v.wrecked?"#555":v.ai?.patrol?"#9aa6ff":x?"#ff2a2a":"#2a5aff",n.beginPath(),n.arc(S,T,5.5,0,7),n.fill(),v.ai?.patrol&&!v.wrecked&&(n.strokeStyle="rgba(160,170,255,0.25)",n.beginPath(),n.arc(S,T,120*c,0,7),n.stroke())):v.role==="racer"&&(n.fillStyle=v.wrecked?"#555":"#"+v.model.paint.color.getHexString(),n.save(),n.translate(S,T),n.rotate(-v.yaw),n.beginPath(),n.moveTo(0,7),n.lineTo(5,-5),n.lineTo(-5,-5),n.closePath(),n.fill(),n.strokeStyle="#000",n.lineWidth=1,n.stroke(),n.restore())}n.restore(),n.fillStyle=o.police?"#4aa0ff":"#ffb000",n.beginPath(),n.moveTo(r,r-10),n.lineTo(r+7,r+7),n.lineTo(r,r+3),n.lineTo(r-7,r+7),n.closePath(),n.fill(),n.strokeStyle=t.pursuit&&t.mode!=="cop"?x?"#ff3040":"#3060ff":"rgba(255,255,255,0.35)",n.lineWidth=3,n.beginPath(),n.arc(r,r,r-3,0,Math.PI*2),n.stroke(),n.fillStyle="rgba(255,255,255,0.6)",n.font="700 12px Rajdhani, sans-serif",n.textAlign="center";let m=Math.PI+o.yaw,p=r+Math.sin(-m+Math.PI)*(r-16)*0,y=0}updateMarkers(t,e){let n=[],i=t.player;for(let c of t.cars)if(!(c===i||c.wrecked)&&(c.role==="racer"||c.role==="cop"&&t.mode!=="cop")){let l=c.pos.distanceTo(i.pos);if(l>450||l<6)continue;n.push({o:c,d:l})}n.sort((c,l)=>c.d-l.d);let r=window.innerWidth,o=window.innerHeight,a=0;for(let{o:c,d:l}of n.slice(0,8)){if(Ln.copy(c.pos),Ln.y+=2.4,Ln.project(e),Ln.z>1||Math.abs(Ln.x)>1.1||Math.abs(Ln.y)>1.1)continue;let h=this.markerPool[a];h||(h=document.createElement("div"),h.className="mk",h.innerHTML='<div class="mk-n"></div><div class="mk-h"><i></i></div><div class="mk-t"></div>',this.markers.appendChild(h),this.markerPool.push(h)),a++,h.style.display="block",h.style.transform=`translate(${(Ln.x*.5+.5)*r}px, ${(-Ln.y*.5+.5)*o}px) translate(-50%, -100%)`;let u=c.role==="cop";h.className="mk "+(u?"cop":"racer"),h.querySelector(".mk-n").textContent=u?"POLICE":c.name,h.querySelector(".mk-t").textContent=`${Math.round(l)}m`;let f=h.querySelector(".mk-h"),d=t.mode==="cop"&&!u||u&&l<120||!u&&l<150;f.style.display=d?"block":"none",f.firstChild.style.width=`${Math.round(c.health*100)}%`,h.style.opacity=dt(1.3-l/450,.35,1)}for(let c=a;c<this.markerPool.length;c++)this.markerPool[c].style.display="none"}};var Jt=s=>document.getElementById(s),Nf={camMode:0,fov:65,shake:0,speedFx:!0,centerDot:!1,cinematic:!0,voice:!0,quality:1,master:.8,music:.6,sfx:.9},ie={...Nf};try{let s=JSON.parse(localStorage.getItem("redline-settings")||"{}");ie={...Nf,...s}}catch{}var Vl=()=>{try{localStorage.setItem("redline-settings",JSON.stringify(ie))}catch{}},We=new mr({antialias:!1,powerPreference:"high-performance",stencil:!1});We.setSize(window.innerWidth,window.innerHeight);We.shadowMap.enabled=!0;We.shadowMap.type=cl;We.toneMapping=Er;We.toneMappingExposure=.62;We.outputColorSpace=Se;Jt("app").prepend(We.domElement);var Xs=new Ps,Ke=new Be(65,window.innerWidth/window.innerHeight,.1,14e3);Ke.position.set(0,80,300);var on=new ca(We,Xs),sn=new ga,$t=new xa;$t.settings=ie;var kl=new ya(Xs),$i=new wa,pe=new ma(Ke,on,ie),Dn=null,ne=null,ce="loading",Zi="race",si=0;function Gl(){let s=ie.quality,t=window.devicePixelRatio||1;if(We.setPixelRatio(s===0?Math.min(t,1)*.75:s===1?Math.min(t,1.25):Math.min(t,2)),We.shadowMap.enabled=!0,on.sunLight){let e=s===0?1024:2048;on.sunLight.shadow.mapSize.x!==e&&(on.sunLight.shadow.mapSize.set(e,e),on.sunLight.shadow.map&&(on.sunLight.shadow.map.dispose(),on.sunLight.shadow.map=null))}if(Dn){Dn.setQuality(s);let e=s===0?0:4;for(let n of[Dn.composer.renderTarget1,Dn.composer.renderTarget2])n.samples!==e&&(n.samples=e,n.dispose());zf()}}function zf(){let s=window.innerWidth,t=window.innerHeight;We.setSize(s,t),Ke.aspect=s/t,Ke.updateProjectionMatrix(),Dn&&(Dn.composer.setPixelRatio(We.getPixelRatio()),Dn.setSize(s,t))}window.addEventListener("resize",zf);async function Zv(){let s=Jt("load-bar"),t=Jt("load-text");await on.build((e,n)=>{s.style.width=`${Math.round(e*100)}%`,t.textContent=n}),Dn=new pa(We,Xs,Ke),Gl(),ne=new Ea({renderer:We,scene:Xs,camera:Ke,world:on,audio:$t,input:sn,settings:ie,rig:pe,vfx:kl,hud:$i}),ne.onResult=ny,window.__rp={game:ne,rig:pe,world:on,camera:Ke,post:Dn,input:sn,settings:ie,renderer:We,scene:Xs},ne.start("demo");for(let e=0;e<3;e++)ne.update(1/60);We.compile(Xs,Ke),s.style.width="100%",t.textContent="\u6E96\u5099\u5B8C\u4E86",await new Promise(e=>setTimeout(e,250)),Jt("loading").classList.add("hidden"),Jt("title").classList.remove("hidden"),ce="title",Ys=0,requestAnimationFrame(Ff)}var Ws=-1,Ys=0;function $v(s){Ys-=s;let t=ne.player;if(t&&(Ys<=0||pe.cine&&pe.cine.type==="side"&&pe.cine.px!==void 0&&t.pos.distanceTo(new P(pe.cine.px,pe.cine.py,pe.cine.pz))>140)){Ws=(Ws+1)%5,Ys=5.5+Math.random()*2;let e=t.vel.x/(t.speed||1),n=t.vel.y/(t.speed||1);if(Ws===0)pe.endCine(),pe.setMode(1);else if(Ws===1)pe.startCine({type:"orbit",target:()=>t.pos,r:7,h:1.3,speed:.3,a0:Math.random()*6});else if(Ws===2){let i=t.pos.x+e*70+-n*9,r=t.pos.z+n*70+e*9;pe.startCine({type:"side",target:()=>t.pos,px:i,pz:r,py:on.heightAt(i,r)+1.2})}else Ws===3?pe.startCine({type:"orbit",target:()=>t.pos,r:34,h:16,speed:.07,a0:t.yaw+Math.PI,ly:0}):(pe.endCine(),pe.setMode(0))}}var If=performance.now(),Pr=0,zl=new P,Fl=0,Bl=0,Lf=0,Df=!1;function Ff(s){requestAnimationFrame(Ff);let t=(s-If)/1e3,e=Math.min(.05,t);if(If=s,ce==="game"&&!Df&&ne.state==="playing"&&(Bl+=t,Lf++,Bl>8)){Df=!0;let u=Lf/Bl;u<38&&ie.quality>0&&(ie.quality--,Gl(),Vl(),ne.notify("\u753B\u8CEA\u3092\u81EA\u52D5\u8ABF\u6574",`\u5E73\u5747 ${Math.round(u)} FPS \u2192 \u54C1\u8CEA\u300C${["\u4F4E","\u4E2D","\u9AD8"][ie.quality]}\u300D`,"#aaaaaa"))}Pr+=e,sn.pollPad(),Jv();let n=Jt("sound-hint"),i=$t.ready&&$t.ctx.state==="suspended";n.classList.contains("hidden")===i&&n.classList.toggle("hidden",!i),(ce==="game"||ce==="result"||ce==="title"||ce==="menu")&&ne.update(e),ce==="game"&&ne.state!=="ending"&&ne.state!=="result"?pe.lookBack=sn.k("KeyV","PadDown"):pe.lookBack=!1,(ce==="title"||ce==="menu")&&ne.demo&&$v(e),ce==="garage"&&ey(e);let r=ne.player;pe.update(e,ce==="garage"?null:r,Pr),(ce==="game"||ce==="paused"||ce==="result")&&$i.update(e,ne,Ke,on,ie),r?zl.copy(r.pos):zl.copy(Ke.position),on.updateSun(zl),on.update(e,Pr),kl.update(ce==="paused"?0:e*(ne.timeScale||1)),kl.setScale(We.domElement.height/(2*Math.tan(Ke.fov*Math.PI/360)));let o=Dn.u,a=ce==="game"&&r&&!ne.demo,c=a?r.speed:0;o.uSpeed.value=ae(o.uSpeed.value,ie.speedFx&&a?dt((c-35)/55,0,1)*(pe.mode==="cockpit"||pe.mode==="hood"?.6:1):0,.1),o.uBlur.value=ie.speedFx?1:0,Fl=ae(Fl,a&&r.nitroActive?1:0,.12),o.uNitro.value=Fl;let l=a&&r.health<.25?.25+Math.sin(Pr*6)*.15:0;o.uDamage.value=a?Math.max($i.dmgFlash*.8,l):0;let h=a&&ne.sirenGlow;o.uSiren.value.set(h?h.r:0,h?h.b:0,h?h.a:0),Dn.draw(e),sn.endFrame()}function Jv(){let s=Wl();if(ce==="title"){sn.hit("Enter","Space","PadA","PadB","PadX","PadY","PadStart")&&Of();return}if(ce==="game"){if(sn.hit("KeyC","PadY")){let t=pe.cycle();ie.camMode=pe.modeIndex,Vl(),$i.camLabel(t.label)}sn.hit("Escape","KeyP","PadStart")&&ne.state!=="ending"&&Ca(!0),sn.hit("KeyM")&&(ie.music=ie.music>0?0:.6,$t.applyVolumes());return}if(s){if(s==="garage"&&(sn.hit("ArrowLeft","KeyA","NavLeft","PadLB")&&(Ra(),Lr(si-1)),sn.hit("ArrowRight","KeyD","NavRight","PadRB")&&(Ra(),Lr(si+1))),ce==="paused"&&s==="pause"&&sn.hit("KeyP","PadStart")){Ca(!1);return}Qv(s)}}var qs={},Aa=!1;function Ra(){Aa||(Aa=!0,document.body.classList.add("nav-mode"))}window.addEventListener("mousemove",s=>{Aa&&Math.abs(s.movementX)+Math.abs(s.movementY)>2&&(Aa=!1,document.body.classList.remove("nav-mode"))});function Wl(){for(let s of["settings","controls","pause","result","garage","menu","title"])if(!Jt(s).classList.contains("hidden"))return s;return null}function Hl(s){let e=[...Jt(s).querySelectorAll("button, input[type=range]")].filter(n=>n.offsetParent!==null&&!n.disabled);return s==="garage"&&(e=e.filter(n=>n.id==="btn-start"||n.id==="btn-garage-back")),e}var Kv={result:"btn-retry",garage:"btn-start",pause:"btn-resume",controls:"btn-controls-back"},Uf={settings:()=>Vf(),controls:()=>{Mn("menu"),$t.click()},pause:()=>Ca(!1),result:()=>Ir(),garage:()=>Ir()};function Qv(s){let t=Hl(s);if(!t.length)return;let e=qs[s];if(e===void 0||e>=t.length){let r=Kv[s];e=Math.max(0,r?t.findIndex(o=>o.id===r):0)}let n=t[e];for(let r of["Up","Down","Left","Right"]){let o=s==="garage"?["Nav"+r,"Arrow"+r].filter(c=>!/Left|Right/.test(c)):["Nav"+r,"Arrow"+r];if(!sn.hit(...o))continue;if(Ra(),n.type==="range"&&(r==="Left"||r==="Right")){let c=parseFloat(n.step)*(parseFloat(n.max)>1,1);n.value=Math.min(parseFloat(n.max),Math.max(parseFloat(n.min),parseFloat(n.value)+(r==="Right"?c:-c))),n.dispatchEvent(new Event("input"));continue}let a=jv(t,e,r);if(a===e&&(r==="Up"||r==="Down")){let c=Jt(s).querySelector(".panel");c&&c.scrollBy({top:r==="Down"?120:-120,behavior:"smooth"})}a!==e&&(e=a,n=t[e],$t.hover(),n.scrollIntoView({block:"nearest"}))}if(qs[s]=e,sn.hit("PadA","Enter")){if(Ra(),n.type!=="range"){n.click();let r=Hl(s);r.length&&qs[s]>=r.length&&(qs[s]=0)}}else sn.hit("PadB","Escape")&&Uf[s]&&Uf[s]();document.querySelectorAll(".pad-focus").forEach(r=>{r!==n&&r.classList.remove("pad-focus")}),Wl()===s&&n.classList.add("pad-focus")}function jv(s,t,e){let n=s[t].getBoundingClientRect(),i=n.left+n.width/2,r=n.top+n.height/2,o=t,a=1/0;if(s.forEach((c,l)=>{if(l===t)return;let h=c.getBoundingClientRect(),u=h.left+h.width/2,f=h.top+h.height/2,d=u-i,g=f-r,x,m,p=Math.max(0,Math.max(h.left,n.left)-Math.min(h.right,n.right)),y=Math.max(0,Math.max(h.top,n.top)-Math.min(h.bottom,n.bottom));if(e==="Up"?(x=-g,m=p):e==="Down"?(x=g,m=p):e==="Left"?(x=-d,m=y):(x=d,m=y),x<=4)return;let v=e==="Up"||e==="Down"?x+m*.3:x+m*3;(e==="Left"||e==="Right")&&m>0||v<a&&(a=v,o=l)}),o===t&&(e==="Up"||e==="Down")){let c=s.map((l,h)=>({j:h,y:l.getBoundingClientRect().top})).sort((l,h)=>l.y-h.y);o=e==="Down"?c[0].j:c[c.length-1].j}return o}document.addEventListener("mouseover",s=>{let t=s.target.closest&&s.target.closest("button, input[type=range]");if(!t)return;let e=Wl();if(!e)return;let n=Hl(e).indexOf(t);n>=0&&(qs[e]=n)});document.addEventListener("click",s=>{let t=s.target.closest&&s.target.closest("button");t&&t.blur()});document.addEventListener("pointerup",s=>{let t=s.target.closest&&s.target.closest("input[type=range]");t&&t.blur()});var Bf=()=>{$t.ready&&$t.ctx.state==="suspended"&&$t.ctx.resume()};window.addEventListener("pointerdown",Bf);window.addEventListener("keydown",Bf);window.addEventListener("gamepadconnected",s=>{let t=Jt("pad-badge");t.textContent="\u{1F3AE} \u30B2\u30FC\u30E0\u30D1\u30C3\u30C9\u63A5\u7D9A: \u5341\u5B57\u30AD\u30FC/\u30B9\u30C6\u30A3\u30C3\u30AF\u3067\u9078\u629E\u30FBA\u3067\u6C7A\u5B9A\u30FBB\u3067\u623B\u308B",t.classList.remove("hidden"),t.classList.remove("rfade"),t.offsetWidth,t.classList.add("rfade")});function Mn(s){for(let t of["title","menu","garage","pause","result","settings","controls"])Jt(t).classList.toggle("hidden",t!==s);s&&delete qs[s],document.querySelectorAll(".pad-focus").forEach(t=>t.classList.remove("pad-focus"))}function Of(){$t.init(),$t.settings=ie,$t.applyVolumes(),$t.music&&($t.music.start(),$t.music.setLevel(0)),$t.click(),ce="menu",Mn("menu"),ne.demo||(ne.start("demo"),Ys=0)}function Ir(){$t.click(),$i.show(!1),ce="menu",Mn("menu"),ne.start("demo"),Ys=0,$t.music&&$t.music.setLevel(0),$t.silence()}var rn=null,Ta=0;function ty(s){Zi=s,$t.click(),ce="garage",Mn("garage"),Jt("garage-mode").textContent={race:"HOT PURSUIT RACE",cop:"INTERCEPTOR",free:"FREE RUN"}[s],Jt("garage-sub").textContent={race:"\u30EC\u30FC\u30B5\u30FC\u3068\u3057\u3066\u53C2\u6226\u3002\u8FFD\u3063\u3066\u304F\u308B\u8B66\u5BDF\u3092\u632F\u308A\u5207\u308A1\u4F4D\u3067\u30B4\u30FC\u30EB\u305B\u3088\u3002",cop:"\u8B66\u5BDF\u3068\u3057\u3066\u51FA\u52D5\u3002\u9055\u6CD5\u30EC\u30FC\u30B5\u30FC4\u53F0\u3092\u5168\u54E1\u6458\u767A\u305B\u3088\u3002",free:"\u5E83\u5927\u306A\u30DE\u30C3\u30D7\u3092\u81EA\u7531\u306B\u8D70\u884C\u3002\u30D1\u30C8\u30ED\u30FC\u30EB\u306B\u898B\u3064\u304B\u3063\u305F\u3089\u9003\u3052\u5207\u308C\u3002"}[s],ne.clear(),$t.silence(),Lr(si)}function Lr(s){si=(s+In.length)%In.length,rn&&ne.removeCar(rn);let t=In[si];rn=ne.addCar(t,{role:"player",police:Zi==="cop"}),rn.place(0,180,.6,0),rn.sirenOn=!0,ne.player=null,Jt("car-name").textContent=(Zi==="cop"?"POLICE ":"")+t.name,Jt("car-desc").textContent=t.desc;let e=[["\u6700\u9AD8\u901F",t.top/96],["\u52A0\u901F",t.accel/19],["\u30CF\u30F3\u30C9\u30EA\u30F3\u30B0",t.grip*t.steer/9.5],["\u8010\u4E45\u30FB\u4F53\u5F53\u305F\u308A",t.armor*t.mass/2.2]];Jt("car-stats").innerHTML=e.map(([n,i])=>`<div class="st"><span>${n}</span><div class="sb"><i style="width:${Math.round(dt(i,.1,1)*100)}%"></i></div></div>`).join("")+`<div class="st topspeed"><span>TOP SPEED</span><b>${Math.round(t.top*3.6)} km/h</b></div>`,Jt("car-idx").textContent=`${si+1} / ${In.length}`,$t.hover()}function ey(s){if(Ta+=s*.25,rn){rn.syncVisual(s,Pr);let t=rn.pos,e=7.2;Ke.position.set(t.x+Math.sin(Ta)*e,t.y+1.5+Math.sin(Ta*.7)*.4,t.z+Math.cos(Ta)*e),Ke.lookAt(t.x,t.y+.6,t.z),Ke.fov!==50&&(Ke.fov=50,Ke.updateProjectionMatrix()),ne.headlight.intensity=60;let n=Math.sin(rn.yaw),i=Math.cos(rn.yaw);if(ne.headlight.position.set(t.x+n*2.2,t.y+.8,t.z+i*2.2),ne.headlight.target.position.set(t.x+n*30,t.y-1,t.z+i*30),rn.police){let r=ne.copLights;r[0].position.set(t.x,t.y+2,t.z),r[1].position.copy(r[0].position),r[0].intensity=rn.flashA?30:0,r[1].intensity=rn.flashB?40:0}}}function Xl(){$t.click(),rn=null,Mn(null),$i.show(!0),ce="game",ne.start(Zi,si),pe.setMode(ie.camMode||0),$i.camLabel(Vs[pe.modeIndex].label)}function Ca(s){s?(ce="paused",Mn("pause"),$t.silence(),$t.click()):(ce="game",Mn(null),$t.click())}function ny(s){if(ce!=="game")return;ce="result",Mn("result");let t={finish:s.place===1?"VICTORY":`${s.place}\u4F4D \u30D5\u30A3\u30CB\u30C3\u30B7\u30E5`,busted:"BUSTED",wrecked:"WRECKED",wrecked_cop:"WRECKED",cop_done:"EVENT COMPLETE"}[s.reason]||"RESULT",e=s.reason==="finish"||s.reason==="cop_done";Jt("res-title").textContent=t,Jt("res-title").className=e?"good":"bad";let n=[];if(Zi==="race"&&n.push(["\u9806\u4F4D",s.reason==="finish"?`${s.place} / 4`:"\u30EA\u30BF\u30A4\u30A2"],["\u30BF\u30A4\u30E0",ii(s.time)]),Zi==="cop"){n.push(["\u6458\u767A",`${s.busted} / 4`],["\u9003\u8D70\u3055\u308C\u305F\u30EC\u30FC\u30B5\u30FC",s.escaped],["\u30BF\u30A4\u30E0",ii(s.time)]);let i=s.busted>=4?"GOLD":s.busted>=3?"SILVER":s.busted>=2?"BRONZE":"-";n.push(["\u8A55\u4FA1",i])}Zi==="free"&&n.push(["\u30D0\u30A6\u30F3\u30C6\u30A3",s.bounty.toLocaleString()],["\u9003\u8D70\u6210\u529F",s.escapes],["\u8D70\u884C\u6642\u9593",ii(s.time)],["\u6700\u5927\u30D2\u30FC\u30C8",s.heat]),n.push(["\u30C6\u30A4\u30AF\u30C0\u30A6\u30F3",s.takedowns],["\u6700\u9AD8\u901F\u5EA6",`${Math.round(s.maxSpeed)} km/h`]),Jt("res-rows").innerHTML=n.map(([i,r])=>`<div class="rr"><span>${i}</span><b>${r}</b></div>`).join("")}function iy(){let s=Jt("settings-body"),t=[{k:"camMode",label:"\u521D\u671F\u8996\u70B9",type:"sel",vals:Vs.map((e,n)=>[n,e.label])},{k:"fov",label:"\u8996\u91CE\u89D2 (FOV)",type:"range",min:55,max:90,step:1},{k:"shake",label:"\u30AB\u30E1\u30E9\u63FA\u308C",type:"sel",vals:[[0,"OFF"],[1,"\u5F31"],[2,"\u5F37"]]},{k:"speedFx",label:"\u30B9\u30D4\u30FC\u30C9\u30A8\u30D5\u30A7\u30AF\u30C8 (\u30D6\u30E9\u30FC/FOV\u5909\u5316)",type:"bool"},{k:"centerDot",label:"\u9154\u3044\u6B62\u3081\u30BB\u30F3\u30BF\u30FC\u30C9\u30C3\u30C8",type:"bool"},{k:"cinematic",label:"\u30C6\u30A4\u30AF\u30C0\u30A6\u30F3\u6F14\u51FA (\u30B9\u30ED\u30FC\u30E2\u30FC\u30B7\u30E7\u30F3)",type:"bool"},{k:"voice",label:"\u8B66\u5BDF\u7121\u7DDA\u30DC\u30A4\u30B9 (\u82F1\u8A9E)",type:"bool"},{k:"quality",label:"\u30B0\u30E9\u30D5\u30A3\u30C3\u30AF\u54C1\u8CEA",type:"sel",vals:[[0,"\u4F4E"],[1,"\u4E2D"],[2,"\u9AD8"]]},{k:"master",label:"\u30DE\u30B9\u30BF\u30FC\u97F3\u91CF",type:"range",min:0,max:1,step:.05},{k:"music",label:"BGM\u97F3\u91CF",type:"range",min:0,max:1,step:.05},{k:"sfx",label:"\u52B9\u679C\u97F3\u97F3\u91CF",type:"range",min:0,max:1,step:.05}];s.innerHTML="";for(let e of t){let n=document.createElement("div");n.className="set-row";let i=document.createElement("label");i.textContent=e.label,n.appendChild(i);let r;if(e.type==="bool"){r=document.createElement("button"),r.className="tog";let o=()=>{r.textContent=ie[e.k]?"ON":"OFF",r.classList.toggle("on",!!ie[e.k])};r.onclick=()=>{ie[e.k]=!ie[e.k],o(),Ol(e.k)},o()}else if(e.type==="sel"){r=document.createElement("div"),r.className="segs";for(let[o,a]of e.vals){let c=document.createElement("button");c.textContent=a,c.classList.toggle("on",ie[e.k]===o),c.onclick=()=>{ie[e.k]=o,[...r.children].forEach(l=>l.classList.remove("on")),c.classList.add("on"),Ol(e.k)},r.appendChild(c)}}else{r=document.createElement("div"),r.className="rng";let o=document.createElement("input");o.type="range",o.min=e.min,o.max=e.max,o.step=e.step,o.value=ie[e.k];let a=document.createElement("span");a.textContent=e.max>1?ie[e.k]:Math.round(ie[e.k]*100)+"%",o.oninput=()=>{ie[e.k]=parseFloat(o.value),a.textContent=e.max>1?o.value:Math.round(o.value*100)+"%",Ol(e.k)},r.append(o,a)}n.appendChild(r),s.appendChild(n)}}function Ol(s){Vl(),$t.settings=ie,$t.applyVolumes(),s==="quality"&&Gl(),s==="camMode"&&ce!=="game"&&pe.setMode(ie.camMode),$t.click()}var kf="menu";function Hf(s){kf=s,iy(),Mn("settings"),$t.click()}function Vf(){Mn(kf),$t.click()}document.querySelectorAll("[data-mode]").forEach(s=>{s.onclick=()=>ty(s.dataset.mode),s.onmouseenter=()=>$t.hover()});document.querySelectorAll("button").forEach(s=>s.addEventListener("mouseenter",()=>$t.hover()));Jt("title").onclick=()=>Of();Jt("btn-settings").onclick=()=>Hf("menu");Jt("btn-controls").onclick=()=>{Mn("controls"),$t.click()};Jt("btn-controls-back").onclick=()=>{Mn("menu"),$t.click()};Jt("btn-settings-back").onclick=()=>Vf();Jt("car-prev").onclick=()=>Lr(si-1);Jt("car-next").onclick=()=>Lr(si+1);Jt("btn-start").onclick=()=>Xl();Jt("btn-garage-back").onclick=()=>Ir();Jt("btn-resume").onclick=()=>Ca(!1);Jt("btn-restart").onclick=()=>Xl();Jt("btn-pause-settings").onclick=()=>Hf("pause");Jt("btn-quit").onclick=()=>Ir();Jt("btn-retry").onclick=()=>Xl();Jt("btn-res-menu").onclick=()=>Ir();Zv().catch(s=>{console.error(s),Jt("load-text").textContent="\u30A8\u30E9\u30FC: "+s.message});})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
