import React, { useState, useEffect, startTransition } from "react";
import { useMoralis } from "react-moralis";
import { Modal, Card, Icon } from "web3uikit";

const User = ({ account }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const { Moralis } = useMoralis();

  useEffect(() => {
    const getBookings = async () => {
      const Bookings = Moralis.Object.extend("Bookings");
      const query = new Moralis.Query(Bookings);
      query.equalTo("booker", account);
      const result = await query.find();
      setUserBookings(result);
    };
    getBookings();
  }, []);

  return (
    <>
      <div onClick={() => setIsModalVisible(true)}>
        <Icon svg="user" size={24} fill="#000" />
      </div>
      <Modal
        isVisible={isModalVisible}
        title="Your Bookings"
        hasFooter={false}
        onCancel={() => setIsModalVisible(false)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {userBookings &&
            userBookings.map((e, i) => {
              return (
                <div key={i} style={{ width: "200px" }}>
                  <Card
                    title={e.attributes.city}
                    description={`${e.attributes.datesBooked[0]} for ${e.attributes.datesBooked.length} days`}
                  >
                    <div>
                      <img src={e.attributes.imageUrl} width="180px" />
                    </div>
                  </Card>
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
};

export default User;
