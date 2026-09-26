// Ported crop geometry from Headsizer 2.0 v0.4; see SOURCE.md.
// The old two-state XMP writer is deliberately replaced by validation-xmp.mjs.
import {buildCropRect} from './legacy-crop.mjs';
export function calibrationFromText(text) {
  const out={};
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i=line.indexOf('='); if (i<0) continue;
    const key=line.slice(0,i).trim(), value=line.slice(i+1).trim();
    out[key]=key==='name'?value:Number(value);
  }
  const gap=1-out.bottomGapPx/out.aspectHeight-out.topGapPx/out.aspectHeight;
  if (!(gap>0.01 && out.aspectWidth>0 && out.aspectHeight>0)) throw Error('Invalid calibration');
  return out;
}
export function bounds(points) {
  const x=points.map(p=>p.x), y=points.map(p=>p.y);
  const left=Math.min(...x),right=Math.max(...x),top=Math.min(...y),bottom=Math.max(...y);
  return {left,right,top,bottom,width:right-left,height:bottom-top,centerX:(left+right)/2,centerY:(top+bottom)/2};
}
export function measureMesh(points, connections, w,h) {
  const pick=ids=>ids.map(i=>({x:points[i].x*w,y:points[i].y*h}));
  const indices=edges=>[...new Set(edges.flatMap(e=>[e.start,e.end]))];
  const a=bounds(pick(indices(connections.left))),b=bounds(pick(indices(connections.right)));
  const [leftEye,rightEye]=[a,b].sort((p,q)=>p.centerX-q.centerX);
  const eyes=bounds(pick([...indices(connections.left),...indices(connections.right)]));
  const mouth=bounds(pick(indices(connections.lips)));
  const nose=bounds(pick([1,2,4,5,6,19,94,97,98,168,195,197,326,327]));
  const eyeMouthGap=mouth.centerY-eyes.centerY;
  if (!Number.isFinite(eyeMouthGap) || eyeMouthGap<2) throw Error('Face landmarks do not form an upright face');
  return {leftEye,rightEye,eyes,mouth,nose,eyeMouthGap,eyeLineDeg:Math.atan2(rightEye.centerY-leftEye.centerY,rightEye.centerX-leftEye.centerX)*180/Math.PI};
}
export function personFromMask(data,mw,mh,w,h,eyeY) {
  let minX=mw,minY=mh,maxX=-1,maxY=-1,sliverLeft=mw,sliverRight=-1;
  const y0=Math.max(0,Math.floor((eyeY-6)*mh/h)),y1=Math.min(mh-1,Math.floor((eyeY+6)*mh/h));
  for (let y=0;y<mh;y++) for (let x=0;x<mw;x++) if (data[y*mw+x]>0) {
    minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
    if (y>=y0 && y<=y1) {sliverLeft=Math.min(sliverLeft,x);sliverRight=Math.max(sliverRight,x);}
  }
  if (maxX<0) throw Error('Google could not detect the person outline');
  return {bounds:bounds([{x:minX*w/mw,y:minY*h/mh},{x:(maxX+1)*w/mw,y:(maxY+1)*h/mh}]),sliverCenterX:sliverRight<0?null:(sliverLeft+sliverRight+1)*w/mw/2};
}
export function calculateCrop(measurements,person,w,h,calibration) {
  const m={...measurements,person:person?.bounds??null,personLayer:person?{sliverCenterX:person.sliverCenterX}:null};
  const result=buildCropRect({width:w,height:h},m,calibration);
  const crop={...result.crop,width:result.crop.right-result.crop.left,height:result.crop.bottom-result.crop.top};
  const baseHeight=measurements.eyeMouthGap/(1-calibration.bottomGapPx/calibration.aspectHeight-calibration.topGapPx/calibration.aspectHeight);
  const warnings=[];
  if (baseHeight>h || baseHeight*.8>w) warnings.push('Crop fitted inside photo edges');
  if (result.personTopAdjustPx>0) warnings.push('Existing top-of-head correction applied');
  if (person&&person.sliverCenterX==null) warnings.push('Person outline missing at eye height; horizontal outline correction unavailable');
  return {crop,adjustments:{noseShiftX:result.noseShiftX,silhouetteShiftX:result.silhouetteShiftX,personTopAdjustPx:result.personTopAdjustPx},warnings};
}
export function jpegOrientation(bytes) {
  try {
    const d=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    if (d.getUint16(0)!==0xffd8) return 1;
    let p=2;
    while (p+4<d.byteLength) {
      const marker=d.getUint16(p),size=d.getUint16(p+2);
      if (marker===0xffda || marker===0xffd9 || size<2) break;
      if (marker===0xffe1 && d.getUint32(p+4)===0x45786966 && d.getUint16(p+8)===0) {
        const t=p+10,le=d.getUint16(t)===0x4949,ifd=t+d.getUint32(t+4,le),count=d.getUint16(ifd,le);
        for(let i=0;i<count;i++) {const e=ifd+2+i*12;if(d.getUint16(e,le)===0x112) return d.getUint16(e+8,le);}
      }
      p+=2+size;
    }
  } catch {}
  return 1;
}
export function rawCrop(crop,w,h,rotation,exif) {
  const inverseTurn=([x,y])=>rotation===90?[y,1-x]:rotation===180?[1-x,1-y]:rotation===270?[1-y,x]:[x,y];
  const inverseExif=([x,y])=>({1:[x,y],2:[1-x,y],3:[1-x,1-y],4:[x,1-y],5:[y,x],6:[y,1-x],7:[1-y,1-x],8:[1-y,x]})[exif]||[x,y];
  const p=[[crop.left/w,crop.top/h],[crop.right/w,crop.top/h],[crop.right/w,crop.bottom/h],[crop.left/w,crop.bottom/h]].map(inverseTurn).map(inverseExif);
  return {left:Math.min(...p.map(p=>p[0])),top:Math.min(...p.map(p=>p[1])),right:Math.max(...p.map(p=>p[0])),bottom:Math.max(...p.map(p=>p[1]))};
}
export function tiltCorrection(degrees) {
  if(!Number.isFinite(degrees))throw Error('Invalid head tilt');
  const strength=Math.abs(degrees)<=5?1:Math.max(0,1-Math.abs(degrees)/100);
  return {detectedDeg:degrees,strength,appliedDeg:-degrees*strength,residualDeg:degrees*(1-strength)};
}
export function rotatePoint(p,w,h,degrees){
  const r=degrees*Math.PI/180,c=Math.cos(r),s=Math.sin(r),x=p.x-w/2,y=p.y-h/2;
  return {...p,x:w/2+x*c-y*s,y:h/2+x*s+y*c};
}
export function rotateLandmarks(points,w,h,degrees){return points.map(p=>{const q=rotatePoint({x:p.x*w,y:p.y*h},w,h,degrees);return {...p,x:q.x/w,y:q.y/h};});}
export function headTilt(points,w,h){
  const midpoint=(a,b)=>({x:(points[a].x+points[b].x)*w/2,y:(points[a].y+points[b].y)*h/2});
  const [l,r]=[midpoint(33,133),midpoint(362,263)].sort((a,b)=>a.x-b.x);
  return Math.atan2(r.y-l.y,r.x-l.x)*180/Math.PI;
}
export function safeTiltCrop(crop,w,h,appliedDeg){
  const center={x:(crop.left+crop.right)/2,y:(crop.top+crop.bottom)/2};
  const source=rotatePoint(center,w,h,-appliedDeg),r=appliedDeg*Math.PI/180,c=Math.abs(Math.cos(r)),s=Math.abs(Math.sin(r)),aspect=.8;
  const height=Math.min(crop.height,2*Math.min(source.x,w-source.x)/(c*aspect+s),2*Math.min(source.y,h-source.y)/(s*aspect+c));
  if(!(height>5))throw Error('Tilt-corrected crop cannot fit inside the photo');
  const width=height*aspect;
  return {left:center.x-width/2,top:center.y-height/2,right:center.x+width/2,bottom:center.y+height/2,width,height};
}
export function tiltedRawCrop(crop,w,h,rotation,exif,appliedDeg){
  // CropAngle rotates about the crop center. Undo fine rotation for that center,
  // retain side lengths, then map the axis-aligned rectangle through EXIF/turns.
  const center=rotatePoint({x:(crop.left+crop.right)/2,y:(crop.top+crop.bottom)/2},w,h,-appliedDeg);
  const unrotated={left:center.x-crop.width/2,right:center.x+crop.width/2,top:center.y-crop.height/2,bottom:center.y+crop.height/2};
  return {crop:rawCrop(unrotated,w,h,rotation,exif),angle:-appliedDeg*([2,4,5,7].includes(exif)?-1:1)};
}
