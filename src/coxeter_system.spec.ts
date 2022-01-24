import { append, appendMulti, equals, equalsMulti, generate, initCoxeterSystem, last } from './coxeter_system'

describe('append', () => {
  test('1', () => {
    expect(
      append(['', ''], 'A')
    ).toEqual(['', 'A'])
  })
  test('2', () => {
    expect(
      append(['', 'A'], 'B')
    ).toEqual(['', 'AB'])
  })
  test('3', () => {
    expect(
      append(['', 'AB'], 'A')
    ).toEqual(['', 'ABA'])
  })
  test('3', () => {
    expect(
      append(['', 'AB'], 'C')
    ).toEqual(['A', 'BC'])
  })
  test('4', () => {
    expect(
      append(['A', 'BC'], 'B')
    ).toEqual(['A', 'BCB'])
  })
  test('5', () => {
    expect(
      append(['A', 'BCB'], 'A')
    ).toEqual(['ABC', 'BA'])
  })
  test('6', () => {
    expect(
      append(['ABC', 'BA'], 'C')
    ).toEqual(['ABCB', 'AC'])
  })
  test('7', () => {
    expect(
      append(['ABCB', 'AC'], 'A')
    ).toEqual(['ABCB', 'ACA'])
  })
})
describe('appendMulti', () => {
  test('1', () => {
    expect(
      appendMulti(
        [
          ['', 'AB'],
          ['', 'BC'],
        ],
        ['D', 'E']
      )
    ).toEqual(
      [
        [
          ['A', 'BD'],
          ['B', 'CD']
        ],
        [
          ['A', 'BE'],
          ['B', 'CE']
        ],
      ]
    )
  })
})
describe('last', () => {
  test('1', () => {
    expect(last(['A','BCBC'])).toEqual('C')
  })
})
describe('equals', () => {
  const rules = {
    'AB': 2,
    'BC': 3,
    'AC': 7
  }
  test('1', () => {
    expect(
      equals(
        ['A','BCBC'],
        ['A','BCBC'],
        rules
      )
    ).toBeTruthy()
  })
  test('2', () => {
    expect(
      equals(
        ['CA','BCB'],
        ['CA','CBC'],
        rules
      )
    ).toBeTruthy()
  })
  test('3', () => {
    expect(
      equals(
        ['A','BCBC'],
        ['A','BCB'],
        rules
      )
    ).toBeFalsy()
  })
  test('4', () => {
    expect(
      equals(
        ['A','BCB'],
        ['ACA','BCB'],
        rules
      )
    ).toBeFalsy()
  })
  test('5', () => {
    expect(
      equals(
        ['A','CBC'],
        ['ACA','BCB'],
        rules
      )
    ).toBeFalsy()
  })
})
describe('equalsMulti', () => {
  const rules = {
    'AB': 2,
    'BC': 3,
    'AC': 7
  }
  test('1', () => {
    expect(
      equalsMulti(
        [
          ['CA','BCB'],
          ['C','BA']
        ],
        [
          ['CA','CBC'],
          ['A','BC']
        ],
        rules
      )
    ).toBeTruthy()
  })
  test('2', () => {
    expect(
      equalsMulti(
        [
          ['C','AB'],
          ['C','BA']
        ],
        [
          ['A','CB'],
          ['A','BC']
        ],
        rules
      )
    ).toBeFalsy()
  })
})
describe('generate', () => {
  const cs = initCoxeterSystem(5, 3)
  const generations = generate(cs, 30)

})