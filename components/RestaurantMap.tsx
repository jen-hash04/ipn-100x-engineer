/**
 * Legacy component - no longer used
 * This component was originally used to display restaurants on a map
 * It has been replaced by a simpler list view
 *
 * TODO: Workshop Exercise 2 - Find and remove dead code
 * This entire file is unused and should be removed
 */

/* eslint-disable no-console, no-unused-vars */

'use client';

import { useEffect, useRef } from 'react';
import { Restaurant } from '@/types/restaurant';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  center: { lat: number; lng: number };
  zoom?: number;
}

// This component is no longer used in the application
export default function RestaurantMap({ restaurants, center, zoom = 13 }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  console.log('RestaurantMap mounted - this should not appear'); // Dead code

  useEffect(() => {
    // This code never runs because the component is not used
    console.log('Initializing map with center:', center);

    // Placeholder for map initialization
    // In a real implementation, this would use Google Maps or Mapbox
    if (mapRef.current && !mapInstanceRef.current) {
      // Map initialization code would go here
      console.log('Map would be initialized here');
    }

    return () => {
      // Cleanup
      console.log('Cleaning up map');
    };
  }, [center, zoom]);

  useEffect(() => {
    // Add markers for restaurants
    if (mapInstanceRef.current && restaurants.length > 0) {
      console.log('Adding markers for', restaurants.length, 'restaurants');
      restaurants.forEach((restaurant) => {
        // Marker creation code would go here
        console.log('Adding marker for:', restaurant.name);
      });
    }
  }, [restaurants]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    // This function is never called
    console.log('Marker clicked:', restaurant.name);
    alert(`You clicked on ${restaurant.name}`);
  };

  const calculateBounds = (restaurants: Restaurant[]) => {
    // Unused function to calculate map bounds
    if (restaurants.length === 0) return null;

    let minLat = restaurants[0].latitude;
    let maxLat = restaurants[0].latitude;
    let minLng = restaurants[0].longitude;
    let maxLng = restaurants[0].longitude;

    restaurants.forEach((r) => {
      minLat = Math.min(minLat, r.latitude);
      maxLat = Math.max(maxLat, r.latitude);
      minLng = Math.min(minLng, r.longitude);
      maxLng = Math.max(maxLng, r.longitude);
    });

    return { minLat, maxLat, minLng, maxLng };
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Map View</p>
          <p className="text-sm">Map integration not configured</p>
          <p className="text-xs mt-2">
            Add your Google Maps or Mapbox API key to enable this feature
          </p>
        </div>
      </div>

      {/* Floating controls - also unused */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
          +
        </button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50">
          -
        </button>
      </div>
    </div>
  );
}

// Unused helper function
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Another unused function
function getMapStyle() {
  return [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ];
}
