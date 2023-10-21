import "./Login.css";
export const Preferences = ({ history }) => {
  return (
    <>
      <div className="pref-cont">
        <div className="pref-heading">
          <h3>Add your Preferences</h3>
          <h4> Please select atleast one</h4>
        </div>
        <div className="pref-button">
          {Array.from({ length: 20 }, (_, index) => (
            <button key={index} type="submit" className="pref-plan-button">
              Mountains
            </button>
          ))}
        </div>
        <button
          className="planbutton planbutton1"
          style={{ width: "120px", marginTop: "0px" }}
        >
          Next
        </button>
      </div>
    </>
  );
};
export default Preferences;
