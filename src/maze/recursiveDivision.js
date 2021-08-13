import _ from "lodash";

let walls;

export function getRecursiveDivisionNodes(grid) {
  const { startNode, finishNode } = getStartFinishNode(grid);
  let vertical = _.range(1, grid[0].length - 1);
  let horizontal = _.range(1, grid.length - 1);

  walls = [];
  getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode);
  const wallNodes = [];
  getBorderWalls(grid, wallNodes);
  getWallNodes(grid, wallNodes);
  return wallNodes;
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode) {
  if (vertical.length < 2 || horizontal.length < 2) {
    return;
  }
  let dir;
  let num;
  if (vertical.length > horizontal.length) {
    dir = 0;
    num = generateOddRandomNumber(vertical);
  }
  if (vertical.length <= horizontal.length) {
    dir = 1;
    num = generateOddRandomNumber(horizontal);
  }

  if (dir === 0) {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical.slice(0, vertical.indexOf(num)),
      horizontal,
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical.slice(vertical.indexOf(num) + 1),
      horizontal,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function addWall(dir, num, vertical, horizontal, startNode, finishNode) {
  let isStartFinish = false;
  let tempWalls = [];
  if (dir === 0) {
    if (horizontal.length === 2) return;
    for (let temp of horizontal) {
      if (
        (temp === startNode.row && num === startNode.col) ||
        (temp === finishNode.row && num === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([temp, num]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temp of vertical) {
      if (
        (num === startNode.row && temp === startNode.col) ||
        (num === finishNode.row && temp === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([num, temp]);
    }
  }
  if (!isStartFinish) {
    tempWalls.splice(generateRandomNumber(tempWalls.length), 1);
  }
  for (let wall of tempWalls) {
    walls.push(wall);
  }
}

function generateOddRandomNumber(array) {
  let max = array.length - 1;
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return array[randomNum];
}

function getStartFinishNode(grid) {
  let startNode;
  let finishNode;

  for (const row of grid) {
    for (const node of row) {
      if (node.start) startNode = node;
      if (node.finish) finishNode = node;
    }
  }

  return { startNode, finishNode };
}

function generateRandomNumber(max) {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
}

function getBorderWalls(grid, nodes) {
  for (let i = 0; i < grid[0].length; i++) {
    const first = grid[0][i];
    const newfirst = { ...first, wall: true };
    nodes.push(newfirst);

    const last = grid[grid.length - 1][i];
    const newlast = { ...last, wall: true };
    nodes.push(newlast);
  }

  for (let i = 0; i < grid.length; i++) {
    const first = grid[i][0];
    const newfirst = { ...first, wall: true };
    nodes.push(newfirst);

    const last = grid[i][grid[0].length - 1];
    const newlast = { ...last, wall: true };
    nodes.push(newlast);
  }
}

function getWallNodes(grid, nodes) {
  for (let index = 0; index < walls.length; index++) {
    const [row, col] = walls[index];
    const node = grid[row][col];
    const newNode = { ...node, wall: true };
    nodes.push(newNode);
  }
}
