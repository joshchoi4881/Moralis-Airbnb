// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Airbnb {
    uint256 private counter;
    uint256[] public rentalIds;
    struct rentalInfo {
        uint256 id;
        address renter;
        string name;
        string city;
        string lat;
        string long;
        string unoDescription;
        string dosDescription;
        string imgUrl;
        uint256 maxGuests;
        uint256 pricePerDay;
        string[] datesBooked;
    }
    mapping(uint256 => rentalInfo) rentals;
    address public owner;
    event rentalCreated(
        uint256 id,
        address renter,
        string name,
        string city,
        string lat,
        string long,
        string unoDescription,
        string dosDescription,
        string imgUrl,
        uint256 maxGuests,
        uint256 pricePerDay,
        string[] datesBooked
    );
    event newDatesBooked(
        uint256 id,
        address booker,
        string[] datesBooked,
        string city,
        string imgUrl
    );

    constructor() {
        counter = 0;
        owner = msg.sender;
    }

    function getRental(uint256 id)
        public
        view
        returns (
            string memory,
            uint256,
            string[] memory
        )
    {
        require(id < counter, "No such Rental");
        rentalInfo storage s = rentals[id];
        return (s.name, s.pricePerDay, s.datesBooked);
    }

    function addRentals(
        string memory name,
        string memory city,
        string memory lat,
        string memory long,
        string memory unoDescription,
        string memory dosDescription,
        string memory imgUrl,
        uint256 maxGuests,
        uint256 pricePerDay,
        string[] memory datesBooked
    ) public {
        require(
            msg.sender == owner,
            "Only owner of smart contract can put up rentals"
        );
        rentalIds.push(counter);
        rentalInfo storage newRental = rentals[counter];
        newRental.id = counter;
        newRental.renter = owner;
        newRental.name = name;
        newRental.city = city;
        newRental.lat = lat;
        newRental.long = long;
        newRental.unoDescription = unoDescription;
        newRental.dosDescription = dosDescription;
        newRental.imgUrl = imgUrl;
        newRental.maxGuests = maxGuests;
        newRental.pricePerDay = pricePerDay;
        newRental.datesBooked = datesBooked;
        emit rentalCreated(
            counter,
            owner,
            name,
            city,
            lat,
            long,
            unoDescription,
            dosDescription,
            imgUrl,
            maxGuests,
            pricePerDay,
            datesBooked
        );
        counter++;
    }

    function checkBookings(uint256 id, string[] memory newBookings)
        private
        view
        returns (bool)
    {
        for (uint256 i = 0; i < newBookings.length; i++) {
            for (uint256 j = 0; j < rentals[id].datesBooked.length; j++) {
                if (
                    keccak256(abi.encodePacked(rentals[id].datesBooked[j])) ==
                    keccak256(abi.encodePacked(newBookings[i]))
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    function addDatesBooked(uint256 id, string[] memory newBookings)
        public
        payable
    {
        require(id < counter, "No such Rental");
        require(
            checkBookings(id, newBookings),
            "Already Booked For Requested Date"
        );
        require(
            msg.value ==
                (rentals[id].pricePerDay * 1 ether * newBookings.length),
            "Please submit the asking price in order to complete the purchase"
        );
        for (uint256 i = 0; i < newBookings.length; i++) {
            rentals[id].datesBooked.push(newBookings[i]);
        }
        payable(owner).transfer(msg.value);
        emit newDatesBooked(
            id,
            msg.sender,
            newBookings,
            rentals[id].city,
            rentals[id].imgUrl
        );
    }
}
