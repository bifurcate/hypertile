// @ts-nocheck
import { endsWith } from 'lodash'
import {
  MathArray,
  MathType,
  Matrix,
  matrix,
  multiply,
  transpose,
  distance,
  dot,
  det,
  norm,
  subtract,
  add,
  unit,
  sin,
  cos
} from 'mathjs'

const DETERMINANT_TOLERANCE = 1e-13

const rot90Matrix = matrix([[0, -1],[1, 0]])

export function rotate90(vec: number[]) {
  return multiply(rot90Matrix, vec).toArray()
}

export type Point = number[]
export type Vector = number[]
export type HLine = ArcSegment | LineSegment
export type Triangle = Point[]

export interface Line {
  basepoint: number[],
  direction: number[],
}

export interface LineSegment {
  startPoint: Point,
  endPoint: Point
}

export interface Circle {
  center: Point,
  radius: number,
}

export interface ArcSegment {
  circle: Circle,
  start: number,
  end: number,
}

export interface Triangle {
  a: Point,
  b: Point,
  c: Point,
}

const unitCircle: Circle = {
  center: [0,0],
  radius: 1
}

export function invert(p: Point, c: Circle) {
  const dir = subtract(p, c.center)
  const dist = norm(dir)
  return add(multiply((c.radius*c.radius)/(dist*dist), dir), c.center)
}

export function reflect(p: Point, v: Vector) {
  // reflection through origin
  const k = dot(p,v) / norm(v)
  const v_ = multiply(1/norm(v),v)
  const w = multiply(k, v_)
  const p_ = subtract(multiply(2, w), p)
  return p_
}

export function intersection(line1: Line, line2: Line) {
  const b = subtract(line2.basepoint, line1.basepoint)
  const M_ = transpose(matrix([line1.direction, multiply(-1, line2.direction)]))
  const M1 = transpose(matrix([b, multiply(-1, line2.direction)]))
  const M2 = transpose(matrix([line1.direction, b]))
  const s = det(M1)/det(M_)
  const intersectionPoint = add(multiply(s, line1.direction), line1.basepoint)
  return [intersectionPoint[0], intersectionPoint[1]] as Point
}

export function normalize(v: number[]) {
  const nrm = norm(v)
  return multiply(1/nrm, v)
}

export function bisector(p1: Point, p2: Point) {
  const midpoint = multiply(.5, add(p1, p2))
  const direction = subtract(p1, p2)
  const line: Line = {
    direction: rotate90(direction),
    basepoint: midpoint
  }
  return line
}

export function clipArc(c1, c2): ArcSegment {

  const alpha = Math.atan2(
    (c2.center[1] - c1.center[1]),
    (c2.center[0] - c1.center[0])
  )

  const d = distance(c1.center, c2.center)

  const beta = Math.acos((c1.radius * c1.radius + d * d - c2.radius * c2.radius)/(2 * d * c1.radius))

  return {
    circle: c1,
    start: alpha - beta,
    end: alpha + beta
  }
}

export function clipArc2(c: Circle, p1: Point, p2: Point): ArcSegment {
  const v1 = subtract(p1, c.center)
  const v2 = subtract(p2, c.center)

  let alpha = Math.atan2(v1[1], v1[0])
  let beta = Math.atan2(v2[1], v2[0])

  if (Math.abs(alpha) < 1e-13) { alpha = 0 }
  if (Math.abs(beta) < 1e-13) { beta = 0 }

  if (Math.abs(alpha - beta) > Math.PI) {
    if (Math.min(alpha, beta) == alpha) {
      alpha = 2 * Math.PI + alpha
    } else {
      beta = 2 * Math.PI + beta
    }
  }

  return {
    circle: c,
    start: alpha,
    end: beta
  }
}

export function isLinearlyDependent(p1: Point, p2: Point) {
  const M = transpose(matrix([p1, p2]))
  return (Math.abs(det(M)) < DETERMINANT_TOLERANCE)
}

export function normalizeVec(v) {
  return multiply(1/norm(v), v)
}

export function hLineThrough(p1: Point, p2: Point): HLine {

  if (isLinearlyDependent(p1, p2)) {
    return { startPoint: p1, endPoint: p2 }
  }

  const p1_ = invert(p1, unitCircle)
  const p2_ = invert(p2, unitCircle)

  const la = bisector(p1, p2)
  const lb = bisector(p1, p1_)

  const c_ = intersection(la, lb)
  const hCircle: Circle = {
    center: c_,
    radius: distance(p1, c_)
  }
  const hLine = clipArc2(hCircle, p1, p2)
  return hLine
}

export function hReflect(p: Point, l: HLine) {
  if ('circle' in l) {
    const c = l.circle
    return invert(p, c)
  } else {
    const v = (l.startPoint[0] === 0 && l.startPoint[0] === 0) ? l.endPoint : l.startPoint
    return reflect(p, v)
  }
}

export function hReflectTriangle(triangle: Triangle, mirror: Hline) {
  return [
    hReflect(triangle[0], mirror),
    hReflect(triangle[1], mirror),
    hReflect(triangle[2], mirror)
  ]
}

export function buildSchwarzTriangle(p: number, q: number, r: number = 2): Point[] {
  const alpha = Math.PI / p
  const beta = Math.PI / q + Math.PI / 2
  const gamma = Math.PI - alpha - beta

  const k = Math.sin(beta) / Math.sin(alpha)
  const d = Math.sqrt((k-1) / (k+1))
  const R = .5 * (1 / d - d)
  const l = R * (sin(gamma) / sin(alpha))

  const a = [0,0]
  const b = [d,0]
  const c = [l * cos(alpha), l * sin(alpha)]

  return [a, b, c]
}
