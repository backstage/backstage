/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { CartCoord, PolarCoord, Quadrant, Ring } from '../../../types';

function polar({ x, y }: CartCoord) {
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y),
  };
}

export function cartesian({ r, t }: PolarCoord) {
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t),
  };
}

function boundedInterval(value: number, min: number, max: number) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

function boundedRing(p: PolarCoord, rMin: number, rMax: number) {
  return {
    t: p.t,
    r: boundedInterval(p.r, rMin, rMax),
  };
}

function boundedBox(point: CartCoord, min: CartCoord, max: CartCoord) {
  return {
    x: boundedInterval(point.x, min.x, max.x),
    y: boundedInterval(point.y, min.y, max.y),
  };
}

export default class Segment {
  polarMin: PolarCoord;
  polarMax: PolarCoord;
  cartesianMin: CartCoord;
  cartesianMax: CartCoord;
  nextSeed: () => number;

  constructor(quadrant: Quadrant, ring: Ring, radius: number, nextSeed: () => number) {
    this.nextSeed = nextSeed;
    this.polarMin = {
      t: quadrant.radialMin,
      r: ring.innerRadius,
    };
    this.polarMax = {
      t: quadrant.radialMax,
      r: ring.outerRadius,
    };
    this.cartesianMin = {
      x: 15 * quadrant.offsetX,
      y: 15 * quadrant.offsetY,
    };
    this.cartesianMax = {
      x: radius * quadrant.offsetX,
      y: radius * quadrant.offsetY,
    };
  }

  clip(d: CartCoord) {
    const c = boundedBox(d, this.cartesianMin, this.cartesianMax);
    const p = boundedRing(polar(c), this.polarMin.r + 15, this.polarMax.r - 15);
    return cartesian(p);
  }

  random() {
    return cartesian({
      t: this._randomBetween(this.polarMin.t, this.polarMax.t),
      r: this._normalBetween(this.polarMin.r, this.polarMax.r),
    });
  }

  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  _random() {
    const x = Math.sin(this.nextSeed()) * 10000;
    return x - Math.floor(x);
  }

  _randomBetween(min: number, max: number) {
    return min + this._random() * (max - min);
  }

  _normalBetween(min: number, max: number) {
    return min + (this._random() + this._random()) * 0.5 * (max - min);
  }
}

export function clipToRingAndQuadrant(coordinate: CartCoord, quadrant: Quadrant, ring: Ring): CartCoord {
  const padding = 15;

  const boundingCoord1: CartCoord = cartesian({
    r: ring.outerRadius,
    t: quadrant.radialMin,
  });
  const boundingCoord2: CartCoord = cartesian({
    r: ring.outerRadius,
    t: quadrant.radialMax,
  });
  const boundingBoxMin: CartCoord = {
    x: Math.min(boundingCoord1.x, boundingCoord2.x) + padding,
    y: Math.min(boundingCoord1.y, boundingCoord2.y) + padding,
  };
  const boundingBoxMax: CartCoord = {
    x: Math.max(boundingCoord1.x, boundingCoord2.x) - padding,
    y: Math.max(boundingCoord1.y, boundingCoord2.y) - padding,
  };

  const c = boundedBox(coordinate, boundingBoxMin, boundingBoxMax);
  const p = boundedRing(polar(c), ring.innerRadius + padding, ring.outerRadius - padding);
  return cartesian(p);
}
