import Card from "../../shared/components/UIElements/Card";
import UserItem from "./UserItem";
import "./UserList.css";
const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h1>No Users Found</h1>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((item) => (
        <UserItem
          key={item.id}
          id={item.id}
          image={item.image}
          name={item.name}
          placeCount={item.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
