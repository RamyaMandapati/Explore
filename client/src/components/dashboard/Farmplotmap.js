import React, { useCallback } from "react";
import { Fragment, useState, useEffect,useRef } from 'react';
import { useSelector,useDispatch } from "react-redux";
import {loadUser} from '../../actions/auth';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polyline
} from "@react-google-maps/api";
import { plotinfo } from "../../actions/farm";
import { formatRelative } from "date-fns";
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import "@reach/combobox/styles.css";
import {getplots} from '../../actions/farm';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";

//AIzaSyCJtple6UfYFlqXNbvOsS2mSK6cz1WryAI
const  libraries = ["places"]
const mapContainerStyle = {
    marginTop: "20px",
    height: "80vh",
    width: "90vw",
  };
  const center = {
    lat: 37.338207,
    lng: -121.886330,
  };
 
  
export default function Farmplotmap({ history }){
    const {plotdet1}=useSelector(state => state.plotsave)
    const {user} = useSelector(state=>state.auth)
    const {farmdetails} = useSelector(state=>state.farm)
    const userid = user && user._id
    const farmid = farmdetails && farmdetails._id
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = React.useState(null);
    const {isLoaded,loadError} = useLoadScript({
        googleMapsApiKey: 'AIzaSyCJtple6UfYFlqXNbvOsS2mSK6cz1WryAI',
        libraries
    })
    const dispatch = useDispatch();

    const onSubmit = () => {
      if (plotdet1){
      dispatch(plotinfo(userid,farmid,plotdet1.plotname,plotdet1.plot_type,plotdet1.plotimage,markers)).then(()=> dispatch(getplots(userid))).then(history.push('/Farmlandprofile'));
      }
      else{
        history.push("/Farmplotinfo")
      }
          
  };  
const onMapClick = useCallback((e) => {
    console.log(e)
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);
  console.log(markers)
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4,
  };
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
    if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
    return (
    <><div className='styleh1'>
            <h1>Plot selection</h1>
        </div><div>
        {/* <Locate panTo={panTo} /> */}
      <Search panTo={panTo} />
      <div className="plt_btn">
				<Button variant="primary" onClick={() => onSubmit()} style={{backgroundColor:'#1A3447'}}>Add Plot Boundaries</Button>	
			</div>
                <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} onClick=
                {onMapClick} onLoad={onMapLoad}>
                 {markers.map(marker => <Marker  position={{ lat: marker.lat, lng: marker.lng }} onClick={() => {
              setSelected(marker);
            }}/>)}   

{selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => {
                setSelected(null);
              }}
          >
            <div>
              <h2>Farm selected</h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
        <Polyline
                path={markers}
                geodesic={true}
                options={{
                    strokeColor: "#ff2527",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                   
                }}
            />
                </GoogleMap>
            </div></>
    );
}



  function Locate({ panTo }) {
    return (
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        Compass
      </button>
    );
  }
  

function Search({ panTo }) {
     const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 10 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };
    return (
        <div className="search">
          <Combobox onSelect={handleSelect}>
            <ComboboxInput
              value={value}
              onChange={handleInput}
              disabled={!ready}
              placeholder="Search your farm location"
            />
            <ComboboxPopover>
              <ComboboxList>
                {status === "OK" &&
                  data.map(({ id, description }) => (
                    <ComboboxOption key={id} value={description} />
                  ))}
              </ComboboxList>
            </ComboboxPopover>
          </Combobox>
        </div>
      );
    }