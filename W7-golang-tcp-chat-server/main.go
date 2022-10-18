package main

import (
	"log"
	"net"
)

func main() {
	// Initialise a new server
	s := NewServer()
	// Run the server using a go routine
	go s.run()

	// Listen for incoming tcp connections on port 8080
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("unable to start the server: %s", err.Error())
	}

	// Close the listener when the application closes
	defer listener.Close()
	log.Printf("started server on port => 8080")

	// Loop forever
	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Unable to accept connection: %s", err.Error())
			continue
		}

		// Handle each new connection
		c := s.newClient(conn)
		// Read client input using a go routine
		go c.readInput()
	}
}
