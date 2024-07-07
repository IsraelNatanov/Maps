

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function haversineDistance(point1: [number, number], point2: [number, number]): number {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const earthRadius = 6371e3; // Earth's radius in meters
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    // Convert to kilometers and round to 2 decimal places
    const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
    return `${distanceInKilometers} km`;
  } else {
    // Use meters and round to 2 decimal places
    const distanceInMetersRounded = distanceInMeters.toFixed(2);
    return `${distanceInMetersRounded} meters`;
  }
}
