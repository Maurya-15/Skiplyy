import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";

const SUGGESTED_LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
];

export function LocationSearch() {
  const { selectedLocation, setSelectedLocation } = useApp();
  const [inputValue, setInputValue] = useState(selectedLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationSelect = (location: string) => {
    setInputValue(location);
    setSelectedLocation(location);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    setSelectedLocation(inputValue);
    setShowSuggestions(false);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          const location = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
          handleLocationSelect("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default
          handleLocationSelect("New York, NY");
        },
      );
    } else {
      handleLocationSelect("New York, NY");
    }
  };

  const filteredSuggestions = SUGGESTED_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your location..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-9 pr-4"
          />

          {showSuggestions &&
            (inputValue || filteredSuggestions.length > 0) && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((location) => (
                  <button
                    key={location}
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                    onMouseDown={() => handleLocationSelect(location)}
                  >
                    <MapPin className="inline w-3 h-3 mr-2 text-muted-foreground" />
                    {location}
                  </button>
                ))}
              </div>
            )}
        </div>

        <Button variant="outline" size="icon" onClick={handleCurrentLocation}>
          <MapPin className="h-4 w-4" />
        </Button>

        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}
