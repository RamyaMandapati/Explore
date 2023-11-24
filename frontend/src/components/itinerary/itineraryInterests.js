import {
  faPersonHiking,
  faChampagneGlasses,
  faBuildingColumns,
  faTree,
  faBridge,
  faHouse,
  faMonument,
  faChildren,
  faUmbrellaBeach,
  faWaterLadder,
  faUtensils,
  faFish,
  faMusic,
  faWater,
  faIcons,
  faPersonBiking,
  faSailboat,
  faShip,
  faPersonDress,
  faCampground,
  faTransgender,
  faPerson,
  faBaby,
  faAnchor,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Icons from "@fortawesome/free-solid-svg-icons";

export const ItineraryInterests = ({ interests }) => {
  const availableInterests = {
    Hiking: <FontAwesomeIcon icon={faPersonHiking} />,
    Nightlife: <FontAwesomeIcon icon={faChampagneGlasses} />,
    Museum: <FontAwesomeIcon icon={faBuildingColumns} />,
    Park: <FontAwesomeIcon icon={faTree} />,
    Bridge: <FontAwesomeIcon icon={faBridge} />,
    Neighborhood: <FontAwesomeIcon icon={faHouse} />,
    Landmark: <FontAwesomeIcon icon={faMonument} />,
    "Kid-friendly": <FontAwesomeIcon icon={faChildren} />,
    Beach: <FontAwesomeIcon icon={faUmbrellaBeach} />,
    "Amusement Park": <FontAwesomeIcon icon={faWaterLadder} />,
    Restaurant: <FontAwesomeIcon icon={faUtensils} />,
    Fishing: <FontAwesomeIcon icon={faFish} />,
    Music: <FontAwesomeIcon icon={faMusic} />,
    Diving: <FontAwesomeIcon icon={faWater} />,
    Dancing: <FontAwesomeIcon icon={faIcons} />,
    "Mountain Biking": <FontAwesomeIcon icon={faPersonBiking} />,
    Rafting: <FontAwesomeIcon icon={faSailboat} />,
    Surfing: <FontAwesomeIcon icon={faShip} />,
    Camping: <FontAwesomeIcon icon={faCampground} />,
    Transgender: <FontAwesomeIcon icon={faTransgender} />,
    Male: <FontAwesomeIcon icon={faPerson} />,
    FeMale: <FontAwesomeIcon icon={faPersonDress} />,
    "Baby-friendly": <FontAwesomeIcon icon={faBaby} />,
  };
  const interestButtons =
    interests &&
    interests.map((interest) => {
      const iconComponent = availableInterests[interest];
      return (
        iconComponent && (
          <button key={interest} className="Interests-button">
            <div
              className="add-flex"
              style={{ gap: "4px", justifyContent: "center" }}
            >
              {iconComponent}
              <div style={{ fontWeight: "500" }}>{interest}</div>
            </div>
          </button>
        )
      );
    });

  return <>{interestButtons}</>;
};

export default ItineraryInterests;
