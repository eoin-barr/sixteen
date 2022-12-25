package user

import (
	"encoding/json"
	"errors"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/eoin-barr/go-serverless-2/pkg/validators"
)

var (
	ErrorFailedToFetchRecord     = "Failed to fetch record"
	ErrorFailedToUnmarshalRecord = "Failed to unmarshal record"
	ErrorInvalidUserData         = "Invalid user data"
	ErrorInvalidEmail            = "Invalid email"
	ErrorCouldNotMarshalRecord   = "Could not marshal record"
	ErrorCouldNotDeleteRecord    = "Could not delete record"
	ErrorCouldNotDynamoDBPutItem = "Could not dynamodb put item"
	ErrorUserAlreadyExists       = "User already exists"
	ErrorUserDoesNotExist        = "User does not exist"
)

type User struct {
	Email     string `json:"email"`
	FirstName string `json:"email"`
	LastName  string `json:"email"`
}

func FetchUser(email string, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (*User, error) {
	input := &dynamodb.GetItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"email": {
				S: aws.String(email),
			},
		},
		TableName: aws.String(tableName),
	}

	result, err := dynaClient.GetItem(input)
	if err != nil {
		return nil, errors.New(ErrorFailedToFetchRecord)
	}

	item := new(User)
	err = dynamodbattribute.UnmarshalMap(result.Item, item)
	if err != nil {
		return nil, errors.New(ErrorFailedToUnmarshalRecord)
	}

	return item, nil
}

func FetchUsers(tableName string, dynaClient dynamodbiface.DynamoDBAPI) (*[]User, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}

	result, err := dynaClient.Scan(input)

	if err != nil {
		return nil, errors.New(ErrorFailedToFetchRecord)
	}

	item := new([]User)
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, item)
	return item, nil
}

func CreateUser(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (*User, error) {
	var u User
	if err := json.Unmarshal([]byte(req.Body), &u); err != nil {
		return nil, errors.New(ErrorInvalidUserData)
	}

	if !validators.IsEmailValid(u.Email) {
		return nil, errors.New(ErrorInvalidEmail)
	}

	cu, err := FetchUser(u.Email, tableName, dynaClient)
	if err == nil || len(cu.Email) > 0 {
		return nil, errors.New(ErrorUserAlreadyExists)
	}

	av, err := dynamodbattribute.MarshalMap(u)

	if err != nil {
		return nil, errors.New(ErrorCouldNotMarshalRecord)
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}

	_, err = dynaClient.PutItem(input)

	if err != nil {
		return nil, errors.New(ErrorCouldNotDynamoDBPutItem)
	}

	return &u, nil
}

func UpdateUser(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (*User, error) {
	var u User

	if err := json.Unmarshal([]byte(req.Body), &u); err != nil {
		return nil, errors.New(ErrorInvalidUserData)
	}

	if !validators.IsEmailValid(u.Email) {
		return nil, errors.New(ErrorInvalidEmail)
	}

	cu, err := FetchUser(u.Email, tableName, dynaClient)
	if err != nil || len(cu.Email) == 0 {
		return nil, errors.New(ErrorUserDoesNotExist)
	}

	av, err := dynamodbattribute.MarshalMap(u)

	if err != nil {
		return nil, errors.New(ErrorCouldNotMarshalRecord)
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}

	_, err = dynaClient.PutItem(input)

	if err != nil {
		return nil, errors.New(ErrorCouldNotDynamoDBPutItem)
	}

	return &u, nil
}

func DeleteUser(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) error {
	email := req.PathParameters["email"]
	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"email": {
				S: aws.String(email),
			},
		},
		TableName: aws.String(tableName),
	}

	_, err := dynaClient.DeleteItem(input)
	if err != nil {
		return errors.New(ErrorCouldNotDeleteRecord)
	}

	return nil
}
