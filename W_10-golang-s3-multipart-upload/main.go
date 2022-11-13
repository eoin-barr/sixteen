package main

import (
	"bytes"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

// Defining constant variables
const (
	BUCKET_NAME = "aws-s3-upload-test-4"
	REGION      = "eu-west-1"
	FILE        = "test.mov"
	PART_SIZE   = 5 * 1024 * 1024
	RETRIES     = 3
)

// Declaring the s3 session
var (
	s3session *s3.S3
)

// Initializing the s3 session
func init() {
	s3session = s3.New(session.Must(session.NewSession(&aws.Config{
		Region: aws.String(REGION),
	})))
}

func main() {
	// Opening the file
	file, err := os.Open(FILE)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// Getting the file size
	stats, _ := file.Stat()
	fileSize := stats.Size()

	// Create a buffer to keep parts of the file
	buffer := make([]byte, fileSize)
	file.Read(buffer)

	// Create an expiry time for the upload to stop if not complete
	expiryDate := time.Now().AddDate(0, 0, 1)
	// Creating the multipart upload
	createdResp, err := s3session.CreateMultipartUpload(&s3.CreateMultipartUploadInput{
		Bucket:  aws.String(BUCKET_NAME),
		Key:     aws.String(file.Name()),
		Expires: &expiryDate,
	})

	if err != nil {
		fmt.Println(err)
		return
	}

	// Upload the file in parts
	var start, currentSize int
	var remaining = int(fileSize)
	var partNum = 1
	var completedParts []*s3.CompletedPart

	// Loop through the file and upload it in parts
	for start = 0; remaining != 0; start += PART_SIZE {
		if remaining < PART_SIZE {
			currentSize = remaining
		} else {
			currentSize = PART_SIZE
		}
		// Upload the part
		completed, err := Upload(createdResp, buffer[start:start+currentSize], partNum)
		if err != nil {
			_, err = s3session.AbortMultipartUpload(&s3.AbortMultipartUploadInput{
				Bucket:   createdResp.Bucket,
				Key:      createdResp.Key,
				UploadId: createdResp.UploadId,
			})

			if err != nil {
				fmt.Println(err)
				return
			}
		}

		// Add the part to the completed parts
		remaining -= currentSize
		fmt.Printf("Part %v complete, %v bytes remaining\n", partNum, remaining)
		partNum++
		completedParts = append(completedParts, completed)
	}

	// Complete the upload
	resp, err := s3session.CompleteMultipartUpload(&s3.CompleteMultipartUploadInput{
		Bucket:   createdResp.Bucket,
		Key:      createdResp.Key,
		UploadId: createdResp.UploadId,
		MultipartUpload: &s3.CompletedMultipartUpload{
			Parts: completedParts,
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	} else {
		fmt.Println(resp.String())
	}
}

func Upload(resp *s3.CreateMultipartUploadOutput, fileBytes []byte, partNum int) (completedPart *s3.CompletedPart, err error) {
	var try int
	// If have attempted to upload the part 3 times, return an error
	for try <= RETRIES {
		uploadResp, err := s3session.UploadPart(&s3.UploadPartInput{
			Body:          bytes.NewReader(fileBytes),
			Bucket:        resp.Bucket,
			Key:           resp.Key,
			PartNumber:    aws.Int64(int64(partNum)),
			UploadId:      resp.UploadId,
			ContentLength: aws.Int64(int64(len(fileBytes))),
		})
		if err != nil {
			fmt.Println(err)
			if try == RETRIES {
				return nil, err
			} else {
				try++
			}
		} else {
			// Return the completed part
			return &s3.CompletedPart{
				ETag:       uploadResp.ETag,
				PartNumber: aws.Int64(int64(partNum)),
			}, nil
		}
	}
	return nil, nil
}
