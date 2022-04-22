import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { ConnectButton, Button, Icon, useNotification } from "web3uikit";
import Airbnb from "../utils/Airbnb.json";
import User from "../components/User";
import RentalsMap from "../components/RentalsMap";
import logo from "../images/airbnbRed.png";
import "../styles/Rentals.css";

const REACT_APP_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const AIRBNB = Airbnb;
const ADD_DATES_BOOKED = "addDatesBooked";

const Rentals = () => {
  const [rentalsList, setRentalsList] = useState();
  const [locations, setLocations] = useState();
  const [highlight, setHighlight] = useState();
  const { state: searchFilters } = useLocation();
  const { account, Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  useEffect(() => {
    const fetchRentalsList = async () => {
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);
      const result = await query.find();
      const locations = [];
      result.forEach((e) => {
        locations.push({ lat: e.attributes.lat, lng: e.attributes.long });
      });
      setRentalsList(result);
      setLocations(locations);
    };
    fetchRentalsList();
  }, [searchFilters]);

  const bookRental = async (id, start, end, pricePerDay) => {
    const newBookings = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      newBookings.push(new Date(dt).toISOString().slice(0, 10));
    }
    console.log(REACT_APP_CONTRACT_ADDRESS);
    console.log(AIRBNB);
    const options = {
      contractAddress: REACT_APP_CONTRACT_ADDRESS,
      functionName: ADD_DATES_BOOKED,
      abi: AIRBNB,
      params: {
        id,
        newBookings,
      },
      msgValue: Moralis.Units.ETH(pricePerDay * newBookings.length),
    };
    console.log(options);
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error.data.message);
      },
    });
  };

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      title: "Not Connected",
      message: "Please connect wallet first",
      position: "topL",
    });
  };

  const handleSuccess = () => {
    dispatch({
      type: "success",
      title: "Booking Successful",
      message: `Nice! You're going to ${searchFilters.destination}`,
      position: "topL",
    });
  };

  const handleError = (error) => {
    dispatch({
      type: "error",
      title: "Booking Failed",
      message: `${error}`,
      position: "topL",
    });
  };

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img src={logo} className="logo" alt="logo" />
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl" />
          <div className="filter">
            {`${searchFilters.checkIn.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkIn.toLocaleString("default", {
              day: "2-digit",
            })}
            -
            ${searchFilters.checkOut.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkOut.toLocaleString("default", {
              day: "2-digit",
            })}`}
          </div>
          <div className="vl" />
          <div className="filter">{searchFilters.guests} Guests</div>
          <div className="searchFiltersIcon">
            <Icon svg="search" size={20} fill="#fff" />
          </div>
        </div>
        <div className="lrContainers">
          {account && <User account={account} />}
          <ConnectButton />
        </div>
      </div>
      <hr className="line" />
      <div className="rentalsContent">
        <div className="rentalsContentL">
          Stays Available For Your Destination
          {rentalsList &&
            rentalsList.map((e, i) => {
              return (
                <>
                  <hr className="line2" />
                  <div className={highlight === i ? "rentalDivH" : "rentalDiv"}>
                    <img
                      className="rentalImg"
                      src={e.attributes.imgUrl}
                      alt={e.attributes.name}
                    ></img>
                    <div className="rentalInfo">
                      <div className="rentalTitle">{e.attributes.name}</div>
                      <div className="rentalDesc">
                        {e.attributes.unoDescription}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDescription}
                      </div>
                      <div className="bottomButton">
                        <Button
                          text="Stay Here"
                          onClick={() => {
                            if (account) {
                              bookRental(
                                e.attributes.uid_decimal.value.$numberDecimal,
                                searchFilters.checkIn,
                                searchFilters.checkOut,
                                Number(
                                  e.attributes.pricePerDay_decimal.value
                                    .$numberDecimal
                                )
                              );
                            } else {
                              handleNoAccount();
                            }
                          }}
                        />
                        <div className="price">
                          <Icon svg="matic" size={10} fill="#808080" />
                          {e.attributes.pricePerDay} / Day
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="rentalsContentR">
          {locations && (
            <RentalsMap locations={locations} setHighlight={setHighlight} />
          )}
        </div>
      </div>
    </>
  );
};

export default Rentals;
