import React, { useCallback } from "react";
import { Fragment, useState, useEffect,useRef } from 'react';
import { useSelector,useDispatch } from "react-redux";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polyline
} from "@react-google-maps/api";
import {getfleetDronesdetail} from "../../actions/admin";
import { plotinfo } from "../../actions/farm";
import { formatRelative } from "date-fns";
import { Row, Col, Form, Button, Spinner,Card, Badge } from 'react-bootstrap';
import "@reach/combobox/styles.css";
import {getfleetDrones} from "../../actions/admin";
import { useParams} from "react-router-dom";
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
    marginTop: "30px",
    height: "80vh",
    width: "90vw",
  };
  const center = {
    lat: 37.5583819,
    lng: -122.0481118,
  };

export default function Adminfleetdetail({ history }){
    const {plotdet1}=useSelector(state => state.plotsave)
    const {user} = useSelector(state=>state.auth)
    const {farmdetails} = useSelector(state=>state.farm)
    const userid = user && user._id
    const farmid = farmdetails && farmdetails._id
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = React.useState(null);
    const {fleetdrones} = useSelector(state=>state.dronedet)
    const {isLoaded,loadError} = useLoadScript({
        googleMapsApiKey: 'AIzaSyCJtple6UfYFlqXNbvOsS2mSK6cz1WryAI',
        libraries
    })
    const dispatch = useDispatch();
    let {droneid} = useParams();
    useEffect(()=>{
        dispatch(getfleetDronesdetail(droneid))
      },[]);

    const {fleetdronedet} = useSelector(state=>state.dronedet)
    const status1 = fleetdronedet && fleetdronedet.status
    const dronedetails = fleetdronedet && fleetdronedet.dronedetails[0]
    const dronetrackdet = fleetdronedet && fleetdronedet.dronetrackdet
    const onSubmitback =() =>
    {
      history.push('/Adminfleet')
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
  }, []);
    if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
    return (
    <><><div className='styleh1'>
      
      </div>
      <div className='dronecardhead'>
      <h6>Admin Fleet Statstics</h6>
          <p>Selected DroneID #{fleetdronedet && dronedetails && dronedetails.droneid}</p>
        </div>
        
        <div className='dronecardetail'>
            <Card style={{ width: '18rem', margin: '20px 0' }} >
              <Card.Body>
                <img variant="top" src={fleetdronedet && dronedetails && dronedetails.image} alt='no found' height='100' width='120' />
                <Card.Text>
                  Drone ID #{fleetdronedet && dronedetails && dronedetails.droneid}
                </Card.Text>
                <Card.Text>
                  {fleetdronedet && dronedetails && dronedetails.dronename}
                </Card.Text>
                <Card.Text>
                  {fleetdronedet && fleetdronedet.status === 'active' ? <Badge bg="success">{fleetdronedet && fleetdronedet.status}</Badge> :
                    <div>
                      {fleetdronedet && fleetdronedet.status === 'booked' ? <Badge bg="warning">{fleetdronedet && fleetdronedet.status}</Badge> :
                        <div>
                          {fleetdronedet && fleetdronedet.status === 'disconnected' ? <Badge bg="danger">{fleetdronedet && fleetdronedet.status}</Badge> : <Badge bg="primary">{fleetdronedet && fleetdronedet.status}
                          </Badge>}</div>}
                    </div>}
                </Card.Text>
              </Card.Body>

            </Card>
        </div>
      <div>
          {/* <Locate panTo={panTo} />
          <Search panTo={panTo} /> */}

          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={17} center={dronetrackdet && dronetrackdet[0]} onClick={onMapClick} onLoad={onMapLoad}>
          
            {/* {dronetrackdet  ?
            <Marker position={{ lat: dronetrackdet && dronetrackdet[0].lat, lng: dronetrackdet && dronetrackdet[0].lng }} style={{ backgroundColor: 'red' }}
              icon={{
                url: `https://res.cloudinary.com/dj3in4dua/image/upload/v1669366898/xoaoqfrj5lgodmb8pcav.png`,
                fillColor: '#34495e',
                fillOpacity: 1,
                strokeColor: '#000',
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
              }} /> :
              ''}
              </Fragment> */}
            <Polyline
              path={dronetrackdet}
              geodesic={true}
              options={{
                strokeColor: "#ff2527",
                strokeOpacity: 0.75,
                strokeWeight: 2,
              }} />
<Polyline
              path={fleetdronedet && fleetdronedet.dronetrackdet1}
              geodesic={true}
              options={{
                strokeColor: "blue",
                strokeOpacity: 0.75,
                strokeWeight: 2,
              }} />
          </GoogleMap>
        </div>
        <div className='dronecardheadbut'>
        <button className="btn btn-primary" style={{ backgroundColor: '#1A3447' }} onClick={()=>onSubmitback()} >Back</button>
        </div>
        </>
       
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