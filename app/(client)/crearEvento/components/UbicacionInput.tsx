import React from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { EventFormData } from "../types";

interface Props {
    value: string;
    position: { lat: number; lng: number } | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelect: (lat: number, lng: number, address: string, ciudad?: string, distrito?: string) => void;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyDdTo8nhURFO9BsyUd0LtaOH9VR7dmCIwM";

const UbicacionInput: React.FC<Props> = ({ value, position, onChange, onSelect }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const autocompleteRef = React.useRef<any>(null);

    const onLoadAutocomplete = (autocomplete: any) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                onSelect(
                    lat,
                    lng,
                    place.formatted_address || value,
                    getAddressComponent(place, "locality"),
                    getAddressComponent(place, "administrative_area_level_2")
                );
            }
        }
    };

    function getAddressComponent(place: any, type: string): string | undefined {
        if (!place.address_components) return undefined;
        const comp = place.address_components.find((c: any) => c.types.includes(type));
        return comp ? comp.long_name : undefined;
    }

    return (
        <div>
            <label className="font-semibold">Ubicación (Lima, Perú)</label>
            {isLoaded && (
                <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                        componentRestrictions: { country: "pe" },
                        bounds: {
                            north: -11.7,
                            south: -12.4,
                            east: -76.7,
                            west: -77.2,
                        },
                        strictBounds: true,
                    }}
                >
                    <input
                        type="text"
                        name="ubicacion"
                        placeholder="Buscar dirección..."
                        className="mt-2 w-full p-2 border rounded focus:outline-none"
                        value={value}
                        onChange={onChange}
                        autoComplete="off"
                        required
                    />
                </Autocomplete>
            )}
            {isLoaded && position && (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "250px", borderRadius: "8px", marginTop: "16px" }}
                    center={position}
                    zoom={16}
                    onClick={(e) => {
                        const lat = e.latLng?.lat();
                        const lng = e.latLng?.lng();
                        if (lat && lng) {
                            onSelect(lat, lng, value);
                        }
                    }}
                >
                    <Marker
                        position={position}
                        draggable={true}
                        onDragEnd={(e) => {
                            const lat = e.latLng?.lat();
                            const lng = e.latLng?.lng();
                            if (lat && lng) {
                                onSelect(lat, lng, value);
                            }
                        }}
                    />
                </GoogleMap>
            )}
            <span className="text-xs text-gray-500">Solo se permiten eventos en Lima, Perú</span>
        </div>
    );
};

export default UbicacionInput;
