"use client";

import React from "react";
import "./styles.scss";
import icon from "../../assest/icon/leaf.png";
import Image from "next/image";
import { Button } from "@chakra-ui/react";
import {
  VscHome,
  VscAccount,
  VscSearch,
} from "react-icons/vsc";
import { PiTreeBold } from "react-icons/pi";
import Dock, { DockItemData } from "../Bits/Dock/Dock";
import { useRouter } from "next/navigation";


const Header = () => {
  const router = useRouter();
  const handleClick = (pushto:string) => {
    router.push(pushto);
  };
  const items: DockItemData[] = [
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => handleClick("/"),
    },
    {
      icon: <PiTreeBold size={18} />,
      label: "All Species",
      onClick: () => handleClick("/plants"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Contact",
      onClick: () => alert("Contact!"),
    },
    {
      icon: <VscSearch size={18} />,
      label: "Search",
      onClick: () => alert("Search!"),
    },
  ];

  return (
    <div className="header">
      <div className="logo">
        <Image src={icon} alt="Leaf icon" width={50} height={50} />
        <h1>Floratio Lib</h1>
      </div>

      <Dock
        className="dock"
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />

      <div className="user">
        <Button className="button log" bgColor={"white"} onClick={()=>handleClick('/login')}>
          Login
        </Button>
        <Button className="button res" bgColor={"white"} onClick={()=>handleClick('/register')}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default Header;
