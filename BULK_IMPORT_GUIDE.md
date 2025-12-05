# Bulk Import Feature - User Guide

## Overview

The bulk import feature allows you to add many places to the database at once by uploading a CSV file through the admin interface.

## How to Use

### Step 1: Access Admin Page

1. Go to `/admin` in your browser
2. You'll see two sections:
   - **إنشاء بيانات أولية** (Create Initial Data) - for seeding default data
   - **استيراد جماعي للأماكن** (Bulk Import Places) - for importing from CSV

### Step 2: Download CSV Template

1. Click the **"📥 تحميل قالب CSV"** (Download CSV Template) button
2. This downloads `places-template.csv` with example data
3. Open it in Excel, Google Sheets, or any spreadsheet application

### Step 3: Prepare Your Data

Fill in the CSV file with your places. Required columns:

- **name** (required) - Place name in Arabic
- **description** (required) - Place description
- **type** (required) - One of: `religious`, `historical`, `entertainment`
- **latitude** (required) - GPS latitude (e.g., 24.4672)
- **longitude** (required) - GPS longitude (e.g., 39.6111)

Optional columns:

- **audience** - JSON array like `["family","kids"]` or comma-separated like `family,kids`
- **environment** - `indoor`, `outdoor`, or `mixed` (default: `mixed`)
- **requiresBooking** - `true` or `false` (default: `false`)
- **reservationPrice** - Number (e.g., 50)
- **bookingUrl** - URL string
- **bookingsCount** - Number (default: 0)
- **openingHours** - String (default: "24 ساعة")
- **crowdLevel** - `low`, `medium`, or `high` (default: `medium`)
- **currentEvents** - JSON array like `["event1","event2"]` or leave empty
- **images** - JSON array like `["url1","url2"]` or comma-separated URLs
- **customFilters** - JSON object or leave empty

### Step 4: Upload CSV File

1. Click **"📤 رفع ملف CSV واستيراد الأماكن"** (Upload CSV File and Import Places)
2. Select your CSV file
3. Wait for the import to complete
4. You'll see a success message with the number of places imported

### Step 5: Verify

1. Go to `/reference` page to see your imported places
2. Or use Prisma Studio: `npm run prisma:studio`

## CSV Format Examples

### Simple Example (Minimum Required Fields)

```csv
name,description,type,latitude,longitude
المسجد النبوي,أحد أعظم المساجد في الإسلام,religious,24.4672,39.6111
مسجد قباء,أول مسجد بني في الإسلام,religious,24.4393,39.6206
```

### Full Example (All Fields)

```csv
name,description,type,audience,environment,requiresBooking,reservationPrice,openingHours,crowdLevel,currentEvents,images,latitude,longitude
المسجد النبوي,أحد أعظم المساجد في الإسلام,religious,"[""family"",""seniors""]",mixed,false,,24 ساعة,high,"[""صلاة التراويح""]","[""https://example.com/image.jpg""]",24.4672,39.6111
```

## Tips

1. **JSON Arrays**: For `audience`, `currentEvents`, and `images`, you can use:
   - JSON format: `["family","kids"]`
   - Or comma-separated: `family,kids` (for audience and images)

2. **Coordinates**: Make sure latitude and longitude are valid numbers

3. **Large Files**: You can import 10, 50, or 100+ places at once!

4. **Errors**: If some rows fail, check the error message. Common issues:
   - Missing required fields
   - Invalid coordinates
   - Malformed JSON

5. **Duplicates**: The system skips places with duplicate names automatically

## Troubleshooting

**"Missing required columns" error:**
- Make sure your CSV has: `name`, `description`, `type`, `latitude`, `longitude`
- Check that the header row is correct

**"Column count mismatch" error:**
- Make sure all rows have the same number of columns as the header
- Check for extra commas or missing values

**"Invalid latitude or longitude" error:**
- Make sure coordinates are valid numbers
- Check for typos in the CSV

**Import succeeded but no places appear:**
- Refresh the `/reference` page
- Check Prisma Studio to see if data was imported
- Some places might have been skipped as duplicates

## API Endpoint

The bulk import uses: `POST /api/places/bulk-import`

You can also use this endpoint programmatically if needed.

