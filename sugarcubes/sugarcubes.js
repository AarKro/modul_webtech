/*
  Utility functions
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
  const getGridItemColor = (i) => {
    if (i % 5 === 0) return 'black';
    if (i % 3 === 0) return 'green';
    if (i % 2 === 0) return 'pink';

    return 'white';
  }

  const gridItems = document.getElementsByClassName('grid-item');

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

    // assign color if not already specified
    if (!gridItemClasses.some(element => ['pink', 'white', 'green', 'black'].includes(element))) {
      gridItem.classList.add(getGridItemColor(i + 1));
    }

    const gridItemBackside = document.createElement('div');
    gridItemBackside.classList.add('grid-item-backside');

    gridItemInner.appendChild(gridItem);
    gridItemInner.appendChild(gridItemBackside);
    gridItemScene.appendChild(gridItemInner);
    element.replaceWith(gridItemScene);
  });
}

/*
  Trigger animations on grid items
*/
const animateGridItems = () => {
  const gridItemsDOM = document.getElementsByClassName('grid-item-inner');
  const gridItems = Array.from(gridItemsDOM);

  // make items appear and expand
  gridItems.forEach((element, i) => {
    setTimeout(() => {
      if (!element.firstChild.classList.contains('title')) {
        element.classList.add('flipped');
      }

      setTimeout(() => {
        if (element.parentElement.classList.contains('span-2')) {
          element.classList.add('expand');
        }
      }, 600);
    }, i * 20);
  });

  // make items move around to available whitespace
  setTimeout(() => {
    // get all grid items which have a whitespace right afterwards
    const gridItemsWithSpace = Array.from(document.querySelectorAll('.grid-item-scene:has(+ .grid-item-scene .grid-item.white):not(:has(+ .grid-item-scene .grid-item.title), .span-2)'));
    
    const gridItemAnimationLoop = () => {
      const randomGridItem = gridItemsWithSpace[getRandomNumber(0, gridItemsWithSpace.length - 1)];
      
      randomGridItem.style.zIndex = 3;
      randomGridItem.style.transition = 'transform .2s ease-in-out';
      
      if (randomGridItem.style.transform.startsWith('translateX')) {
        // move back
        randomGridItem.style.transform = 'translate(0)';
      } else {
        // move forward
        randomGridItem.style.transform = 'translateX(calc(var(--grid-item-size) + var(--grid-gap)))';
      }

      setTimeout(() => gridItemAnimationLoop(), getRandomNumber(500, 2000));
    }

    gridItemAnimationLoop();
  }, 2200);
}

generateBackgroundGrid();
transformGridItems();
animateGridItems();