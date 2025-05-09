import { Plant } from "@/components/CheckOut/CheckOut";
import { CldImage } from "next-cloudinary";
import React from "react";
import './PlantCard.scss'
type Props = {
  plant: Plant;
};

const PlantCard = ({ plant }: Props) => {

  return (
    <div className="plant_card">
      <CldImage
      className="img"
        alt=""
        src={plant.image}
        width="200" 
        height="230"
        crop={{
          type: "auto",
          source: true,
        }}
      />
      <h1>{plant.scientific_title}</h1>
    </div>
  );
};

export default PlantCard;
