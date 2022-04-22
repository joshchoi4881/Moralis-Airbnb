import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ConnectButton,
  Select,
  DatePicker,
  Input,
  Button,
  Icon,
} from "web3uikit";
import logo from "../images/airbnb.png";
import bg from "../images/frontpagebg.png";
import "../styles/Home.css";

const Home = () => {
  const [destination, setDestination] = useState("New York");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [guests, setGuests] = useState(2);

  return (
    <>
      <div className="container" style={{ backgroundImage: `url(${bg})` }}>
        <div className="containerGradient"></div>
      </div>
      <div className="topBanner">
        <div>
          <img src={logo} className="logo" alt="logo" />
        </div>
        <div className="tabs">
          <div className="selected">Places To Stay</div>
          <div>Experiences</div>
          <div>Online Experiences</div>
        </div>
        <div className="lrContainers">
          <ConnectButton />
        </div>
      </div>
      <div className="tabContent">
        <div className="searchFields">
          <div className="inputs">
            Location
            <Select
              defaultOptionIndex={0}
              options={[
                { id: "ny", label: "New York" },
                { id: "lon", label: "London" },
                { id: "db", label: "Dubai" },
                { id: "la", label: "Los Angeles" },
              ]}
              onChange={(data) => setDestination(data.label)}
            />
          </div>

          <div className="vl" />
          <div className="inputs">
            Check In
            <DatePicker id="CheckIn" onChange={(e) => setCheckIn(e.date)} />
          </div>
          <div className="vl" />
          <div className="inputs">
            Check Out
            <DatePicker id="CheckOut" onChange={(e) => setCheckOut(e.date)} />
          </div>
          <div className="vl" />
          <div className="inputs">
            Guests
            <Input
              name="AddGuests"
              type="number"
              value={2}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
          <Link
            to={"/rentals"}
            state={{ destination, checkIn, checkOut, guests }}
          >
            <div className="searchButton">
              <Icon svg="search" size={24} fill="#fff" />
            </div>
          </Link>
        </div>
      </div>
      <div className="randomLocation">
        <div className="title">Feel Adventurous</div>
        <div className="text">
          Let us decide and discover new places to stay, live, work, or just
          relax.
        </div>
        <Button
          text="Explore A Location"
          onClick={() => console.log(checkOut)}
        />
      </div>
    </>
  );
};

export default Home;
