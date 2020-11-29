import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/sidebar";
import api from "../services/api";
import { useHistory } from "react-router-dom";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

export default function CreateOrphanage() {

  const history = useHistory();
  const [position, setPosition] = useState({ latitude:0, longitude:0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(Boolean);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    })
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages);

    const SelectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(SelectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name);
    data.append('about', name);
    data.append('latitude',String(latitude));
    data.append('longitude',String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends',String(open_on_weekends));

    images.forEach(image =>{
      data.append('images', image)
    })
    
    await api.post('orphanages', data);

    alert('cadastro realizado com sucesso');

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage">
      
    <Sidebar />
    
      <main>
        <form 
        onSubmit={handleSubmit}
        className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.2092052,-49.6401092]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/12/1171/1566.mvt?style=mapbox://styles/mapbox/streets-v11@00&access_token=pk.eyJ1IjoidmluaWNpdXNtdWxsZXIiLCJhIjoiY2tpM2pnczF2MGwxdTJybWkzbGE1bHZmbSJ9.KM3hDfdwKM32ksWC9xnAyw`}
              />

            { position.latitude != 0 ? <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} /> : null}

              
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={e => setName (e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} 
              value={about} onChange={e => setAbout (e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

              {previewImages.map(image => {
                return (
                  <img key={image} src={image} alt={name}/>
                )
              })}

                <button type="button" className="new-image">
                
                <FiPlus size={24} color="#15b6d6" type="label"/>
                <input multiple onChange={handleSelectImages} type="file" id="image" />
                
                
              </button>
              

              </div>
            
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions"
              value={instructions} onChange={e => setInstructions (e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de funcionaento</label>
              <input id="opening_hours"
              value={opening_hours} onChange={e => setOpeningHours (e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : '' }
              onClick={() => setOpenOnWeekends(true)  
              }
                
                >Sim</button>
                <button type="button"
                className={!open_on_weekends ? 'active' : '' }
                onClick={() => setOpenOnWeekends(false)}  
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
