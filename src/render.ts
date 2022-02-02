import { hLineThrough, Point, Triangle } from "./geometry"

export interface RendererSettings {
  borderSize: number
  unitCircleLineWidth: number
  interiorLineWidth: number
  colorPalette: string[]
}

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D
  settings: RendererSettings
  scale: number
  
  constructor(ctx: CanvasRenderingContext2D, settings: RendererSettings) {
    this.ctx = ctx
    this.settings = settings
    this.scale = this.calculateScale()
  }

  private calculateScale() {
    const canvas = this.ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const borderSize = this.settings.borderSize
    return (Math.min(width, height) - borderSize)/2
  }

  private toViewCoords(p: Point) {
    const canvas = this.ctx.canvas
    const width = canvas.width
    const height = canvas.height
    return [
      width / 2 + this.scale * p[0],
      height / 2 - this.scale * p[1]
    ]
  }

  private toViewScale(k: number) {
    return this.scale * k
  }

  public drawUnitCircle() {
    const ctx = this.ctx
    const viewOrigin = this.toViewCoords([0, 0])
    const viewUnit = this.toViewScale(1)
    
    ctx.beginPath()
    ctx.lineWidth = this.settings.unitCircleLineWidth
    ctx.arc(viewOrigin[0], viewOrigin[1], viewUnit, 0, 2 * Math.PI)
    ctx.stroke()
  }

  public drawTriangle(tri: Triangle, idx = 0) {
    const ctx = this.ctx
    const lines = [
      hLineThrough(tri[0], tri[1]),
      hLineThrough(tri[1], tri[2]),
      hLineThrough(tri[2], tri[0]),
    ]
    ctx.beginPath()
    ctx.lineWidth = this.settings.interiorLineWidth

    lines.forEach((l) => {
      if ('circle' in l) {
        
        const c = this.toViewCoords(l.circle.center)
        const r = this.toViewScale(l.circle.radius)

        let counterclockwise = false
        const start = l.start
        const end = l.end
        if (end > start) { counterclockwise = true }

        ctx.arc(c[0], c[1], r, 2 * Math.PI - l.start, 2 * Math.PI - l.end, counterclockwise)

      } else {
        const a = this.toViewCoords(l.startPoint)
        const b = this.toViewCoords(l.endPoint)
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
      }
      ctx.fillStyle = this.settings.colorPalette[idx % 2]
      ctx.fill()
      ctx.stroke()
   })
  }
}