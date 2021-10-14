import store from './store'

function getPositionAtCenter(element: HTMLElement) {
  const {top, left, width, height} = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2
  };
}

export function getDistanceBetweenElements(a: HTMLElement, b: HTMLElement): number {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.sqrt((aPosition.x - bPosition.x) ** 2 + (aPosition.y - bPosition.y) ** 2);
}

export function animation (car: HTMLElement, distance: number, animationTime: number): Record<string,number> {
  let start: number | null = null;
  const state: Record<string,number> = {};

  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const passed = Math.round(time * (distance / animationTime));

    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }

  state.id = window.requestAnimationFrame(step);

  return state;
}

export const raceAll =
async (promises: Promise<{ success: boolean, id: number, time: number }>[], ids: number[]):
Promise<{name?: string, color?: string, id?: number, time: number}> => {
  const { success, id, time } = await Promise.race(promises);

  if (!success) {
    const failedIndex = ids.findIndex(i => i === id);
    const restPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
    return raceAll(restPromises, restIds);
  }

  return {...store.cars.find(car => car.id === id), time: +(time / 1000).toFixed(2)};
}

export const race = async (action: (id: number) => Promise<{ success: boolean, id: number, time: number }>):
Promise<{name?: string, color?: string, id?: number, time: number}> => {
  const promises = store.cars.map(({ id }) => action(id));

  const winner = await raceAll(promises, store.cars.map(car => car.id));

  return winner;
};

const models = ['Lada', 'UAZ', 'Chevrolet', 'Toyota', 'Renault', 'Fiat', 'Kia', 'Hyundai', 'VW'];
const names = ['Vesta', 'Patriot', 'Camaro', 'Corolla', 'Megan', 'Noname', 'Spectra', 'Solaris', 'Polo'];

const getRandomName = () => {
  const model = models[Math.floor(Math.random() * models.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return `${model} ${name}`;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const generateRandomCars = (count = 100): {name: string, color:string}[] =>
  new Array(count).fill(1).map(x => ({name: getRandomName(), color: getRandomColor()}));