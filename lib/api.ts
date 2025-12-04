// API utility functions for making requests to the backend

export async function fetchPlaces() {
  const res = await fetch('/api/places');
  if (!res.ok) throw new Error('Failed to fetch places');
  return res.json();
}

export async function createPlace(place: any) {
  const res = await fetch('/api/places', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(place),
  });
  if (!res.ok) throw new Error('Failed to create place');
  return res.json();
}

export async function updatePlace(id: string, place: any) {
  const res = await fetch(`/api/places/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(place),
  });
  if (!res.ok) throw new Error('Failed to update place');
  return res.json();
}

export async function deletePlace(id: string) {
  const res = await fetch(`/api/places/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete place');
  return res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

export async function fetchFilters() {
  const res = await fetch('/api/filters');
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
}

export async function createFilter(filter: any) {
  const res = await fetch('/api/filters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filter),
  });
  if (!res.ok) throw new Error('Failed to create filter');
  return res.json();
}

export async function fetchReservations(userId?: string) {
  const url = userId ? `/api/reservations?userId=${userId}` : '/api/reservations';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reservations');
  return res.json();
}

export async function createReservation(reservation: any) {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation),
  });
  if (!res.ok) throw new Error('Failed to create reservation');
  return res.json();
}

export async function fetchSavedRoutes(userId: string) {
  const res = await fetch(`/api/routes?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch saved routes');
  return res.json();
}

export async function createSavedRoute(route: any) {
  console.log('[API Client] Sending POST to /api/routes with data:', route);
  
  const res = await fetch('/api/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(route),
  });
  
  const data = await res.json();
  console.log('[API Client] Response from /api/routes:', data);
  
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Failed to save route';
    console.error('[API Client] Error response:', data);
    throw new Error(errorMessage);
  }
  
  return data;
}

export async function deleteSavedRoute(id: string) {
  const res = await fetch(`/api/routes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete route');
  return res.json();
}

