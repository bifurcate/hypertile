import { Point, hLineThrough } from './geometry'
import { initCoxeterSystem, initGenerations, Association, generateNext } from './coxeter_system'
import { WebpackOptionsValidationError } from 'webpack'
const canvas = document.getElementById('main') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

const borderSize = 50
const scale = (Math.min(canvas.width, canvas.height) - borderSize) / 2

function toViewCoords(p: Point) {
  return [
    canvas.width / 2 + scale * p[0],
    canvas.height / 2 - scale * p[1]
  ]
}

function toViewScale(k: number) {
  return scale * k  
}

const vP = toViewCoords([0,0])
const r0 = toViewScale(1)

function drawUnitCircle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.lineWidth = 10
  ctx.arc(vP[0], vP[1], r0, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawGeneration(generation: Association[], ctx: CanvasRenderingContext2D, i: number ) {
  generation.forEach((element) => {
    const t = element.triangle
    console.log(element.triangle)
    const l1 = hLineThrough(t[0], t[1])
    const l2 = hLineThrough(t[1], t[2])
    const l3 = hLineThrough(t[2], t[0])
    const lines = [l1,l2,l3]
    ctx.beginPath()
    ctx.lineWidth = 1
    lines.forEach((l) => {
      if (ctx !== null) {
        if ('circle' in l) {
          
          const c = toViewCoords(l.circle.center)
          const r = toViewScale(l.circle.radius)

          let counterclockwise = false
          const start = l.start
          const end = l.end
          if (end > start) { counterclockwise = true }

          ctx.arc(c[0], c[1], r, 2 * Math.PI - l.start, 2 * Math.PI - l.end, counterclockwise)

        } else {
          const a = toViewCoords(l.startPoint)
          const b = toViewCoords(l.endPoint)
          ctx.moveTo(a[0], a[1])
          ctx.lineTo(b[0], b[1])
        }
        // ctx.closePath()
        ctx.fillStyle = i % 2 === 1 ? 'blue' : 'white'
        ctx.fill()
        ctx.stroke()
      }
    })
  })
}

const cs = initCoxeterSystem(9,3)
const generations = initGenerations(cs)

if (ctx !== null) {
  drawUnitCircle(ctx)
  drawGeneration(generations[0], ctx, 0)
  drawGeneration(generations[1], ctx, 1)
}

let I = 2

function step(ts:number) {
  if (I < 4) {
    const gen = generateNext(cs, generations[I-1], I)
    generations.push(gen)
    if (ctx !== null) { drawGeneration(gen, ctx, I) }
    I++
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step)