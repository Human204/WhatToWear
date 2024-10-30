import React, { useState } from "react";

const fetchWeather = async (latitude: number, longitude: number) => {
    const response = await fetch(
        `http://localhost:5000/api/weather?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await response.json();
    return data;
};

const fetchCity = async (city: any) => {
    const response = await fetch(`http://localhost:5000/api/city?city=${city}`);
    const data = await response.json();
    return data;
};

const fetchChatGPTResponse = async (weatherData: any, userPreferences: any) => {
    const response = await fetch("http://localhost:5000/api/chatgpt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ weatherData, userPreferences }),
    });
    const data = await response.json();
    return data;
};

export default function Today() {
    const [city, setCity] = useState<string>("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [preferences, setPreferences] = useState<{
        favoriteTemperature: string;
        style: string;
    }>({
        favoriteTemperature: "",
        style: "",
    });
    const [response, setResponse] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.value,
        });
    };

    const handleWeatherData = async () => {
        if (latitude === 0 || longitude === 0) {
            setResponse("Please enter valid city.");
            return;
        }
        try {
            const weatherData = await fetchWeather(latitude, longitude);
            console.log(weatherData);
            const weatherDataString = `"${JSON.stringify(weatherData)}"`;
            console.log(weatherDataString);
            const chatGPTResponse = await fetchChatGPTResponse(
                weatherData,
                preferences
            );

            setResponse(chatGPTResponse);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCitySubmit = async () => {
        try {
            const cityData = await fetchCity(city);
            setLatitude(cityData.latitude);
            setLongitude(cityData.longitude);
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={handleCitySubmit}>Get Coordinates</button>
            <input
                type="text"
                name="favoriteTemperature"
                placeholder="Preferred Temperature"
                onChange={handleChange}
            />
            <input
                type="text"
                name="style"
                placeholder="Preferred style"
                onChange={handleChange}
            />
            <button onClick={handleWeatherData}>
                Get Weather Recommendation
            </button>
            {response && <p>{response}</p>}
        </div>
    );
}
