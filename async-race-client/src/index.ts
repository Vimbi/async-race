import "./style.scss";

import { render, listen, updateStateGarage } from './components/ui';

render();
await updateStateGarage();
listen();