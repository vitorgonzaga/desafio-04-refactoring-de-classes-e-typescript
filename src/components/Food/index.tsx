import { useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import api from '../../services/api';
import { Container } from './styles';

export interface FoodInterface {
  id: string,
  name: string,
  image: string,
  description: string,
  price: string,
  available: boolean
}

interface FoodProps {
  food: FoodInterface,
  handleEditFood: (food: FoodInterface) => void,
  handleDelete: (id: string) => void

}

export default function Food(props: FoodProps): JSX.Element {

    const { available } = props.food;

    const [ state, setState ] = useState({
      isAvailable: available
    })


  const toggleAvailable = async () => {
    const { food } = props;
    const { isAvailable } = state;

    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !isAvailable,
    });

    setState({ isAvailable: !isAvailable });
  }

  const setEditingFood = () => {
    const { food, handleEditFood } = props;

    handleEditFood(food);
  }

    const { isAvailable } = state;
    const { food, handleDelete } = props;

    return (
      <Container available={isAvailable}>
        <header>
          <img src={food.image} alt={food.name} />
        </header>
        <section className="body">
          <h2>{food.name}</h2>
          <p>{food.description}</p>
          <p className="price">
            R$ <b>{food.price}</b>
          </p>
        </section>
        <section className="footer">
          <div className="icon-container">
            <button
              type="button"
              className="icon"
              onClick={setEditingFood}
              data-testid={`edit-food-${food.id}`}
            >
              <FiEdit3 size={20} />
            </button>

            <button
              type="button"
              className="icon"
              onClick={() => handleDelete(food.id)}
              data-testid={`remove-food-${food.id}`}
            >
              <FiTrash size={20} />
            </button>
          </div>

          <div className="availability-container">
            <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

            <label htmlFor={`available-switch-${food.id}`} className="switch">
              <input
                id={`available-switch-${food.id}`}
                type="checkbox"
                checked={isAvailable}
                onChange={toggleAvailable}
                data-testid={`change-status-food-${food.id}`}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
      </Container>
    );
};
