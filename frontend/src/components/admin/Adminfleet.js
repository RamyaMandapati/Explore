import React, { useCallback } from "react";
import { Fragment, useState, useEffect,useRef } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { Card, Badge } from "react-bootstrap";
import {BsFillRecordFill} from "react-icons/bs";
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
import {getfleetDrones} from "../../actions/admin";
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
import './drone.css'
//AIzaSyCJtple6UfYFlqXNbvOsS2mSK6cz1WryAI
const  libraries = ["places"]
const mapContainerStyle = {
    marginTop: "100px",
    height: "90vh",
    width: "60vw",
  };
  const center = {
    lat: 37.338207,
    lng: -121.886330,
  };

export default function Adminfleet({ history }){
    const {plotdet1}=useSelector(state => state.plotsave)
    const {user} = useSelector(state=>state.auth)
    const {farmdetails} = useSelector(state=>state.farm)
    const userid = user && user._id
    const farmid = farmdetails && farmdetails._id
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = React.useState(null);
    const {fleetdrones} = useSelector(state=>state.dronedet)
    const [dronedt,setDronedt] = useState(0);
    const {isLoaded,loadError} = useLoadScript({
        googleMapsApiKey: 'AIzaSyCJtple6UfYFlqXNbvOsS2mSK6cz1WryAI',
        libraries
    })
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getfleetDrones())
      },[]);

     const onDronedetail = (drone_id) =>{
        history.push(`/Adminfleetdetail/${drone_id}`)
     }
    const onSubmit = () => {
      if (plotdet1){
      dispatch(plotinfo(userid,farmid,plotdet1.plotname,plotdet1.plot_type,plotdet1.plotimage,markers)).then(history.push('/Farmlandprofile'));
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
  }, [])
    if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
    return (
    <><><div className='adminhead'>
        <h6>Drone Tracking</h6>
        {/* <p id='sdrone'>Search drone by Region</p> */}
        <p id='sstatus'>Drone status</p>
        <BsFillRecordFill style={{color : '#00AC4F',position: 'absolute', left: '5.8%', top: '160px',bottom: '3px'}}/>
        <p style={{position: 'absolute', left: '7.35%', top: '155px',bottom: '3px'}}>Active</p>
        <BsFillRecordFill style={{color : '#FF0000',position: 'absolute', left: '16.00%', top: '160px',bottom: '3px'}}/>
        <p style={{position: 'absolute', left: '17.35%', top: '155px',bottom: '3px'}}>Stopped</p>
        <BsFillRecordFill style={{color : '#FBBC05',position: 'absolute', left: '26.34%', top: '160px',bottom: '3px'}}/>
        <p style={{position: 'absolute', left: '27.7%', top: '155px',bottom: '3px'}}>Connected, ready to do service</p>
        <BsFillRecordFill style={{color : '#5932EA',position: 'absolute', left: '48.34%', top: '160px',bottom: '3px'}}/>
        <p style={{position: 'absolute', left: '49.8%', top: '155px',bottom: '3px'}}>Registered, not connected</p>
      </div>

        <div>
            <><Search panTo={panTo}/>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} onClick={onMapClick} onLoad={onMapLoad}>
              {fleetdrones && fleetdrones.map(marker => <Marker position={{ lat: marker.lat, lng: marker.lng }} style={{ backgroundColor: 'red' }} onClick={() => {
                setSelected(marker);
              } }
                icon={{
                  url: `https://res.cloudinary.com/dj3in4dua/image/upload/v1670382110/qrz6ri3wvf0o5ajsrujq.svg`,
                  fillColor: '#34495e',
                  fillOpacity: 1,
                  strokeColor: '#000',
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                  scaledSize: new window.google.maps.Size(40, 40),
                }} />)}

              {selected ? (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => {
                    setSelected(null);
                  } }
                >
                  <div>
                    <h2>Farm selected</h2>
                    <p>Spotted {formatRelative(selected.time, new Date())}</p>
                  </div>
                </InfoWindow>
              ) : null}

            </GoogleMap></>
        </div></>
        
        <div className='dronecardet' >
        {fleetdrones && fleetdrones.map((fldronedet) => (
        <Card style={{ width: '18rem', margin:'20px 0'}} onClick= {() => onDronedetail(fldronedet.droneid)}>
      <Card.Body>
        <img variant="top" src={fldronedet.image} alt='no found' height='70' width='80'/>
        <Card.Text>
          Drone ID #{fldronedet.droneid}
        </Card.Text>
        <Card.Text>
        {fldronedet.dronename}
        </Card.Text>
        <Card.Text>
          {fldronedet.status === 'active' ? <Badge bg="success">{fldronedet.status}</Badge>:
          <div>
          {fldronedet.status === 'booked' ? <Badge bg="warning">{fldronedet.status}</Badge>:
          <div>
          {fldronedet.status === 'disconnected' ? <Badge bg="danger">{fldronedet.status}</Badge>: <Badge bg="primary">{fldronedet.status}
          </Badge>}</div>}
          </div>
          }
        </Card.Text>
      </Card.Body>
      
</Card>
        ))}
</div>
        </>
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
        <div className="searchdrone">
          <Combobox onSelect={handleSelect}>
            <ComboboxInput
              value={value}
              onChange={handleInput}
              disabled={!ready}
              placeholder="Search your drones location"
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