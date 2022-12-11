package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
	Name    string `json:"name"`
	Message string `json:"message"`
}

type MyResponse struct {
	Answer string `json:"answer"`
}

func HandleLambdaEvent(event MyEvent) (MyResponse, error) {
	return MyResponse{Answer: fmt.Sprintf("Hello %s, %s!", event.Name, event.Message)}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
