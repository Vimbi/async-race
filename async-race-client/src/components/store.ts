import { getCars, getWinners } from './api';

const { items: cars, count: carsCount } = await getCars(1);
const { items: winners, count: winnersCount} = await getWinners({ page: 1, limit: 10, sort: '', order: '' });


export default ({
  carsPage: 1,
  cars,
  carsCount,
  winnersPage: 1,
  winners,
  winnersCount,
  animation: {},
  view: 'garage',
  sort: '',
  sortOrder: '',
} as {
  carsPage: number,
  cars: {name: string, color: string, id: number}[],
  carsCount: number,
  winnersPage: number,
  winners: {
    id: number;
    wins: number;
    time: number;
    car: {
      name: string;
      color: string;
      id: number;
    };
  }[],
  winnersCount: number,
  animation: Record<string,Record<string,number>>,
  view: string,
  sort: string,
  sortOrder: string
})