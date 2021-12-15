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