const base = 'http://localhost:3000';

const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;


export const getCars = async (page: number, limit = 7):
Promise<{items: {name: string, color: string, id: number}[], count: number}> => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);

  return {
    items: await response.json(),
    count: Number(response.headers.get('X-Total-Count')),
  };
}

export const getCar = async (id: number): Promise<{
  name: string,
  color: string,
  id: number
}> => (await fetch(`${garage}/${id}`)).json();

export const createCar = async (body: {name: string, color: string}):Promise<{
  name: string,
  color: string,
  id: number
}> => (await fetch(garage, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
  },
})).json();

export const deleteCar = async (id: number): Promise<void> =>
  (await fetch (`${garage}/${id}`, { method: 'DELETE'})).json();

export const updateCar = async (id: number, body: {name: string, color: string}): Promise<void> =>
  (await fetch(`${garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  })).json();

export const startEngine = async (id: number): Promise<{
  velocity: number,
  distance: number
}> =>
  (await fetch(`${engine}?id=${id}&status=started`)).json();

export const stopEngine = async (id: number): Promise<{
  velocity: number,
  distance: number
}> =>
  (await fetch(`${engine}?id=${id}&status=stopped`)).json();

export const drive = async (id: number): Promise<{success: boolean}> => {
  const res = await fetch(`${engine}?id=${id}&status=drive`).catch();
  return res.status !== 200 ? {success: false} : {...(await res.json())};
}

const getSortOrder = (sort: string, order: string): string => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return '';
}

export const getWinners = async ({ page, limit = 10, sort, order }: {
  page: number,
  limit: number
  sort: string,
  order: string}): Promise<{items: {id: number, wins: number, time: number, car:
{name: string, color: string, id: number }}[], count: number}> => {
  const response = await fetch(`${winners}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`);
  const items = await response.json();

  return {
    items: await Promise.all(items.map(async (winner: {id: number}) => ({ ...winner, car: await getCar(winner.id)}))),
    count: Number(response.headers.get('X-Total-Count')),
  }
}

export const getWinner = async (id: number | undefined): Promise<{
  id: number,
  wins: number,
  time: number
}> => (await fetch(`${winners}/${id}`)).json();

export const getWinnerStatus =
async (id: number | undefined): Promise<number> => (await fetch(`${winners}/${id}`)).status;

export const deleteWinner = async (id: number): Promise<void> =>
  (await fetch (`${winners}/${id}`, { method: 'DELETE'})).json();

export const createWinner = async (body: {
  id: number | undefined,
  wins: number,
  time: number,
}): Promise<void> => (await fetch(winners, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
  },
})).json();

export const updateWinner = async (id: number | undefined, body: {
  id: number | undefined,
  wins: number,
  time: number,
}): Promise<void> => (await fetch(`${winners}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
  },
})).json();

export const saveWinner =
async ({ name, color, id, time }: {name?: string, color?: string, id?: number, time: number}): Promise<void> => {
  const winnerStatus = await getWinnerStatus(id);

  if (winnerStatus === 404) {
    await createWinner({
      id,
      wins: 1,
      time,
    });
  } else {
    const winner = await getWinner(id);
    await updateWinner(id, {
      id,
      wins: winner.wins + 1,
      time: time < winner.time ? time : winner.time,
    });
  }
};