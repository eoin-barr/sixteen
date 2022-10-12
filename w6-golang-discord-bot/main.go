package main

import (
	"fmt"
	"golang-bot/config"
	"golang-bot/handler"

	"github.com/bwmarrin/discordgo"
)

var BotId string

func Start() {
	goBot, err := discordgo.New("Bot " + config.Token)
	if err != nil {
		fmt.Println("Error creating Discord session: ", err.Error())
		return
	}

	u, err := goBot.User("@me")
	if err != nil {
		fmt.Println("Error retrieving account: ", err.Error())
		return
	}

	BotId = u.ID
	goBot.AddHandler(messageHandler)

	err = goBot.Open()
	if err != nil {
		fmt.Println("Error opening connection: ", err.Error())
		return
	}

	fmt.Println("Bot is running!")
}

func messageHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	if m.Author.ID == BotId {
		return
	}

	handler.ParseMessage(s, m)
}

func main() {
	err := config.ReadConfig()
	if err != nil {
		fmt.Println("Error reading config file")
		return
	}

	Start()
	<-make(chan struct{})
}
