// Using import statement to bring necessary React hooks and CSS file into the component.
import { useEffect, useState } from 'react'; 
import './App.css';

const API_URL = 'http://localhost:3001/api/trips'; // setup a server endpoint for express API

// This is the main app compnent containing data and variables for my journey planner.
export default function App() {
  const [trips, setTrips] = useState([]);
  const [place, setPlace] = useState('');
  const [region, setRegion] = useState('Transylvania'); // displaying Transylvania as default :X
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Creating a region stile objects and style with diffrent collors to stand out
  const regionStyles = {
    "Transylvania": { background: '#e8f3ec', color: '#245c3a'},
    "Bucharest & Muntenia": { background: '#f8eadb', color: '#8a4d21'},
    "Maramureș": { background: '#e7eef8', color: '#355b86'},
    "Bucovina": { background: '#f1e8f5', color: '#6b4778'},
    "Other": { background: '#eeeae2', color: '#e15d4f'},
  }; // end of region style objects
 
  // GET all journey items from Express API server and display them in the list.
  const fetchTrips = async () => {
    try { const response = await fetch(API_URL);
          const data = await response.json();
          setTrips(data);} 
          catch {
          setMessage('Could not connect to the server.');} 
          finally {setLoading(false);}
  };

   // Load saved trips when the component first opens.
  useEffect(() => {fetchTrips();}, []);

  // POST a new destination to the server.
  const handleAddTrip = async (event) => {
    event.preventDefault();
    if (!place.trim()) {
      setMessage('Please enter a destination.');
      return;}
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place: place.trim(),
          region,
          date,
        }),
      });
      // Check if the response is successful
      const savedTrip = await response.json();
      setTrips((current) => [savedTrip, ...current]);
      setPlace('');
      setRegion('Transylvania'); //Displaying first Transylvania as default :X
      setDate('');
      setMessage('Trip added to your journey.');
    } catch {
      setMessage('Trip could not be added.');
    }
  };
  // PATCH a destination between planned and visited.
  const toggleVisited = async (trip) => {
    try {
      const response = await fetch(`${API_URL}/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: !trip.visited }),
      });
      const updatedTrip = await response.json();
      setTrips((current) =>
        current.map((item) =>
          item.id === updatedTrip.id ? updatedTrip : item
        )
      );
    } catch {
      setMessage('Error: visit status could not be updated.');
    }
  };

  // Sync destination if user wants to delete it from the journey list. 
  const deleteTrip = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTrips((current) =>
        current.filter((trip) => trip.id !== id)
      );
    } catch {
      setMessage('Trip could not be deleted.'); // Error handling for failed deletion
    }
  };

  // Clear destinations from journey list.
  const clearTrips = async () => {
    try {
      await fetch(API_URL, { method: 'DELETE' });
      setTrips([]);
      setMessage('Journey was cleared.');
    } catch {
      setMessage('Journey could not be cleared.');
    }
  };

  // Display the number of planned and visited locations in user journey.
  const visitedCount = trips.filter((trip) => trip.visited).length;
  const plannedCount = trips.length - visitedCount;
  return (
    <div className="travel-app">

      {/* Top navigation bar */}
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">🇷🇴 ▲ </span> {/* using a triangle as a loggo and country flag from https://flagpedia.net/romania/emoji */}
          <span>Discover Romania</span>
        </div>
        {/* Nav links using anchor tags to jump on different sections from the page */}
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#planner">Plan Trip</a>
          <a href="#journey">My Journey</a>
        </div>
      </nav>

      {/* Hero section  */}
      <header className="hero" id="home">
        <div className="hero-overlay">
          <p className="hero-label">PLAN • EXPLORE • VISIT • REMEMBER</p>
          <h1>Discover Romania</h1>
          <p className="hero-text">
            Save places you want to explore and mark each destination
            when your adventure is complete.
          </p>
          <a className="hero-button" href="#planner">
            Plan a Journey
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{trips.length}</span>
            <span className="stat-label">Total Trips</span> {/* Displaying the total number of trips */}
          </div>
          {/* Displaying the number of planned trips */}
          <div className="stat-card">
            <span className="stat-number">{plannedCount}</span>
            <span className="stat-label">Planned</span>
          </div>
          {/* Displaying the number of visited trips */}
          <div className="stat-card">
            <span className="stat-number">{visitedCount}</span>
            <span className="stat-label">Visited</span>
          </div>
        </section>
        <div className="app-body">

          {/* Left form box */}
          <section className="form-card" id="planner">
            <p className="section-kicker">YOUR NEXT ADVENTURE IS WAITING</p>
            <h2>Plan a New Trip</h2>
            <p className="section-copy">
              Add a castle, city, monastery or hidden place that you want to visit.
            </p>
            <form onSubmit={handleAddTrip}>
              <div className="field-group">
                <label htmlFor="place">Destination / Place</label>
                <input
                  id="place"
                  type="text"
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="e.g. Corvin Castle"
                />
              </div>
              <div className="field-group">
                <label htmlFor="region">Region</label>
                <select
                  id="region"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  <option>Transylvania</option>
                  <option>Bucharest & Muntenia</option>
                  <option>Maramureș</option>
                  <option>Bucovina</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="date">Planned Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <button className="btn-primary" type="submit">
                + Add to My Journey
              </button>
            </form>
            {message && <p className="form-message">{message}</p>}
          </section>
          {/* Journey list card */}
          <section className="list-card" id="journey">
            <div className="list-header">
              <div>
                <p className="section-kicker">PERSONAL TRAVEL LIST</p>
                <h2>My journey around Romania</h2>
              </div>
              {trips.length > 0 && (
                <button className="btn-clear" onClick={clearTrips}>
                  Clear All
                </button>
              )}
            </div>
            {loading ? (
              <p className="empty-state">Loading your journey...</p>
            ) : trips.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⌖</span>
                <p>No trips added yet.</p>
                <small>Add your first Romanian destination.</small>
              </div>
            ) : (
              <div className="trip-list">
                {trips.map((trip) => {
                  const badge =
                    regionStyles[trip.region] || regionStyles.Other;
                  return (
                    <article
                      className={`trip-item ${trip.visited ? 'visited' : ''}`}
                      key={trip.id}
                    >
                      <div className="trip-main">
                        <input
                          className="visit-check"
                          type="checkbox"
                          checked={trip.visited}
                          onChange={() => toggleVisited(trip)}
                        />
                        <div className="trip-details">
                          <h3>{trip.place}</h3>
                          <div className="trip-meta">
                            <span className="badge" style={badge}>
                              {trip.region}
                            </span>
                            <span>{trip.date || 'Date not set'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="trip-actions">
                        <span className="status-text">
                          {trip.visited ? 'Visited' : 'Planned'}
                        </span>
                        <button
                          className="btn-delete"
                          onClick={() => deleteTrip(trip.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer section */}
      <footer className="footer">
        <strong>Discover Romania</strong>
        <span>Your next journey awaits @ by Nicolae.</span>
      </footer>
    </div>
  );
}