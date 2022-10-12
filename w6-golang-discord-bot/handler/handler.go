package handler

import (
	"encoding/json"
	"fmt"

	"golang-bot/config"
	"golang-bot/types"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func ParseMessage(s *discordgo.Session, m *discordgo.MessageCreate) {
	noCityError := "Please provide a city name"
	networkError := "Error getting weather data"
	cityErrorMessage := "Hmmm couldn't find that city... \nTry again with a different city name"

	lowerCasesMessage := cases.Lower(language.English).String(m.Content)
	if strings.Contains(lowerCasesMessage, "weather") {
		words := strings.Split(m.Content, " ")
		if len(words) == 1 {
			s.ChannelMessageSend(m.ChannelID, noCityError)
			return
		}

		city := strings.Join(words[1:], " ")
		var url string = "https://api.openweathermap.org/geo/1.0/direct?q=" + strings.ToLower(city) + "&limit=1&appid=a25eb633cc0b438b573ed82acd68adfc"

		cityDetailsResp, err := http.Get(url)
		if err != nil {
			fmt.Println("Error getting response")
			s.ChannelMessageSend(m.ChannelID, cityErrorMessage)
			return
		}

		cityDetailsBody, err := ioutil.ReadAll(cityDetailsResp.Body)
		if err != nil {
			fmt.Println("Error reading response")
			s.ChannelMessageSend(m.ChannelID, networkError)
			return
		}

		var cityDetails types.CityDetails
		err = json.Unmarshal(cityDetailsBody, &cityDetails)
		if err != nil {
			fmt.Println("Error unmarshalling response")
			s.ChannelMessageSend(m.ChannelID, networkError)
			return
		}

		if len(cityDetails) == 0 {
			s.ChannelMessageSend(m.ChannelID, cityErrorMessage)
			return
		}

		weatherUrl := "https://api.openweathermap.org/data/2.5/weather?lat=" + strconv.FormatFloat(cityDetails[0].Lat, 'f', 2, 32) + "&lon=" + strconv.FormatFloat(cityDetails[0].Lon, 'f', 2, 32) + "&appid=" + config.OpenWeatherAPIKey
		resp, err := http.Get(weatherUrl)
		if err != nil {
			fmt.Println("Error getting response")
			s.ChannelMessageSend(m.ChannelID, cityErrorMessage)
			return
		}

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Error reading response")
			s.ChannelMessageSend(m.ChannelID, networkError)
			return
		}

		var result types.WeatherRes
		err = json.Unmarshal(body, &result)
		if err != nil {
			fmt.Println("Error unmarshalling response")
			s.ChannelMessageSend(m.ChannelID, networkError)
			return
		}

		_, _ = s.ChannelMessageSend(m.ChannelID, formatString(result, cases.Title(language.English, cases.Compact).String(city)))
	}
}

func formatString(result types.WeatherRes, city string) string {
	temp := result.Main.Temp - 273.15

	return "City:                      " + city + "\n" +
		"Description:        " + cases.Title(language.English, cases.Compact).String(result.Weather[0].Description) + "\n" +
		"Temperature:      " + strconv.FormatFloat(temp, 'f', 2, 32) + " °C" + "\n" +
		"Pressure:              " + strconv.FormatInt(int64(result.Main.Pressure), 10) + " hPa" + "\n" +
		"Humitdity:           " + strconv.FormatInt(int64(result.Main.Humidity), 10) + " %" + "\n"
}
