import Two from 'two.js'

const params = {
  fullscreen: true
}

const two = new Two().appendTo(document.body)

const minRadius = 1
const maxRadius = 100
let direction = 'up'

let radius = minRadius
const x = two.width * 0.5
const y = two.height * 0.5 - radius * 1.25
let circle = two.makeCircle(x,y, radius)

circle.fill = '#FF8000'
circle.stroke = 'orangered'
circle.linewidth = 5

const update = () => {
  if (radius > maxRadius) { direction = 'down' }
  if (radius < minRadius) { direction = 'up' }
  if (direction === 'up') {
    radius = radius + 1
  } else {
    radius = radius - 1
  }

  two.remove(circle)
  circle = two.makeCircle(x,y, radius)

  circle.fill = '#FF8000'
  circle.stroke = 'orangered'
  circle.linewidth = 5
}

two.bind('update', update)

two.play()


///

import { LoDashExplicitNumberArrayWrapper } from 'lodash'
import Two from 'two.js'
import { Circle, Line, Point, hLineThrough } from './geometry'

const params = { fullscreen: true }
const two = new Two(params).appendTo(document.body)
const borderSize = 50
const scale = (Math.min(two.width, two.height) - borderSize) / 2

function toViewCoords(p: Point) {
  return [
    two.width / 2 + scale * p[0],
    two.height / 2 - scale * p[1]
  ]
}

function toViewScale(k: number) {
  return scale * k  
}

const vP = toViewCoords([0,0])
const r = toViewScale(1)
let unitCircle = two.makeCircle(vP[0], vP[1], r)

let unitCircle = two.makeCircle(0, 0, 1)
unitCircle.fill = '#FFFFFF'

let c = two.makeCircle(0,0,.01)
c.fill = 'blue'

let group = two.makeGroup()
group.position.set(two.width / 2, two.height / 2)
group.scale = (Math.min(two.width, two.height) - borderSize) / 2

group.add(unitCircle)

for(let i=-.95; i<1; i+=.05) {
  let p1 = [i, .01]
  let p2 = [i, -.01]
  let hLine = hLineThrough(p1, p2)
  let hLine_ = two.makeCircle(hLine.circle.center[0], hLine.circle.center[1], hLine.circle.radius)
  hLine_.noFill()
  group.add(hLine_)
}

group.stroke = '#000000'
group.linewidth = .005

two.update()