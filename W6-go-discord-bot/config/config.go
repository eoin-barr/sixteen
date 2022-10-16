package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"golang-bot/types"
)

var (
	Token             string
	BotPrefix         string
	OpenWeatherAPIKey string
	config            *types.ConfigStruct
)

func ReadConfig() error {
	file, err := ioutil.ReadFile("./config.json")
	if err != nil {
		fmt.Println("Error reading config file")
		return err
	}

	fmt.Println(string(file))
	err = json.Unmarshal(file, &config)
	if err != nil {
		fmt.Println("Error unmarshalling config file")
		return err
	}

	Token = config.Token
	BotPrefix = config.BotPrefix
	OpenWeatherAPIKey = config.OpenWeatherAPIKey

	return nil
}
