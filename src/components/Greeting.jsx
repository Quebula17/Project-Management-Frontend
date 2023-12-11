import React, {useContext} from "react";
import AuthContext from "../context/AuthContext";

const Greeting = () => {
  const {user} = useContext(AuthContext);

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="greeting">{greeting}, {user && user.first_name}!</div>
  )
}

export default Greeting;