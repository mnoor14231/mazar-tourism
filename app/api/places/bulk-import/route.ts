import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appPlaceToDbPlace } from '@/lib/dbHelpers';
import * as XLSX from 'xlsx';

// Helper function to parse Excel file
function parseExcelFile(buffer: ArrayBuffer): { headers: string[], rows: any[] } {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
  
  if (data.length < 2) {
    throw new Error('Excel file must have at least a header and one data row');
  }

  const headers = data[0].map((h: any) => String(h).trim().toLowerCase());
  const rows = data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ? String(row[index]).trim() : '';
    });
    return obj;
  });

  return { headers, rows };
}

// Helper function to parse CSV file
function parseCSVFile(text: string): { headers: string[], rows: any[] } {
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });

  return { headers, rows };
}

// POST bulk import places from CSV or Excel
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      return NextResponse.json({ 
        error: 'File must be CSV (.csv) or Excel (.xlsx, .xls) format' 
      }, { status: 400 });
    }

    // Parse file based on type
    let headers: string[];
    let rows: any[];

    try {
      if (isExcel) {
        const buffer = await file.arrayBuffer();
        const parsed = parseExcelFile(buffer);
        headers = parsed.headers;
        rows = parsed.rows;
      } else {
        const text = await file.text();
        const parsed = parseCSVFile(text);
        headers = parsed.headers;
        rows = parsed.rows;
      }
    } catch (parseError: any) {
      return NextResponse.json({ 
        error: `Failed to parse file: ${parseError.message}` 
      }, { status: 400 });
    }
    
    // Expected columns (case-insensitive)
    const requiredFields = ['name', 'description', 'type', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required columns: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Parse rows into places
    const places = [];
    const errors = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Validate required fields
      if (!row.name || !row.description || !row.type || !row.latitude || !row.longitude) {
        errors.push(`Row ${i + 2}: Missing required fields`);
        continue;
      }

      // Parse JSON fields safely
      let audience = ['family'];
      let currentEvents: string[] = [];
      let images: string[] = [];
      let customFilters = null;

      try {
        if (row.audience) {
          const audienceStr = String(row.audience);
          if (audienceStr.startsWith('[') || audienceStr.startsWith('{')) {
            audience = JSON.parse(audienceStr);
          } else {
            // If not JSON, try splitting by comma
            audience = audienceStr.split(',').map((a: string) => a.trim()).filter(Boolean);
          }
        }
      } catch (e) {
        // If parsing fails, try splitting by comma
        const audienceStr = String(row.audience || '');
        audience = audienceStr.split(',').map((a: string) => a.trim()).filter(Boolean);
        if (audience.length === 0) audience = ['family'];
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
          const imagesStr = String(row.images);
          if (imagesStr.startsWith('[') || imagesStr.startsWith('{')) {
            images = JSON.parse(imagesStr);
          } else {
            // If not JSON, try splitting by comma
            images = imagesStr.split(',').map((img: string) => img.trim()).filter(Boolean);
          }
        }
      } catch (e) {
        // If parsing fails, try splitting by comma
        const imagesStr = String(row.images || '');
        images = imagesStr.split(',').map((img: string) => img.trim()).filter(Boolean);
      }

      try {
        if (row.customFilters) {
          customFilters = JSON.parse(row.customFilters);
        }
      } catch (e) {
        customFilters = null;
      }

      // Validate coordinates
      const lat = parseFloat(String(row.latitude));
      const lng = parseFloat(String(row.longitude));
      if (isNaN(lat) || isNaN(lng)) {
        errors.push(`Row ${i + 2}: Invalid latitude or longitude`);
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
        error: 'No valid places found in file',
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

