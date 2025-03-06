import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ markers = [], center = [51.505, -0.09], zoom = 13, height = '100%' }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-medium text-gray-900 mb-1">
                {marker.popup}
              </h3>
              {marker.link && (
                <Link
                  to={marker.link}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  View Details →
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

MapComponent.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  height: PropTypes.string,
};

export default MapComponent;
