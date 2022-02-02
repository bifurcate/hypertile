import { Point, hLineThrough } from './geometry'
import { initCoxeterSystem, initGenerations, Association, generateNext } from './coxeter_system'
import { RendererSettings, CanvasRenderer } from './render'

const canvas = document.getElementById('main') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

if (ctx === null) { throw new Error('Canvas is null') }

const rendererSettings: RendererSettings = {
  borderSize: 50,
  unitCircleLineWidth: 5,
  interiorLineWidth: 1,
  colorPalette: ['red', 'blue']
}

const renderer = new CanvasRenderer(ctx, rendererSettings)

function drawGeneration(generation: Association[], i: number ) {
  generation.forEach((element) => renderer.drawTriangle(element.triangle, i))
}

const cs = initCoxeterSystem(9,3)
const generations = initGenerations(cs)

renderer.drawUnitCircle()
drawGeneration(generations[0], 0)
drawGeneration(generations[1], 1)

let I = 2

function step(ts:number) {
  if (I < 18) {
    const gen = generateNext(cs, generations[I-1], I)
    generations.push(gen)
    if (ctx !== null) { drawGeneration(gen, I) }
    I++
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step)