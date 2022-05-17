import react, { useState, useEffect } from "react";

import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";

export default function App() {
  const [updateWeather, setUpdateWeather] = useState(true);
  const [weatherData, setWeatherData] = useState(undefined);
  const [location, setLocation] = useState("Berlin");
  const [cityNotFound, setCityNotFound] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    handleWeatherData();
  }, [updateWeather]);

  const handleWeatherData = async () => {
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        location +
        "&appid=7628a4a8d5bb750bb48c6db6b960a42b&units=metric",
      { mode: "cors" }
    );
    const data = await res.json();
    setUpdateWeather(false);
    setWeatherData(data);
  };

  const handleLocationInput = () => {
    setUpdateWeather(true);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        {cityNotFound !== false && <Text>Couldnt find City</Text>}

        {weatherData !== undefined && (
          <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="City"
                style={styles.input}
                onSubmitEditing={() => handleLocationInput()}
                onChangeText={(newText) => setLocation(newText)}
              />
              {weatherData.cod !== 200 && (
                <Text style={[styles.weatherField, { marginTop: "30%" }]}>
                  Couldnt find city
                </Text>
              )}
              {weatherData.cod === 200 && (
                <View style={styles.weather}>
                  <Text
                    style={[
                      styles.weatherField,
                      { fontFamily: "Montserrat_700Bold" },
                    ]}
                  >
                    {weatherData.name}
                  </Text>
                  <Text style={styles.weatherField}>
                    {weatherData.main.temp}°C
                  </Text>
                  <Text style={styles.weatherField}>
                    {weatherData.main.humidity}% Humidity
                  </Text>
                  <Text style={styles.weatherField}>
                    {weatherData.wind.speed}km/h Wind
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 800,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  weather: {
    flex: 0.4,
    alignItems: "center",
    padding: 38,
    marginTop: 150,
    elevation: 10,
    shadowColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
  },
  text: {
    fontSize: 30,
  },
  input: {
    width: "85%",
    height: 45,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#efefef",
    marginTop: 20,
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    height: 20,
  },
  weatherField: {
    fontSize: 32,
    fontFamily: "Montserrat_400Regular",
  },
});
