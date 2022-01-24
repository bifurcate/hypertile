// class Word {
//   data: string;
//   constructor(data = '') {
//     this.data = data
//   }
//   canonicalize() {
//     return
//   }
// }

// class CoxeterMatrix {
//   data: number[][];
//   constructor(data: number[][]) {
//     this.data = data
//   }
// }

// class CoxeterPresentation {
//   matrix: CoxeterMatrix;
//   generators: string[];
//   constructor(matrix: CoxeterMatrix, generators: string[]) {
//     this.matrix =  matrix;
//     this.generators = generators;
//   }
// }

// function buildExpandedRelation(generatorPair: string[2], power: number) {
//   let s = ''
//   for(let i = 0; i < power; i++) { s = s + generatorPair }
//   return s
// }

// function reduceWord1(word: string, generatorPair: string[2], power: number) {
//   const relation = buildExpandedRelation(generatorPair, power)
//   let end = word.slice(word.length - relation.length)
//   if (end === relation) {
//     return word.slice(0, word.length - relation.length)
//   } else {
//     return word
//   }
// }

// function reduceWord(word) {
//   reduceWord1(word, 'aa', 1)
//   reduceWord1(word, 'bb', 1)
//   reduceWord1(word, 'cc', 1)
//   reduceWord1(word, 'ab', 2)
//   reduceWord1(word, 'bc', 3)
//   reduceWord1(word, 'ac', 7)
// }


// export function generate() {
//   const maxLen = 5;
//   const generators: string[] = ['a','b','c'];
//   let words: string[] = [''];
//   let active: string[] = [''];

//   generators.forEach((g) => tips.push(g));
//   generators.forEach((g) => words.push(g));

//   let c = 1;
//   while(c < maxLen) {
//     tips = tips.map((w) => generators.map((g) => w.concat(g))).flat();
//     tips = tips.filter((w) => !(words.includes(reduceWord(w))))
//     words = words.concat(tips);
//     c++;
//   }
//   console.log(words);
//   console.log(reduceWord('123aa') in ['123'])
// }

// const table = {
//   'ab': 2,
//   'bc': 3,
//   'ca': 7,
// }

// function generate2() {
  
//   const maxLen = 6
//   const generators = ['a', 'b', 'c']
//   let all = ['ab', 'bc', 'ca']
//   let active = all.slice()

//   while(true) {
//     for (const word in active) {
//       let end = word.slice(word.length - 2)
//       end 
//     }
//   }
  

// }