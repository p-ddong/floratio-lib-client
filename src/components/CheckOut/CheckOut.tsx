import React from "react";
import { useEffect, useState } from "react";
import PlantCard from "../Common/PlantCard/PlantCard";
import './CheckOut.scss'
export type Plant = {
  page: number;
  index: number;
  link: string;
  image: string;
  scientific_title: string;
  common_name: string;
};

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const CheckOut = () => {
  const [randomPlants, setRandomPlants] = useState<Plant[]>([]);
  useEffect(() => {
    fetch("/species_data_updated.json")
      .then((res) => res.json())
      .then((data: Plant[]) => {
        const random5 = getRandomItems(data, 5);
        setRandomPlants(random5);
        console.log(random5)
      });
  }, []);

  return (
    <div className="flex gap-2 justify-around checkout">
      <h1 className='text'>{`Check out these plants!`}</h1>
      <div className="flex gap-4">{randomPlants.map(plant=><PlantCard key={plant.scientific_title} plant={plant}/>)}
      </div>
    </div>
  );
};

export default CheckOut;
