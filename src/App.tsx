import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import cn from 'classnames';
import './App.scss';

interface Color {
  id: number;
  name: string;
}

interface GoodWithoutColor {
  id: number;
  name: string;
  colorId: number;
}

const colors: Color[] = [
  { id: 1, name: 'red' },
  { id: 2, name: 'green' },
  { id: 3, name: 'blue' },
];

interface Good extends GoodWithoutColor {
  color: Color | null;
}

const goodsFromServer: GoodWithoutColor[] = [
  { id: 1, colorId: 1, name: 'Dumplings' },
  { id: 2, colorId: 2, name: 'Carrot' },
  { id: 3, colorId: 3, name: 'Eggs' },
  { id: 4, colorId: 1, name: 'Ice cream' },
  { id: 5, colorId: 2, name: 'Apple' },
  { id: 6, colorId: 3, name: 'Bread' },
  { id: 7, colorId: 1, name: 'Fish' },
  { id: 8, colorId: 2, name: 'Honey' },
  { id: 9, colorId: 3, name: 'Jam' },
  { id: 10, colorId: 1, name: 'Garlic' },
];

const concatedGoods: Good[] = goodsFromServer.map((good) => ({
  ...good,
  color: colors.find((color) => color.id === good.colorId) || null,
}));

export const App = () => {
  const [goods, setGoods] = useState<Good[]>(concatedGoods);

  return (
    <div className="App">
      <h1>Add todo form</h1>
      <GoodForm
        colors={colors}
        onAddGood={(good) => {
          setGoods((prevState) => [...prevState, good]);
        }}
      />
      <GoodsList goods={goods} />
    </div>
  );
};

type GoodsListProps = {
  goods: Good[];
};

export const GoodsList = ({ goods }: GoodsListProps) => {
  return (
    <ul>
      {goods.map((good) => (
        <li key={good.id} style={{ color: good.color?.name }}>
          {good.name}
        </li>
      ))}
    </ul>
  );
};

type GoodFormProps = {
  colors: Color[];
  onAddGood: (good: Good) => void;
};

export const GoodForm = ({ colors, onAddGood }: GoodFormProps) => {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<Color | null>(null);
  const [hasColorError, setHasColorError] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
    setHasNameError(false);
  };

  const handleColorChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setColor(colors.find((v) => v.id === Number(e.target.value)) || null);
    setHasColorError(false);
  };

  const handleSubmit: FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (!name) {
      setHasNameError(true);
    }

    if (!color) {
      setHasColorError(true);
    }

    if (!name || !color) {
      return;
    }

    const good: Good = {
      id: new Date().getTime(),
      colorId: color.id,
      name,
      color,
    };

    onAddGood(good);

    setName('');
    setColor(null);
  };

  return (
    <form>
      <input
        value={name}
        onChange={handleChangeName}
        className={cn({ 'with-error': hasNameError })}
      />
      <select
        value={color?.id || 0}
        defaultValue={0}
        onChange={handleColorChange}
        className={cn({ 'with-error': hasColorError })}
      >
        <option value={0} disabled>
          Select Value
        </option>
        {colors.map((color) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </select>
      <button type="submit" onClick={handleSubmit}>
        Add
      </button>
    </form>
  );
};
