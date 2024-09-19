/*
  Utility function to generate a random number in a given range
*/
const getRandomNumber = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
  Generate grid items for background grid spanning around main grid.
*/
const generateBackgroundGrid = () => {
  const backgroundGridSize = 20; // rows & cols
  const posterGridSize = 10; // rows & cols
  const backgroundGridElement = document.getElementsByClassName('background-grid')[0];

  const getRandomColor = () => {
    // adding green multiple times to increase odds of it appearing
    const colors = ['pink', 'black', 'white', 'green', 'green', 'green', 'green', 'green'];
    return `var(--color-${colors[getRandomNumber(0, colors.length - 1)]})`;
  }

  const isWithinPoster = (row, col) => {
    // posterGridSize + 2 because poster has one grid line space around it
    const gridDifference = ((backgroundGridSize) - (posterGridSize + 2)) / 2;
    return (
      (col >= gridDifference && col < backgroundGridSize - gridDifference) &&
      (row >= gridDifference && row < backgroundGridSize - gridDifference)
    );
  }

  for (let row = 0; row < backgroundGridSize; row++) {
    for (let col = 0; col < backgroundGridSize; col++) {
      if (!isWithinPoster(row, col)) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('background-grid-item');
        gridItem.style.gridArea = `${row + 1} / ${col + 1}`;
        gridItem.style.borderColor = getRandomColor();
        backgroundGridElement.appendChild(gridItem);
      }
    }
  }
}

/*
  Take existing main grid items and transform html to accomodate 3d transformations.
  Also algorithmically color in grid items.
*/
const transformGridItems = () => {
  const gridItems = document.getElementsByClassName('grid-item');

  function getGridItemColor(i) {
    if (i % 5 === 0) return 'black';
    if (i % 3 === 0) return 'green';
    if (i % 2 === 0) return 'pink';

    return 'white';
  }

  Array.from(gridItems).forEach((element, i) => {
    const sceneClasses = Array.from(element.classList).filter(c => c.startsWith('span'));
    const gridItemClasses = Array.from(element.classList).filter(c => !c.startsWith('span'));

    const gridItemScene = document.createElement('div');
    gridItemScene.classList.add('grid-item-scene');
    sceneClasses.forEach(c => gridItemScene.classList.add(c));

    const gridItemInner = document.createElement('div');
    gridItemInner.classList.add('grid-item-inner');

    const gridItem = document.createElement('div');
    gridItemClasses.forEach(c => gridItem.classList.add(c));
    gridItem.innerHTML = element.innerHTML;
    gridItem.style.backgroundColor = `var(--color-${getGridItemColor(i + 1)})`;

    const gridItemBackside = document.createElement('div');
    gridItemBackside.classList.add('grid-item-backside');

    gridItemInner.appendChild(gridItem);
    gridItemInner.appendChild(gridItemBackside);
    gridItemScene.appendChild(gridItemInner);
    element.replaceWith(gridItemScene);
  });
}

// /*
//   Trigger animations on grid items
// */
// const animateGridItems = () => {
//   const gridItems = document.getElementsByClassName('grid-item-inner');

//   Array.from(gridItems).forEach((element, i) => {
//     setTimeout(() => element.classList.add('flipped'), 20 * i);
//   });
// }

generateBackgroundGrid();
transformGridItems();
// animateGridItems();