class Graph {
  constructor(nCell, rounds) {
    this.n = Math.pow(2, Number(nCell));
    this.zeroes = new Array(Number(nCell)).fill('0');
    this.nodes = new Array(this.n);
    this.matrix = new Array(this.n);
    this.list = new Array(this.n);
    this.rounds = rounds;
    for (let i = 0; i < this.nodes.length; i++) {
      this.matrix[i] = new Array(this.n).fill(0);
      this.list[i] = new Array();
    }
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i] = this.toMerlin(i);
      for (let j = 0; j < this.rounds.length; j++) {
        const newNodeNum = this.toNumber(
          this.applyRound(this.nodes[i], this.rounds[j]),
        );
        this.matrix[i][newNodeNum] = 1;
        this.list[i].push(newNodeNum);
      }
    }
  }
  applyRound(toApply, round) {
    const merlin = [...toApply];
    for (let i = 0; i < merlin.length; i++) {
      merlin[i] = Number(merlin[i]) ^ Number(round[i]);
    }
    return merlin;
  }
  toNumber(merlin) {
    return parseInt(merlin.join(''), 2);
  }
  toMerlin(number) {
    const tmpArr = number.toString(2).split('');
    // console.log(this.zeroes.slice(0, this.zeroes.length - tmpArr.length));
    return this.zeroes
      .slice(0, this.zeroes.length - tmpArr.length)
      .concat(tmpArr);
  }
  get winCondition() {
    switch (Math.log2(this.n)) {
      case 4:
        return [0, 0, 1, 0];
      case 9:
        return [0, 0, 0, 0, 0, 0, 1, 0, 0];
    }
  }
  bfs(source, target) {
    const queue = [source];
    const visited = {};
    visited[source] = true;
    while (queue.length) {
      console.log('visited arr', visited);
      if (queue[0] === target) return true;
      for (let i = 0; i < this.matrix[queue[0]].length; i++) {
        if (this.matrix[queue[0]][i] && !visited[i]) {
          queue.push(i);
          visited[i] = true;
        }
      }
      queue.shift();
    }
    return false;
  }
  bfsTracert(initial, target) {
    const queue = [initial];
    const visited = {};
    visited[initial] = initial;
    while (queue.length) {
      // console.log('visited', visited);
      if (queue[0] === target) {
        const findPath = (src, visited, arr = []) => {
          if (src === visited[src]) {
            arr.push(src);
            return arr;
          }
          findPath(visited[src], visited, arr).push(src);
          return arr;
        };
        const findPathES6 = src => {
          // equivalente a função findPath, porém com elementos especificos do Javascript
          console.log(src, visited);
          if (src === visited[src]) {
            return [src];
          }
          return [...findPathES6(visited[src]), src];
        };
        // const resultedPath = findPath(queue[0], visited);
        const resultedPath = findPathES6(queue[0]);
        return console.log(resultedPath);
      }
      for (let i = 0; i < this.matrix[queue[0]].length; i++) {
        if (this.matrix[queue[0]][i] && !visited[i]) {
          queue.push(i);
          visited[i] = queue[0];
        }
      }
      queue.shift();
    }
    return false;
  }
}

const container = new Array(10);
const DP = new Array(10);
let active = null;

// const obj = new Graph(4, [
//   [1, 1, 0, 0],
//   [0, 0, 1, 1],
//   [1, 0, 1, 0],
//   [0, 1, 0, 1],
// ]);

// console.log(obj.nodes);
// console.log(obj.toNumber(obj.nodes[2]));
// console.log(obj.toMerlin(4));
// console.log(obj.rounds);
// console.log(obj.matrix);
// console.log(obj.list);
// console.log(obj.list);
