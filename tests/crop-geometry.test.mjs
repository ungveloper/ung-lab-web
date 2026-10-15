import test from 'node:test';
import assert from 'node:assert/strict';
import {clampCropRect, cropAspect, cropPixels, cropRectFromPoints, cropRectFromSettings, cropRectToSettings, fitCropAspect, moveCropRect} from '../lib/crop-geometry.mjs';

const defaults = {cropX:0,cropY:0,cropWidth:100,cropHeight:100,cropRatio:'free',width:0,height:0};

test('자유 자르기는 기본 전체 선택 후 손가락 좌표를 반영해 실제 픽셀 크기를 줄인다', () => {
  const whole=cropRectFromSettings(defaults, 1200, 900);
  assert.deepEqual(whole,{x:0,y:0,w:1,h:1});
  const pointerRect=cropRectFromPoints({x:.18,y:.22},{x:.73,y:.82},null,1200,900);
  assert.ok(pointerRect);
  const r=cropRectFromSettings({...defaults,...cropRectToSettings(pointerRect)},1200,900);
  const p=cropPixels(r,1200,900);
  assert.deepEqual(p,{x:216,y:198,width:660,height:540});
});

test('1:1 고정비율 선택은 세로·가로가 같은 실제 픽셀로 변환된다',()=>{
  const square=cropRectFromSettings({...defaults,cropRatio:'1:1'},1200,800);
  assert.ok(Math.abs(square.w*1200-square.h*800)<0.0001);
  const pixels=cropPixels(square,1200,800);
  assert.equal(pixels.width,pixels.height);
});

test('9:16와 16:9는 세로·가로 화면과 회전 출력 크기에 대응한다',()=>{
  const portrait=cropRectFromSettings({...defaults,cropRatio:'9:16'},800,1200);
  assert.ok(Math.abs((portrait.w*800)/(portrait.h*1200)-9/16)<1e-8);
  const landscape=cropRectFromSettings({...defaults,cropRatio:'16:9'},1200,800);
  assert.ok(Math.abs((landscape.w*1200)/(landscape.h*800)-16/9)<1e-8);
  const rotated=cropRectFromSettings({...defaults,cropRatio:'16:9'},800,1200);
  assert.ok(Math.abs((rotated.w*800)/(rotated.h*1200)-16/9)<1e-8);
});

test('터치로 만든 선택 영역은 이미지 바깥을 벗어나지 않는다',()=>{
  const r=cropRectFromPoints({x:.92,y:.88},{x:1.7,y:1.8},16/9,1000,1000);
  assert.ok(r);
  assert.ok(r.x>=0&&r.y>=0&&r.x+r.w<=1.000001&&r.y+r.h<=1.000001);
  assert.ok(Math.abs(r.w/r.h-16/9)<1e-8);
  const moving=moveCropRect(r,-10,12);
  assert.ok(moving.x>=0&&moving.y+moving.h<=1);
  assert.deepEqual(clampCropRect({x:-20,y:20,w:2,h:2}),{x:0,y:0,w:1,h:1});
});

test('터치 드래그가 왼쪽·위쪽 방향으로 진행되어도 직사각형이 생성된다',()=>{
  const r=cropRectFromPoints({x:.8,y:.8},{x:.2,y:.25},null,1200,900);
  assert.ok(r);
  assert.ok(Math.abs(r.x-.2)<1e-8);
  assert.ok(Math.abs(r.y-.25)<1e-8);
  assert.equal(cropAspect('free',1200,900),null);
  assert.equal(cropAspect('custom',1200,900,4,5),.8);
});

test('극단적인 선택 영역도 유효한 픽셀을 만들고 크롭 후 크기는 안전 범위이다',()=>{
  assert.deepEqual(cropPixels(fitCropAspect({x:.98,y:.98,w:.02,h:.02},null,100,100),100,100),{x:98,y:98,width:2,height:2});
  assert.ok(cropRectFromPoints({x:0,y:0},{x:0,y:0},null,500,400));
});
