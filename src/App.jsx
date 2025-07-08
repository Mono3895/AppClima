import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Asegúrate de que este archivo exista

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para el indicador de carga

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async () => {
    if (!city) {
      setError('Por favor, ingresa una ciudad.');
      setWeather(null);
      return;
    }

    setError('');
    setLoading(true); // Iniciar carga

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'es'
        }
      });
      setWeather(response.data);
      console.log(response.data);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.message}. Intenta con otra ciudad.`);
      } else if (err.request) {
        setError('Error: No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('Error: Algo salió mal al configurar la solicitud.');
      }
      setWeather(null);
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Climático</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Ej: Madrid, London, New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar Clima'}
          </button>
        </form>
      </header>

      <main className="dashboard-main">
        {error && <p className="error-message">{error}</p>}

{weather ? (
  <div className="weather-dashboard-cards">
    {/* Tarjeta de Temperatura Principal */}
    <div className="weather-card primary-card">
      <div className="card-header">
                <h2>{weather.name}, {weather.sys.country}</h2>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="weather-icon"
                />
              </div>
              <div className="main-temp">{Math.round(weather.main.temp)}°C</div>
              <p className="description">{weather.weather[0].description}</p>
              <p className="feels-like">Sensación térmica: {Math.round(weather.main.feels_like)}°C</p>
    </div>

    {/* Tarjeta de Detalles Adicionales */}
    <div className="weather-card detail-card">
      <h3>Detalles Adicionales</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Humedad:</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>
                <div className="detail-item">
                  <span>Presión:</span>
                  <strong>{weather.main.pressure} hPa</strong>
                </div>
                <div className="detail-item">
                  <span>Vel. Viento:</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
                <div className="detail-item">
                  <span>Visibilidad:</span>
                  <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                </div>
                <div className="detail-item">
                  <span>Amanecer:</span>
                  <strong>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
                <div className="detail-item">
                  <span>Atardecer:</span>
                  <strong>{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
              </div>
    </div>
  </div>
) : (
  // ¡CAMBIA ESTA SECCIÓN! Elimina los paréntesis extras alrededor de la <p>
  !loading && !error && <p className="initial-message">Ingresa una ciudad para ver el clima.</p>
)}

{loading && <div className="loading-spinner"></div>} {/* Indicador de carga */}
</main>
</div>
);
}

export default App;