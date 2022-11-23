import { useEffect, useState } from 'react';

import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { FoodsContainer } from './styles';

interface FoodProps {
  id?: number,
  name?: string,
  description?: string,
  price?: string,
  available?: boolean,
  image?: string,
}

interface StateProps {
  foods: FoodProps[],
  editingFood: FoodProps,
  modalOpen: boolean,
  editModalOpen: boolean,
}

export default function Dashboard(): JSX.Element {

  const [ state, setState ] = useState<StateProps>({
    foods: [],
    editingFood: {},
    modalOpen: false,
    editModalOpen: false,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await api.get('/foods');
      setState(prevState => ({ ...prevState, foods: products.data }));
    }
    fetchProducts()
  }, [])

   const handleAddFood = async (food: FoodProps) => {
    const { foods } = state;

    try {
      const response = await api.post<FoodProps>('/foods', {
        ...food,
        available: true,
      });

      setState(prevState => ({ ...prevState, foods: [...foods, response.data] }));
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodProps) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put<FoodProps>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map((f: FoodProps) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState(prevState => ({ ...prevState, foods: foodsUpdated }));
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food: FoodProps) => food.id !== id);

    setState(prevState => ({ ...prevState, foods: foodsFiltered }));
  }

  const toggleModal = () => {
    const { modalOpen } = state;

    setState(prevState => ({ ...prevState, modalOpen: !modalOpen }));
  }

  const toggleEditModal = () => {
    const { editModalOpen } = state;

    setState(prevState => ({ ...prevState, editModalOpen: !editModalOpen }));
  }

  const handleEditFood = (food: FoodProps) => {
    setState(prevState => ({ ...prevState, editingFood: food, editModalOpen: true }));
  }

    const { modalOpen, editModalOpen, editingFood, foods } = state

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }
