import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appPlaceToDbPlace } from '@/lib/dbHelpers';

// POST bulk import places from CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must have at least a header and one data row' }, { status: 400 });
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Expected CSV columns
    const requiredFields = ['name', 'description', 'type', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required columns: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Parse CSV rows
    const places = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Validate required fields
      if (!row.name || !row.description || !row.type || !row.latitude || !row.longitude) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      // Parse JSON fields safely
      let audience = ['family'];
      let currentEvents: string[] = [];
      let images: string[] = [];
      let customFilters = null;

      try {
        if (row.audience) {
          audience = JSON.parse(row.audience);
        }
      } catch (e) {
        // If not JSON, try splitting by comma
        audience = row.audience.split(',').map((a: string) => a.trim()).filter(Boolean);
      }

      try {
        if (row.currentEvents) {
          currentEvents = JSON.parse(row.currentEvents);
        }
      } catch (e) {
        currentEvents = [];
      }

      try {
        if (row.images) {
          images = JSON.parse(row.images);
        }
      } catch (e) {
        // If not JSON, try splitting by comma
        images = row.images.split(',').map((img: string) => img.trim()).filter(Boolean);
      }

      try {
        if (row.customFilters) {
          customFilters = JSON.parse(row.customFilters);
        }
      } catch (e) {
        customFilters = null;
      }

      // Validate coordinates
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        errors.push(`Row ${i + 1}: Invalid latitude or longitude`);
        continue;
      }

      // Convert to place format
      const place = {
        name: row.name,
        description: row.description,
        type: row.type || 'entertainment',
        audience,
        environment: row.environment || 'mixed',
        requiresBooking: row.requiresBooking === 'true' || row.requiresBooking === '1',
        reservationPrice: row.reservationPrice ? parseFloat(row.reservationPrice) : null,
        bookingUrl: row.bookingUrl || null,
        bookingsCount: row.bookingsCount ? parseInt(row.bookingsCount) || 0 : 0,
        openingHours: row.openingHours || '24 ساعة',
        crowdLevel: row.crowdLevel || 'medium',
        currentEvents,
        images,
        latitude: lat,
        longitude: lng,
        customFilters,
      };

      places.push(place);
    }

    if (places.length === 0) {
      return NextResponse.json({ 
        error: 'No valid places found in CSV file',
        errors 
      }, { status: 400 });
    }

    // Insert places into database
    const dbPlaces = places.map(appPlaceToDbPlace);
    
    // Use createMany for bulk insert (faster)
    const result = await prisma.place.createMany({
      data: dbPlaces,
      skipDuplicates: true, // Skip if name already exists
    });

    return NextResponse.json({
      success: true,
      imported: result.count,
      total: places.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('Error bulk importing places:', error);
    return NextResponse.json({ 
      error: 'Failed to import places',
      details: error.message 
    }, { status: 500 });
  }
}

