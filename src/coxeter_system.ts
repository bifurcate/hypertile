// @ts-nocheck

import { buildSchwarzTriangle, hLineThrough, hReflect, Point, HLine, Triangle, hReflectTriangle, intersection } from './geometry'

interface Mirrors {
  A: HLine,
  B: HLine,
  C: HLine
}

interface Relations {
  [key: string]: number
} 

export interface CoxeterSystem {
  fundamentalTriangle: Point[],
  mirrors: Mirrors
  rules: Relations
}

export interface Association {
  multiWord: string[][],
  triangle
}

export function initCoxeterSystem(p: number, q: number): CoxeterSystem {
  const T = buildSchwarzTriangle(p,q)
  return {
    fundamentalTriangle: T,
    mirrors: {
      'A': hLineThrough(T[0], T[1]),
      'B': hLineThrough(T[1], T[2]),
      'C': hLineThrough(T[2], T[0])
    },
    rules: {
      'AB': 2,
      'BC': q,
      'AC': p 
    }
  }
}

function applyAction(s: symbol, triangle: Triangle, cs: CoxeterSystem) {
  const mirror = cs.mirrors[s]
  return hReflectTriangle(triangle, mirror)
}

export function generateNext(cs: CoxeterSystem, prevGen: Association[], depth: number) {

  let alphabet = ['A', 'B', 'C']

  const startTime = performance.now()

  const gen = prevGen.flatMap((X) => {
    const prevMWord = X.multiWord
    const symbols = alphabet.filter((s) => !lastMulti(prevMWord).includes(s))
    const multiWords = appendMulti(prevMWord, symbols)
    return multiWords.map((mw) => ({ multiWord: mw, triangle: X.triangle })) 
  })

  for(let j = 0; j < gen.length - 1; j++) {
    for(let k = j + 1; k < gen.length; k++) {
      const k_mod = k % gen.length
      if (equalsMulti(gen[j].multiWord, gen[k_mod].multiWord, cs.rules)) {
        console.log(`match: ${j} - ${k}`)
        gen[j].multiWord = gen[j].multiWord.concat(gen[k_mod].multiWord)
        gen.splice(k_mod,1)
        break
      }
    }
  }

  gen.forEach((X) => {
    const action = last(X.multiWord[0])
    X.triangle = applyAction(action, X.triangle, cs)
  })


  const endTime = performance.now()

  console.log(`generation(${depth}): ${endTime - startTime}ms / ${(endTime - startTime)/1000}s to execute`)
  return gen
}

export function initGenerations(cs) {
  let ini: Association = {
    multiWord: [['', '']],
    triangle: cs.fundamentalTriangle
  }

  let generations = [
    [ini],
    [
      { multiWord: [['', 'A']], triangle: applyAction('A', cs.fundamentalTriangle, cs) },
      { multiWord: [['', 'B']], triangle: applyAction('B', cs.fundamentalTriangle, cs) },
      { multiWord: [['', 'C']], triangle: applyAction('C', cs.fundamentalTriangle, cs) }
    ]
  ]
  return generations
}

export function generate(cs: CoxeterSystem, l: number) {

  const generations = initGenerations(cs)

  for(let i = 2; i <= l; i++) {
    generations.push(generateNext(cs, generations[i-1], i))
  }

  return generations
}

export function append(word: string[], symbol: string) {
  let tail = word[0]
  let head = word[1]

  if (head.length < 2 || head.includes(symbol)) {
    head = head + symbol
  } else {
    tail = tail + head.slice(0, head.length - 1)
    head = head[head.length - 1] + symbol
  }
  
  return [tail, head]
}

export function equals(wordA: string[], wordB: string[], rules: Relations) {
  const tailA = wordA[0]
  const tailB = wordB[0]
  const headA = wordA[1]
  const headB = wordB[1]
  
  if (tailA === tailB && headA === headB) { return true }
  if (tailA !== tailB || headA.length !== headB.length) { return false }
  if (headA.length < 2) { return headA === headB }
  if (
    cycleName(headA) === cycleName(headB) &&
    rules[cycleName(headA)] === headA.length
  ) { return true }

  return false
}

function cycleName(s: string) {
  if (s[0] < s[1]) {
    return s[0] + s[1]
  } else {
    return s[1] + s[0]
  }
}

export function last(word: string[]) {
  let head = word[1]
  return head[head.length - 1]
}

export function appendMulti(mWord: string[][], symbols: string[]) {
  return symbols.map((s) => mWord.map((word) => append(word, s)))
}

export function equalsMulti(mWordA: string[][], mWordB: string[][], rules: Relations) {
  for(let i = 0; i < mWordA.length; i++) {
    for(let j = 0; j < mWordB.length; j++) {
      if (equals(mWordA[i], mWordB[j], rules)) { return true }
    }
  }
  return false
}

export function lastMulti(mWord: string[][]) {
  return mWord.map(last)
}

