import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { characters, period_month } from '../utils/constants';
import { HeroInfo, Character } from '../utils/types';

const AboutMe: React.FC = () => {
  const [hero, setHero] = useState<HeroInfo | null>(null);
  const { heroId } = useParams<{ heroId: string }>();
  console.log('Current heroId:', heroId);

  useEffect(() => {
    // определение выбранного heroId или используем 'luke' по умолчанию
    const selectedHeroId = heroId && characters[heroId] ? heroId : 'luke';
    const localStorageKey = selectedHeroId;

    // проверка данных в localStorage
    const cachedHero = localStorage.getItem(localStorageKey);
    if (cachedHero) {
      const parsedHero = JSON.parse(cachedHero);
      if ((Date.now() - parsedHero.time) < period_month) {
        setHero(parsedHero.payload);
        return; 
      }
    }

    // данные о выбранном герое
    const heroData: Character | undefined = characters[selectedHeroId];
    if (!heroData) {
      console.error(`Hero with id "${selectedHeroId}" not found. Falling back to Luke Skywalker.`);
      setHero(getDefaultHeroInfo());
      return;
    }

    // функция для получения данных о герое
    const fetchHeroData = async () => {
      try {
        const response = await fetch(heroData.url);
        if (!response.ok) {
          throw new Error(`Network response was not ok for heroId: ${selectedHeroId}`);
        }
        const data = await response.json();
        const info: HeroInfo = {
          name: data.name,
          gender: data.gender,
          birth_year: data.birth_year,
          height: data.height,
          mass: data.mass,
          hair_color: data.hair_color,
          skin_color: data.skin_color,
          eye_color: data.eye_color
        };
        setHero(info);
        // сохранение в localStorage под ключом heroId
        localStorage.setItem(localStorageKey, JSON.stringify({
          time: Date.now(),
          payload: info
        }));
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // при ошибки, отображаем информацию о Люке 
        setHero(getDefaultHeroInfo());
      }
    };

    fetchHeroData();

    return () => console.log(`Component AboutMe was unmounted`);
  }, [heroId]);

  // Функция для получения информации о Люке Скайвоккере
  const getDefaultHeroInfo = (): HeroInfo => {
    const luke = characters['luke'];
    return {
      name: luke.name,
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue'
    };
  };

  return (
    <>
      {hero && (
        <div className='text-3xl leading-loose text-justify tracking-widest ml-8'>
          {Object.entries(hero).map(([key, value]) => (
            <p key={key}>
              <span className='text-[1.5em] capitalize'>{key.replace('_', ' ')}:</span> {value}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export default AboutMe;
