'use client';
import * as S from './style';
import { results } from '../../types/types';
import { Like, Delete } from '@/assets';
import { useState, useLayoutEffect } from 'react';
import { Button } from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import {
  setFavorites,
  deleteFavorites
} from '../../store/slices/charactersSlice';
import { setSelectChar } from '@/store/slices/charactersSlice';
import { deleteCharacters } from '@/store/slices/charactersSlice';
import { useLazyGetSelectCharQuery } from '@/store/services/selectCharService';
import { addDeleteList } from '@/store/slices/charactersSlice';
import { deleteCard } from '@/helpers/deleteCard';
export const ItemCharacter = (props: results) => {
  const { id, image, name } = props;

  const [fetchData] = useLazyGetSelectCharQuery();

  const favorites = useSelector(
    (state: RootState) => state.charactersReducer.favoriteChar
  );
  const characters = useSelector(
    (state: RootState) => state.charactersReducer.allChar
  );

  const isFilter = useSelector(
    (state: RootState) => state.charactersReducer.filter
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const [isLike, setLike] = useState(false);

  const handleFavorites = () => {
    if (!favorites.map((el: results) => el.id).includes(id)) {
      setLike((prev) => !prev);
      dispatch(setFavorites(props));
    } else {
      const newArr = favorites.filter((el: results) => el.id !== id);
      console.log(newArr);
      dispatch(deleteFavorites(newArr));
      setLike((prev) => !prev);
    }
  };

  const handleDeleteCard = () => {
    if (!isFilter) {
      dispatch(deleteFavorites(deleteCard(id, favorites, undefined)));
      dispatch(deleteCharacters(deleteCard(id, characters, undefined)));

      dispatch(addDeleteList(deleteCard(id, undefined, characters)));
    } else {
      dispatch(deleteFavorites(deleteCard(id, favorites, undefined)));
      dispatch(deleteCharacters(deleteCard(id, characters, undefined)));

      dispatch(addDeleteList(deleteCard(id, undefined, favorites)));
    }
  };

  const handleShowCharacter = (event: React.FormEvent<HTMLElement>) => {
    const target = event.target as HTMLButtonElement;
    fetchData(target.id).then((res) => {
      dispatch(setSelectChar([res.data]));
      router.push(target.id);
    });
  };

  useLayoutEffect(() => {
    const favorId = favorites.map((el) => el.id);
    if (favorId.includes(id)) {
      setLike(true);
    }
  }, [characters, favorites, id]);

  return (
    <S.Wrapper id={id}>
      <S.Box>
        <S.Img src={image} alt={name} id={id} onClick={handleShowCharacter} />
        <S.H2>{name}</S.H2>
        <S.IconBox>
          <Button
            style={{
              cursor: 'pointer',
              background: 'transparent',
              border: 'none'
            }}
            onClick={handleFavorites}
          >
            {!isLike && !isFilter ? (
              <Like fillColor2="gray" />
            ) : (
              <Like fillColor2="red" />
            )}
          </Button>
          <Button onClick={handleDeleteCard} style={{ cursor: 'pointer' }}>
            <Delete />
          </Button>
        </S.IconBox>
      </S.Box>
    </S.Wrapper>
  );
};
