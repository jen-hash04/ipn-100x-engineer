const fs = require('fs');
const path = require('path');

// Houston coordinates for geocoding (approximate center)
const HOUSTON_CENTER = { lat: 29.7604, lng: -95.3698 };

// Helper function to parse operating hours and extract simplified opening/closing times
function parseOperatingHours(hoursString) {
  // Default values
  let opening = '09:00';
  let closing = '22:00';

  try {
    // Extract first time range (simplified approach)
    // Example: "Mon-Thu: 11:30AM-2:30PM & 6:00PM-10:00PM; Fri-Sun: 11:30AM-10:30PM"
    // We'll take the earliest opening and latest closing time

    const timePattern = /(\d{1,2}):(\d{2})(AM|PM)/g;
    const times = [];
    let match;

    while ((match = timePattern.exec(hoursString)) !== null) {
      const hour = parseInt(match[1]);
      const minute = match[2];
      const period = match[3];

      // Convert to 24-hour format
      let hour24 = hour;
      if (period === 'PM' && hour !== 12) {
        hour24 = hour + 12;
      } else if (period === 'AM' && hour === 12) {
        hour24 = 0;
      }

      times.push(`${hour24.toString().padStart(2, '0')}:${minute}`);
    }

    if (times.length >= 2) {
      // Find earliest and latest times
      const sortedTimes = times.sort();
      opening = sortedTimes[0];
      closing = sortedTimes[sortedTimes.length - 1];
    }
  } catch (error) {
    console.error('Error parsing hours:', hoursString, error);
  }

  return { opening, closing };
}

// Helper function to convert price range to symbols
function convertPriceRange(priceRange) {
  if (!priceRange) return '$$';

  const price = priceRange.replace('$', '').split('-')[0];
  const avgPrice = parseInt(price);

  if (avgPrice < 10) return '$';
  if (avgPrice < 20) return '$$';
  if (avgPrice < 30) return '$$$';
  return '$$$$';
}

// Generate approximate coordinates for Houston restaurants
// This spreads them around Houston based on their index
function generateHoustonCoordinates(index, total) {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 0.1; // About 10km radius

  return {
    latitude: HOUSTON_CENTER.lat + radius * Math.cos(angle),
    longitude: HOUSTON_CENTER.lng + radius * Math.sin(angle)
  };
}

// Read and parse CSV
const csvPath = path.join(__dirname, '../data/restaurants.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

const restaurants = [];

for (let i = 1; i < lines.length; i++) {
  // Simple CSV parsing (handles basic cases)
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let char of lines[i]) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue); // Push last value

  if (values.length < 11) continue; // Skip invalid rows

  const name = values[0];
  const address = values[1];
  const phone = values[2];
  const operatingHours = values[3];
  const cuisine = values[4];
  const vegetarianOptions = values[5];
  const signatureDishes = values[6];
  const priceRange = values[7];
  const rating = parseFloat(values[8]) || 4.0;
  const website = values[9];
  const specialFeatures = values[10];

  const { opening, closing } = parseOperatingHours(operatingHours);
  const coords = generateHoustonCoordinates(i - 1, lines.length - 1);

  restaurants.push({
    id: i.toString(),
    name,
    address,
    cuisine: cuisine || 'Indian',
    rating,
    priceRange: convertPriceRange(priceRange),
    openingHours: opening,
    closingHours: closing,
    latitude: coords.latitude,
    longitude: coords.longitude,
    phone: phone || 'N/A',
    description: `${specialFeatures || 'Authentic cuisine'}${vegetarianOptions === 'Yes' || vegetarianOptions === 'Yes Only' ? ' • Vegetarian options available' : ''}`
  });
}

// Write to restaurants.json
const outputPath = path.join(__dirname, '../data/restaurants.json');
const output = {
  restaurants: restaurants
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Successfully imported ${restaurants.length} restaurants from CSV`);
console.log(`Output written to ${outputPath}`);
