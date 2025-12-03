// Parse Google Maps URL to extract coordinates
export function parseGoogleMapsUrl(url: string): { latitude: number; longitude: number } | null {
  try {
    // Pattern 1: @lat,lng,zoom (most common for Google Maps share links)
    // Example: https://www.google.com/maps/@24.4672,39.6111,15z
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = url.match(atPattern);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      console.log('Parsed coordinates (@ pattern):', { latitude: lat, longitude: lng });
      return {
        latitude: lat,
        longitude: lng,
      };
    }

    // Pattern 2: /place/name/@lat,lng
    // Example: https://www.google.com/maps/place/Prophet's+Mosque/@24.4672,39.6111
    const placePattern = /\/place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = url.match(placePattern);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      console.log('Parsed coordinates (place pattern):', { latitude: lat, longitude: lng });
      return {
        latitude: lat,
        longitude: lng,
      };
    }

    // Pattern 3: ?q=lat,lng
    // Example: https://www.google.com/maps?q=24.4672,39.6111
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const qMatch = url.match(qPattern);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      console.log('Parsed coordinates (q pattern):', { latitude: lat, longitude: lng });
      return {
        latitude: lat,
        longitude: lng,
      };
    }

    // Pattern 4: ll=lat,lng (alternative parameter)
    const llPattern = /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const llMatch = url.match(llPattern);
    if (llMatch) {
      const lat = parseFloat(llMatch[1]);
      const lng = parseFloat(llMatch[2]);
      console.log('Parsed coordinates (ll pattern):', { latitude: lat, longitude: lng });
      return {
        latitude: lat,
        longitude: lng,
      };
    }

    console.log('No coordinates found in URL:', url);
    return null;
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return null;
  }
}

// Convert image file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Validate and resize image if needed
export async function processImage(file: File, maxSizeMB: number = 2): Promise<string> {
  // Check file size
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > maxSizeMB) {
    throw new Error(`حجم الصورة كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت`);
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('الملف يجب أن يكون صورة');
  }

  // Convert to base64
  const base64 = await fileToBase64(file);
  return base64;
}

// Format number in Arabic
export function formatNumberAr(num: number): string {
  return num.toLocaleString('ar-SA');
}

// Validate coordinates
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

