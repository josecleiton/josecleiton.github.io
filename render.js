function draw() {
  const matrix = container[active].matrix;
  // console.log(matrix);
  const board = cleanBoard();
  const containerSigma = document.createElement('div');
  containerSigma.setAttribute('id', 'sigma');
  containerSigma.style.height = '85%';
  board.appendChild(containerSigma);
  const graph = {
    nodes: [],
    edges: [],
  };
  for (let i = 0; i < matrix.length; i++) {
    const theta = ((2 * Math.PI) / matrix.length) * (matrix.length - i + 1);
    // console.log(theta);
    graph.nodes.push({
      id: `n${i}`,
      label: `Node ${i + 1}`,
      x: Math.cos(theta),
      y: Math.sin(theta),
      size: 1,
      color: '#111',
    });
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        graph.edges.push({
          id: `e${i}-${j}`,
          source: `n${i}`,
          target: `n${j}`,
          size: 0.5,
          color: '#AAA',
        });
      }
    }
  }
  console.log(graph);
  const s = new sigma({graph, container: containerSigma});
}

function cleanBoard() {
  const board = document.getElementById('board');
  if (board) {
    while (board.firstChild) board.removeChild(board.firstChild);
  }
  return board;
}

async function nCellHandler() {
  const selIn = document.getElementById('sel');
  const board = cleanBoard();
  const selected = selIn.selectedIndex;
  if (!selected) return;
  const opt = selIn.options[selected].value;
  // console.log(opt);
  if (!container[opt]) {
    container[opt] = new Graph(opt, [
      [1, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 1],
    ]);
  }
  active = opt;
  const graphInst = container[opt];
  // pathToWin(graphInst);
  const captionText = document.createElement('p');
  captionText.innerHTML = 'Legenda:';
  const caption = document.createElement('div');
  caption.id = 'caption';
  for (let i = 0; i < 2; i++) {
    const captionBox = document.createElement('div');
    const text = document.createElement('p');
    const box = document.createElement('div');
    captionBox.className = 'caption';
    text.innerHTML = `${i}`;
    box.className = 'caption-box';
    box.style.background = i ? 'green' : 'blue';
    captionBox.appendChild(text);
    captionBox.appendChild(box);
    caption.appendChild(captionBox);
  }
  board.appendChild(captionText);
  board.appendChild(caption);
  const mySel = document.createElement('select');
  mySel.appendChild(document.createElement('option'));
  mySel.onchange = moveHandler;
  const allGraph = document.createElement('button');
  allGraph.innerHTML = 'Draw graph!';
  allGraph.onclick = draw;
  allGraph.style.marginLeft = '7.5%';
  board.appendChild(mySel);
  board.appendChild(allGraph);
  for (let i = 0; i < graphInst.n; i++) {
    const optionEl = document.createElement('option');
    optionEl.value = optionEl.innerHTML = i.toString();
    // console.log(optionEl);
    mySel.appendChild(optionEl);
  }

  console.log(container);
}

function moveHandler(e) {
  const {srcElement: selEl} = e;
  // console.log(selEl);
  const board = document.getElementById('board');
  const containerEl = document.createElement('div');
  while (containerEl.lastChild) containerEl.removeChild(containerEl.lastChild);
  containerEl.id = 'container';
  const opt = selEl.options[selEl.selectedIndex].value;
  const selectedRelations = container[active].matrix[opt];
  const nextMoves = new Array();
  selectedRelations.forEach((item, idx) => {
    item && nextMoves.push(idx);
  });
  // console.log(nextMoves);
  // selEl.style.gridTemplate;
  let gridTemplate = '';
  for (let i = 0; i < Math.sqrt(Math.log2(selectedRelations.length)); i++) {
    gridTemplate += '25px ';
  }
  // console.log('container div colum template:', gridTemplate);
  const matrixGenerator = node => {
    const matrixContainerEl = document.createElement('div');
    matrixContainerEl.style.display = 'grid';
    matrixContainerEl.className = 'matrix';
    matrixContainerEl.style.gridTemplateColumns = gridTemplate;
    for (let j = 0; j < node.length; j++) {
      const cellEl = document.createElement('div');
      cellEl.setAttribute('class', 'cell');
      cellEl.style.background = Number(node[j]) ? 'green' : 'blue';
      matrixContainerEl.appendChild(cellEl);
    }
    return matrixContainerEl;
  };
  const messageEl = document.createElement('p');
  messageEl.innerHTML = `${opt}.`;
  containerEl.appendChild(messageEl);
  containerEl.appendChild(matrixGenerator(container[active].nodes[opt]));
  for (let i = 0; i < nextMoves.length; i++) {
    const matrixContainerEl = document.createElement('div');
    matrixContainerEl.style.display = 'grid';
    matrixContainerEl.style.gridTemplateColumns = gridTemplate;
    const node = container[active].nodes[nextMoves[i]];
    console.log(node);
    containerEl.appendChild(matrixGenerator(node));
  }
  board.appendChild(containerEl);
}

// async function pathToWin(graph) {
//   const winCondition = graph.toNumber(graph.winCondition);
//   const {matrix} = graph;
//   const attempts = 5;
//   const showResult = (graph, dp) => {
//     for (let i = 0; i < graph.n; i++) {
//       if (i !== winCondition)
//         console.log(
//           `caminho de ${i} para winCondition com ${attempts - 1} lances:`,
//           dp[i][winCondition][attempts - 1],
//         );
//     }
//   };
//   if (DP[Math.log2(graph.n)]) {
//     console.log(DP[Math.log2(graph.n)]);
//     return;
//   }
//   const dp = new Array(graph.n);
//   for (let i = 0; i < graph.n; i++) {
//     dp[i] = new Array(graph.n);
//     for (let j = 0; j < dp[i].length; j++) {
//       dp[i][j] = new Array(attempts);
//     }
//   }
//   const shortestPath = async (graph, attempts) => {
//     const N = graph.length;
//     for (let at = 0; at < attempts; at++) {
//       for (let i = 0; i < N; i++) {
//         for (let j = 0; j < N; j++) {
//           dp[i][j][at] = Infinity;
//           if (!at && i === j) dp[i][j][at] = 0;
//           if (at === 1 && graph[i][j]) {
//             dp[i][j][at] = graph[i][j];
//           }
//           if (at > 1) {
//             for (let node = 0; node < N; node++) {
//               if (
//                 graph[i][node] &&
//                 i !== node &&
//                 j !== node &&
//                 dp[i][j][at - 1] !== Infinity
//               )
//                 dp[i][j][at] = Math.min(
//                   dp[i][j][at],
//                   graph[i][node] + dp[node][j][at - 1],
//                 );
//             }
//           }
//         }
//       }
//     }
//   };
//   await shortestPath(matrix, attempts);
//   showResult(graph, dp);
//   DP[Math.log2(graph.n)] = dp;
//   console.log(DP);
// }
