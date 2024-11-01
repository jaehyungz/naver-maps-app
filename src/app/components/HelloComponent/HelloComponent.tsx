import React, { useEffect, useState } from "react";

interface Props {}

function HelloComponent(props: Props) {
  const {} = props;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://dummyjson.com/users");
      const data = await res.json();
      console.log(data);
      setUsers(data.users);
    };

    fetchData();
  }, []);

  return (
    <div>
      {users.map((item: any) => {
        return (
          <div key={item.id}>
            <span>{item.id}</span>
            <span>
              {item.firstName} {item.lastName}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default HelloComponent;
