import { animation, race, getDistanceBetweenElements, generateRandomCars } from './utils';
import store from './store';
import { getCar, getCars, deleteCar, startEngine, stopEngine, updateCar,
  drive, getWinners, deleteWinner, saveWinner, createCar } from './api';

let selectedCar: {
  name: string,
  color: string,
  id: number
} | null = null;

const renderCarImage = (color: string) => `
<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 457.947 457.947" style="enable-background:new 0 0 457.947 457.947;" xml:space="preserve">
<g fill='${color}'>
	<path d="M457.505,242.363c-0.041-0.805-0.323-1.579-0.811-2.221c-1.436-1.888-36.362-46.238-139.103-46.238
		c-1.622,0-3.215,0.001-4.809,0.003l-67.067-36.41c-1.519-0.825-3.398-0.58-4.655,0.607s-1.608,3.049-0.871,4.613l14.806,31.42
		c-28.785,0.128-53.541,0.099-76.028-0.88l5.623-23.549c0.273-1.146,0.028-2.353-0.67-3.301c-0.698-0.948-1.779-1.541-2.955-1.619
		l-14.563-0.971c-1.478-0.095-2.907,0.638-3.683,1.912l-3.096,5.089c-29.336,0.358-43.674,10.594-48.353,14.831
		c-2.134-0.433-7.153-1.471-7.536-1.446c-3.037,0.203-74.72,5.31-102.657,35.242c-0.717,0.768-1.104,1.787-1.075,2.837l0.97,35.92
		c0.042,1.551,0.978,2.938,2.4,3.559l37.859,16.51c0.435,0.19,0.9,0.301,1.375,0.327l4.521,0.254
		c7.319,13.157,21.362,22.082,37.455,22.082c14.356,0,27.076-7.106,34.852-17.978l206.261,1.478
		c7.847,10.033,20.052,16.5,33.746,16.5c13.695,0,25.899-6.467,33.746-16.5c0,0,9.134,0.019,10.995,0.019
		c4.647,0,13.767-0.107,23.065-0.816c20.824-1.587,29.586-4.933,30.242-11.542C458.489,262.199,457.545,243.169,457.505,242.363z
		 M434.882,231.579l-5.994,1.35c-4.094,0.922-8.274,0.152-11.771-2.168c-3.497-2.32-5.832-5.872-6.574-10.002l-0.456-2.535
		c4.214,1.765,7.977,3.545,11.288,5.268C426.66,226.242,431.139,228.999,434.882,231.579z M252.63,170.354l43.452,23.59
		c-9.083,0.031-30.314,0.141-32.264,0.151L252.63,170.354z M269.761,202.065c5.677-0.03,11.429-0.06,17.311-0.086
		c1.851,1.627,6.378,6.297,9.539,15.352c6.525,18.696,2.534,41.89-2.386,58.996l-94.419-0.496
		c-13.834-13.436-30.552-33.74-34.316-56.084c-1.547-9.184-0.369-15.818,0.557-19.158
		C195.667,202.447,228.737,202.278,269.761,202.065z M168.291,171.961l7.417,0.495l-4.871,20.398
		c-4.98-0.277-9.857-0.609-14.647-1.003L168.291,171.961z M125.83,185.653c5.697-2.725,15.098-5.875,28.821-6.662l-7.329,12.046
		c-8.615-0.875-16.994-1.978-25.255-3.375C123.168,187.008,124.415,186.33,125.83,185.653z M53.86,208.959l-9.886,5.233
		l-19.658-1.982c6.766-3.571,14.302-6.53,21.97-8.977L53.86,208.959z M84.582,292.935c-19.208,0-34.835-15.627-34.835-34.835
		s15.627-34.835,34.835-34.835c19.208,0,34.835,15.627,34.835,34.835S103.791,292.935,84.582,292.935z M123.847,275.195
		c2.291-5.241,3.57-11.02,3.57-17.096c0-23.619-19.216-42.835-42.835-42.835c-23.619,0-42.835,19.216-42.835,42.835
		c0,4.34,0.654,8.53,1.86,12.481l-32.615-14.223H26.33c2.209,0,4-1.791,4-4c0-2.209-1.791-4-4-4H8.708l-0.664-24.611
		c1.616-1.613,3.389-3.146,5.291-4.603c0,0,31.307,3.15,31.441,3.15c0.65,0,1.293-0.159,1.871-0.465l16.505-8.738
		c1.209-0.64,2.007-1.852,2.116-3.215c0.109-1.363-0.484-2.687-1.575-3.511l-7.834-5.923c22.663-6.024,44.138-7.921,47.849-8.215
		c17.602,3.912,35.252,6.325,54.197,7.795c-2.66,11.23-4.122,39.188,30.586,75.748L123.847,275.195z M359.442,292.935
		c-19.208,0-34.835-15.627-34.835-34.835s15.627-34.835,34.835-34.835c19.208,0,34.835,15.627,34.835,34.835
		S378.65,292.935,359.442,292.935z M401.09,276.435h-2.945c2.645-5.562,4.131-11.777,4.131-18.335
		c0-23.619-19.216-42.835-42.835-42.835c-23.619,0-42.835,19.216-42.835,42.835c0,6.558,1.486,12.773,4.131,18.335l-18.215-0.064
		c11.556-41.856,2.553-64.162-4.823-74.432c6.422-0.021,13.023-0.034,19.89-0.034c36.67,0,64.144,5.957,83.763,12.943l1.317,7.327
		c1.132,6.298,4.691,11.715,10.025,15.253c3.862,2.563,8.272,3.885,12.783,3.885c1.716,0,3.447-0.191,5.168-0.579l12.513-2.818
		c3.294,2.815,5.397,5.03,6.418,6.184c0.11,2.535,0.332,8.328,0.365,14.312h-20.699c-2.209,0-4,1.791-4,4c0,2.209,1.791,4,4,4
		h20.597c-0.061,1.65-0.149,3.195-0.276,4.549C446.494,274.254,424.141,276.795,401.09,276.435z"/>
	<path d="M359.442,230.662c-15.129,0-27.438,12.308-27.438,27.438c0,15.129,12.309,27.438,27.438,27.438
		c15.129,0,27.438-12.308,27.438-27.438C386.879,242.971,374.571,230.662,359.442,230.662z M359.442,277.537
		c-10.718,0-19.438-8.72-19.438-19.438s8.72-19.438,19.438-19.438c10.718,0,19.438,8.72,19.438,19.438
		S370.16,277.537,359.442,277.537z"/>
	<path d="M84.582,230.662c-15.129,0-27.438,12.308-27.438,27.438c0,15.129,12.309,27.438,27.438,27.438
		c15.129,0,27.438-12.308,27.438-27.438C112.02,242.971,99.711,230.662,84.582,230.662z M84.582,277.537
		c-10.718,0-19.438-8.72-19.438-19.438s8.72-19.438,19.438-19.438c10.718,0,19.438,8.72,19.438,19.438S95.3,277.537,84.582,277.537z
		"/>
	<path d="M177.787,219.381h17.476c2.209,0,4-1.791,4-4c0-2.209-1.791-4-4-4h-17.476c-2.209,0-4,1.791-4,4
		C173.787,217.59,175.578,219.381,177.787,219.381z"/>
</g>
</svg>
`;

const renderCar = ({ id, name, color}: {id: number, name: string, color: string,}) => `
  <div class="general-buttons">
    <button class="button select-button" id="select-car-${id}">Select</button>
    <button class="button remove-button" id="remove-car-${id}">Remove</button>
    <span class="car-name">${name}</span>
  </div>
  <div class="road">
    <div class="launch-pad">
      <div class="control-panel">
        <button class="icon start-engine-button" id="start-engine-car-${id}">Start</button>
        <button class="icon stop-engine-button" id="stop-engine-car-${id}" disabled>Stop</button>
      </div>
      <div class="car" id="car-${id}">
        ${renderCarImage(color)}
      </div>
    </div>
    <div class="flag" id="flag-${id}">🚩</div>
  </div>
`;

const renderGarage = () => `
  <h1>Garage (${store.carsCount})</h1>
  <h2>Page #${store.carsPage}</h2>
  <ul class="garage">
    ${store.cars.map(car => `
      <li>${renderCar(car)}</li>
    `).join('')}
  </ul>
`;

const renderWinners = () => `
  <h1>Winners (${store.winnersCount})</h1>
  <h2>Page #${store.winnersPage}</h2>
  <table class="table" cellspasing="0" border="0" cellpadding="0">
    <thead>
      <th>Number</th>
      <th>Car</th>
      <th>Name</th>
      <th class="table-button table-wins ${store.sort === 'wins' ? store.sortOrder : ''}" id="sort-by-wins">Wins</th>
      <th class="table-button table-time ${store.sort === 'time' ?
    store.sortOrder : ''}" id="sort-by-time">Best time (seconds)</th>
    </thead>
    <tbody>
      ${store.winners.map((winner, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${renderCarImage(winner.car.color)}</td>
          <td>${winner.car.name}</td>
          <td>${winner.wins}</td>
          <td>${winner.time}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;

export const render = async (): Promise<void> => {
  const html = `
    <div class="menu">
      <button class="button garage-menu-button primary" id="garage-menu">To garage</button>
      <button class="button winners-menu-button primary" id="winners-menu">To winners</button>
    </div>
    <div id="garage-view">
      <div>
        <form class="form" id="create">
          <input class="input" id="create-name" name="name" type="text">
          <input class="color" id="create-color" name="color" type="color" value="#ffffff">
          <button class="button" type="submit">Create</button>
        </form>
        <form class="form" id="update">
          <input class="input" id="update-name" name="name" type="text" disabled>
          <input class="color" id="update-color" name="color" type="color" value="#ffffff" disabled>
          <button class="button" id="update-submit" type="submit">Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="button race-button primary" id="race">Race</button>
        <button class="button reset-button primary" id="reset">Reset</button>
        <button class="button generator-button" id="generator">Generate cars</button>
      </div>
      <div id="garage">
        ${renderGarage()}
      </div>
      <div>
        <p class="message" id="message"></p>
      </div>
    </div>
    <div id="winners-view" style="display: none">
      ${renderWinners()}
    </div>
    <div class="pagination">
      <button class="button primary prev-button" disabled id="prev">Prev</button>
      <button class="button primary next-button" disabled id="next">Next</button>
    </div>
  `;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
};

export const updateStateGarage = async (): Promise<void> => {
  const { items, count } = await getCars(store.carsPage);
  store.cars = items;
  store.carsCount = count;

  if (store.carsPage * 7 < store.carsCount) {
    (<HTMLButtonElement>document.getElementById('next')).disabled = false;
  } else {
    (<HTMLButtonElement>document.getElementById('next')).disabled = false;
  }
  if (store.carsPage > 1) {
    (<HTMLButtonElement>document.getElementById('prev')).disabled = false;
  } else {
    (<HTMLButtonElement>document.getElementById('prev')).disabled = true;
  }
};

export const updateStateWinners = async (): Promise<void> => {
  const { items, count } =
  await getWinners({ page: store.winnersPage, limit: 10, sort: store.sort, order: store.sortOrder });

  store.winners = items;
  store.winnersCount = count;

  if (store.winnersPage * 10 < store.winnersCount) {
    (<HTMLButtonElement>document.getElementById('next')).disabled = false;
  } else {
    (<HTMLButtonElement>document.getElementById('next')).disabled = true;
  }
  if (store.winnersPage > 1) {
    (<HTMLButtonElement>document.getElementById('prev')).disabled = false;
  } else {
    (<HTMLButtonElement>document.getElementById('prev')).disabled = true;
  }
};

const startDriving = async (id: number): Promise<{ success: boolean, id: number, time: number }> => {
  const startButton = document.getElementById(`start-engine-car-${id}`);
  (<HTMLButtonElement>startButton).disabled = true;
  (<HTMLButtonElement>startButton).classList.toggle('enabling', true);

  const { velocity, distance } = await startEngine(id);
  const time = Math.round(distance / velocity);

  (<HTMLButtonElement>startButton).classList.toggle('enabling', false);
  (<HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`)).disabled = false;

  const car = document.getElementById(`car-${id}`);
  const flag = document.getElementById(`flag-${id}`);
  const htmlDistance =
  Math.floor(getDistanceBetweenElements((<HTMLButtonElement>car), (<HTMLButtonElement>flag))) + 50;

  store.animation[id] = animation((<HTMLButtonElement>car), htmlDistance, time);

  const { success } = await drive(id);
  if (!success) window.cancelAnimationFrame(store.animation[id].id);

  return { success, id, time };
};

const stopDriving = async (id: number) => {
  const stopButton = document.getElementById(`stop-engine-car-${id}`);
  (<HTMLButtonElement>stopButton).disabled = true;
  (<HTMLButtonElement>stopButton).classList.toggle('enabling', true);
  await stopEngine(id);
  (<HTMLButtonElement>stopButton).classList.toggle('enabling', false);
  (<HTMLButtonElement>document.getElementById(`start-engine-car-${id}`)).disabled = false;

  const car = document.getElementById(`car-${id}`);
  if (car) car.style.transform = `translateX(0)`;
  if (store.animation[id]) window.cancelAnimationFrame(store.animation[id].id);
};

const setSortOrder = async (sort: string) => {
  store.sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
  store.sort = sort;

  await updateStateWinners();
  (<HTMLButtonElement>document.getElementById('winners-view')).innerHTML = renderWinners();
};

export const listen = (): void => {
  document.body.addEventListener('click', async (event) => {
    if ((<HTMLButtonElement>event.target).classList.contains('start-engine-button')) {
      const id = +(<HTMLButtonElement>event.target).id.split('start-engine-car-')[1];
      startDriving(id);
    }
    if ((<HTMLButtonElement>event.target).classList.contains('stop-engine-button')) {
      const id = +(<HTMLButtonElement>event.target).id.split('stop-engine-car-')[1];
      stopDriving(id);
    }
    if ((<HTMLButtonElement>event.target).classList.contains('select-button')) {
      selectedCar = await getCar(+(<HTMLButtonElement>event.target).id.split('select-car-')[1]);
      (<HTMLInputElement>document.getElementById('update-name')).value = selectedCar.name;
      (<HTMLInputElement>document.getElementById('update-color')).value = selectedCar.color;
      (<HTMLInputElement>document.getElementById('update-name')).disabled = false;
      (<HTMLInputElement>document.getElementById('update-color')).disabled = false;
      (<HTMLButtonElement>document.getElementById('update-submit')).disabled = false;
    }
    if ((<HTMLButtonElement>event.target).classList.contains('remove-button')) {
      const id = +(<HTMLButtonElement>event.target).id.split('remove-car-')[1];
      await deleteCar(id);
      await deleteWinner(id);
      await updateStateGarage();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
    }
    if ((<HTMLButtonElement>event.target).classList.contains('generator-button')) {
      (<HTMLButtonElement>event.target).disabled = true;
      const cars = generateRandomCars();
      await Promise.all(cars.map(async c => createCar(c)));
      await updateStateGarage();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      (<HTMLButtonElement>event.target).disabled = false;
    }

    if ((<HTMLButtonElement>event.target).classList.contains('race-button')) {
      (<HTMLButtonElement>event.target).disabled = true;
      const winner = await race(startDriving);
      await saveWinner(winner);
      const message = document.getElementById('message');
      (<HTMLElement>message).innerHTML = `${winner.name} won (${winner.time}s)!`;
      (<HTMLElement>message).classList.toggle('visible', true);
      (<HTMLButtonElement>document.getElementById('reset')).disabled = false;
    }
    if ((<HTMLButtonElement>event.target).classList.contains('reset-button')) {
      (<HTMLButtonElement>event.target).disabled = true;
      store.cars.map(({ id }) => stopDriving(id));
      const message = document.getElementById('message');
      message?.classList.toggle('visible', false);
      (<HTMLButtonElement>document.getElementById('race')).disabled = false;
    }
    if ((<HTMLButtonElement>event.target).classList.contains('prev-button')) {
      switch(store.view) {
        case 'garage': {
          store.carsPage--;
          await updateStateGarage();
          (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
          break;
        }
        case 'winners': {
          store.winnersPage--;
          await updateStateWinners();
          (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
          break;
        }
        default:
      }
    }
    if ((<HTMLButtonElement>event.target).classList.contains('next-button')) {
      switch(store.view) {
        case 'garage': {
          store.carsPage++;
          await updateStateGarage();
          (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
          break;
        }
        case 'winners': {
          store.winnersPage++;
          await updateStateWinners();
          (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
          break;
        }
        default:
      }
    }
    if ((<HTMLButtonElement>event.target).classList.contains('garage-menu-button')) {
      (<HTMLElement>document.getElementById('garage-view')).style.display = 'block';
      (<HTMLElement>document.getElementById('winners-view')).style.display = 'none';
      store.view = 'garage';
    }
    if ((<HTMLButtonElement>event.target).classList.contains('winners-menu-button')) {
      (<HTMLElement>document.getElementById('winners-view')).style.display = 'block';
      (<HTMLElement>document.getElementById('garage-view')).style.display = 'none';
      await updateStateWinners();
      (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
      store.view = 'winners';
    }
    if ((<HTMLElement>event.target).classList.contains('table-wins')) {
      setSortOrder('wins');
    }
    if ((<HTMLElement>event.target).classList.contains('table-time')) {
      setSortOrder('time');
    }
  });

  (<HTMLFormElement>document.getElementById(('create'))).addEventListener('submit', async (event) => {
    event.preventDefault();
    const car = {
      name: (<HTMLInputElement>document.getElementById('create-name')).value,
      color: (<HTMLInputElement>document.getElementById('create-color')).value
    };
    await createCar(car);
    await updateStateGarage();
    (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
    (<HTMLInputElement>document.getElementById('create-name')).value = '';
    (<HTMLFormElement>event.target).disabled = true;
  });

  (<HTMLFormElement>document.getElementById(('update'))).addEventListener('submit', async (event) => {
    event.preventDefault();
    const car = {
      name: (<HTMLInputElement>document.getElementById('update-name')).value,
      color: (<HTMLInputElement>document.getElementById('update-color')).value
    };
    if (selectedCar) await updateCar(selectedCar.id, car);
    await updateStateGarage();
    (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
    (<HTMLInputElement>document.getElementById('update-name')).value = '';
    (<HTMLInputElement>document.getElementById('update-name')).disabled = true;
    (<HTMLInputElement>document.getElementById('update-color')).disabled = true;
    (<HTMLButtonElement>document.getElementById('update-submit')).disabled = true;
    (<HTMLInputElement>document.getElementById('update-color')).value = '#ffffff';
    selectedCar = null;
  });
};