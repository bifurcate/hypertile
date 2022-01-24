import { exp } from 'mathjs'
import {
  invert,
  rotate90,
  Line,
  Vector,
  Point,
  ArcSegment, 
  intersection,
  bisector,
  Circle,
  clipArc, 
  hLineThrough,
  buildSchwarzTriangle,
  Triangle,
  reflect,
  isLinearlyDependent} from './geometry'

function c(x: number[]) {
  return JSON.parse(JSON.stringify(x))
}

describe('geometry', () => {
  describe('rotate90', () => {
    test('unit vector is rotated as expected', () => {
      const vec = [1,0]
      const rotated = rotate90(vec)
      expect(rotated).toEqual([0,1])
    })
  })
  describe('invert', () => {
    const unitCircle = {
      center: [0,0],
      radius: 1
    }
    test('point lying on the circumference is mapped to itself', () => {
      expect(invert([1,0], unitCircle)).toEqual([1,0])
    })
    test('point in center is mapped to infinity', () => {
      expect(invert([0,0], unitCircle)).toEqual([NaN, NaN])
    })
    test('example1', () => {
      expect(invert([.5,0],unitCircle)).toEqual([2, 0])
    })
    xtest('example2', () => {
      const c = {
        center: [4,0],
        radius: 1
      }
      const p = [0,0]
      const p_ = invert(p, c)
      expect(invert([.5,0],unitCircle)).toEqual([3.75, 0])
    })
  })
  describe('reflect', () => {
    test('example1', () => {
      const p: Point = [-2, 0]
      const v: Vector = [0,1]
      const aP = reflect(p,v)
      const eP = [2,0]
      expect(aP).toEqual(eP)
    })
    test('example2', () => {
      const p: Point = [-1, .5]
      const v: Vector = [0,1]
      const aP = reflect(p,v)
      const eP = [1,.5]
      expect(aP).toEqual(eP)
    })
    test('example', () => {
      const p: Point = [0, .5]
      const v: Vector = [0,1]
      const aP = reflect(p,v)
      const eP = [0,.5]
      expect(aP).toEqual(eP)
    })
    test('example3', () => {
      const p: Point = [1, -1]
      const v: Vector = [1,1]
      const aP = reflect(p,v)
      const eP = [-1,1]
      expect(aP).toEqual(eP)
    })
    xtest('example4', () => {
      const p: Point = [
        0.26607724526008847,
        0
      ]
      const v: Vector = [
        0.270959736741934,
        0.1304873319336852
      ]
      const aP = reflect(p,v)
      const eP = [-1,1]
      expect(aP).toEqual(eP)
    })
  })
  describe('intersection', () => {
    test('intersection of 2 zero based lines is zero', () => {
      const line1: Line = {
        direction: [1,0],
        basepoint: [0,0],
      }
      const line2: Line = {
        direction: [0,1],
        basepoint: [0,0]
      }
      expect(c(intersection(line1, line2))).toEqual([0,0])
    })
    test('intersection example', () => {
      const line1: Line = {
        direction: [0,1],
        basepoint: [1,0],
      }
      const line2: Line = {
        direction: [1,-1],
        basepoint: [0,0]
      }
      expect(c(intersection(line1, line2))).toEqual([1,-1])
    })
    test('intersection example', () => {
      const line1: Line = {
        direction: [-1,1],
        basepoint: [3,0],
      }
      const line2: Line = {
        direction: [1,1],
        basepoint: [1,0]
      }
      expect(c(intersection(line1, line2))).toEqual([2,1])
    })
  })
  describe('bisector', () => {
    test('example1', () => {
      const p1: Point = [0, 2]
      const p2: Point = [0, 0]
      const l: Line = {
        direction: [-2, 0],
        basepoint: [0, 1]
      }
      expect(bisector(p1, p2)).toEqual(l)
    })
    test('example2', () => {
      const p1: Point = [1,1]
      const p2: Point = [3,3]
      const l: Line = {
        direction: [-1,1],
        basepoint: [2,2]
      } 
    })
    test('example3', () => {
      const p1 = [.5, 0]
      const p2 = [ .5, -.5]
      const el: Line = {
        direction: [-.5,0],
        basepoint: [.5, -.25]
      }
      const al = bisector(p1, p2)
      expect(al).toEqual(el)
    })
  })
  describe('clipArc', () => {
    test('example1', () => {

      const unitCircle: Circle = {
        center: [0, 0],
        radius: 1
      }
      const C: Circle = {
        center: [1, 0],
        radius: 1
      }

      const expectedAS: ArcSegment = {
        circle: C,
        start: 2 * Math.PI / 3,
        end: 4 * Math.PI / 3 
      }

      const actualAS = clipArc(C, unitCircle)

      expect(actualAS.circle).toEqual(expectedAS.circle)
      expect(actualAS.start).toBeCloseTo(expectedAS.start, 14)
      expect(actualAS.end).toBeCloseTo(expectedAS.end, 14)

    })
  })
  describe('hLineThrough', () => {
    test('if points as vectors are linearly dependent return a LineSegment', () => {
      const p1 = [.5, .5]
      const p2 = [ -.5, -.5]
      const r = hLineThrough(p1, p2)
      expect(r).toHaveProperty('startPoint')
    })
    test('if points as vectors are linearly independent return an ArcSegment', () => {
      const p1 = [.5, .5]
      const p2 = [ -.5, .5]
      const r = hLineThrough(p1, p2)
      expect(r).toHaveProperty('circle')
    })
  })
  describe('buildSchwarzTriangle', () => {
    xtest('example1', () => {
      const p = 8
      const q = 3
      const aT = buildSchwarzTriangle(p,q)
      const eT: Triangle = [
        [0, 0],
        [0, 0.3645668590273167],
        [0.3747406907514157, 0.15522267648229826],  
      ]
      expect(aT).toEqual(eT)
    })
    test('hyperbolic lines through Schwarz triangle point', () => {
      const p = 8
      const q = 3
      const T = buildSchwarzTriangle(p,q)
      const l1 = hLineThrough(T[0], T[1])
      const l2 = hLineThrough(T[1], T[2])
      const l3 = hLineThrough(T[2], T[0])

    })
  })
  describe('isLinearlyDependent', () => {
    test('tolerance', () => {
      const v1 = [
        0.270959736741934,
        0.1304873319336852
      ]
      const v2 = [
        0.49697042539518166,
        7.197814119823157e-16
      ]
      expect(isLinearlyDependent(v1, v2)).toBeTruthy()
    })
  })
})