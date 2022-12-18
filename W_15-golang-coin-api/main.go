package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/TwiN/go-color"
)

type Response struct {
	USD float64 `json:"USD"`
}

func main() {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://min-api.cryptocompare.com/data/price?", nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}

	q := url.Values{}
	q.Add("fsym", "BTC")
	q.Add("tsyms", "USD")

	req.Header.Set("Accepts", "application/json")
	req.Header.Add("Apikey", "<YOUR_API_KEY>")
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request to server")
		os.Exit(1)
	}

	respBody, _ := ioutil.ReadAll(resp.Body)
	var res Response
	err = json.Unmarshal(respBody, &res)
	if err != nil {
		fmt.Println("Error unmarshalling response")
		os.Exit(1)
	}
	println()
	fmt.Printf(color.Ize(color.Yellow, "BTC (USD): $%.2f\n"), res.USD)

}
