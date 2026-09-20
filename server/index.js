const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Allow the React client to send JSON requests.
app.use(cors());
app.use(express.json());

// Data resets when the server is restarted but let some data to persist.
let trips = [
  {
    id: 1,
    place: 'Castelul Corvin Hunedoara',
    region: 'Transylvania',
    date: '2026-10-19',
    visited: true, // using
  },
  {
    id: 2,
    place: 'Castelul Bran',
    region: 'Transylvania',
    date: '2026-10-05',
    visited: false,
  },
];

// GET: return every planned journey. (week 10 guideline)
app.get('/api/trips', (req, res) => { 
  res.json(trips);
});

// POST: create a new journey item.
app.post('/api/trips', (req, res) => {
  const { place, region, date } = req.body;

  if (!place || !place.trim()) {
    return res.status(400).json({ //(400 error bad request)
      message: 'Destination is required.',
    });
  }

  const newTrip = {
    id: Date.now(),
    place: place.trim(),
    region: region || 'Other',
    date: date || '',
    visited: false,
  };

  trips.unshift(newTrip);
  res.status(201).json(newTrip); //(201 trip created)
});

// PATCH: update whether a place has been visited.
app.patch('/api/trips/:id', (req, res) => {
  const id = Number(req.params.id);
  const trip = trips.find((item) => item.id === id);

  if (!trip) {
    return res.status(404).json({ // (404 not found)
      message: 'Trip not found.',
    });
  }

  trip.visited = Boolean(req.body.visited);
  res.json(trip);
});

// DELETE: remove one journey item.
app.delete('/api/trips/:id', (req, res) => {
  const id = Number(req.params.id);
  trips = trips.filter((trip) => trip.id !== id);

  res.json({
    message: 'Trip deleted.',
  });
});

// DELETE: clear the complete journey.
app.delete('/api/trips', (req, res) => {
  trips = [];

  res.json({
    message: 'Journey cleared.',
  });
});

// Start the Express server.
app.listen(PORT, () => {
  console.log(`Discover Romania API running on port ${PORT}`);
});