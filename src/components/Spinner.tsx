import pokeball from "../assets/pokeball.png";
import "../spinner.css"; // Import the CSS file

export const Spinner = () => {
  return (
    <div className="spinner">
      <img
        src={pokeball}
        alt="Loading..."
        style={{
          height: "10em",
        }}
      />
    </div>
  );
};
