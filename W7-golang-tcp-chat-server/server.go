package main

import (
	"errors"
	"fmt"
	"log"
	"net"
	"strings"
)

// Define a server type
type server struct {
	rooms    map[string]*room
	commands chan command
}

// Function which creates a new server and returns a pointer to it
func NewServer() *server {
	return &server{
		rooms:    make(map[string]*room),
		commands: make(chan command),
	}
}

// Function which starts the server
func (s *server) run() {
	for cmd := range s.commands {
		switch cmd.id {
		case CMD_NAME:
			s.name(cmd.client, cmd.args)
		case CMD_COMMANDS:
			s.getCommands(cmd.client, cmd.args)
		case CMD_JOIN:
			s.join(cmd.client, cmd.args)
		case CMD_ROOMS:
			s.listRooms(cmd.client, cmd.args)
		case CMD_MSG:
			s.msg(cmd.client, cmd.args)
		case CMD_QUERY:
			s.query(cmd.client, cmd.args)
		case CMD_LEAVE:
			s.leave(cmd.client, cmd.args)
		case CMD_QUIT:
			s.quit(cmd.client, cmd.args)
		}
	}
}

func (s *server) newClient(conn net.Conn) *client {
	log.Printf("New client has connected: %s", conn.RemoteAddr().String())

	return &client{
		conn:     conn,
		name:     "anonymous",
		commands: s.commands,
	}
}

/**
 * **************************************************************************************
 * name
 * **************************************************************************************
 */
func (s *server) name(c *client, args []string) {
	// If the user didn't provide a name, return an error
	if len(args) < 2 {
		c.err(fmt.Errorf("not enough arguments. Usage: /name <name>"))
	}

	// Iterate over all rooms
	for _, r := range s.rooms {
		// Iterate over all members in the room
		for _, m := range r.members {
			// Check if the name is already taken
			if m.name == args[1] {
				c.err(fmt.Errorf("name %s is already taken", args[1]))
				return
			}
		}
	}

	// Set the name of the client
	c.name = args[1]
	c.msg(fmt.Sprintf("Hey, %s !", c.name))
}

/**
 * **************************************************************************************
 * getCommands
 * **************************************************************************************
 */
func (s *server) getCommands(c *client, args []string) {
	c.msg(
		"Available commands: \n" +
			"*********************************************************\n" +
			"/name <your-name>   :=> Set your name \n" +
			"/join <room-name>   :=> Join a chat room \n" +
			"/msg <meesage>      :=> Send a message \n" +
			"/rooms              :=> List all Available chat rooms \n" +
			"/query              :=> Print the chat room currently in \n" +
			"/leave              :=> Leave a chat room \n" +
			"/quit               :=> Quit the application \n" +
			"*********************************************************")
}

/**
 * **************************************************************************************
 * join
 * **************************************************************************************
 */
func (s *server) join(c *client, args []string) {
	if len(args) < 2 {
		c.err(fmt.Errorf("not enough arguments. Usage: /join <room-name>"))
	}

	if c.name == "anonymous" {
		c.err(fmt.Errorf("you must set a name before you can join a room"))
		return
	}

	roomName := args[1]

	// If  client is already in a room, remove them from the room
	if (c.room != nil) && (c.room.name == roomName) {
		s.quitCurrentRoom(c)
		c.msg(fmt.Sprintf("Left room %s", roomName))
		return
	}

	// If the room doesn't exist, create it
	r, ok := s.rooms[roomName]
	if !ok {
		r = &room{
			name:    roomName,
			members: make(map[net.Addr]*client),
		}
		s.rooms[roomName] = r
		c.msg(fmt.Sprintf("Room %s is being created 👷‍♂️🛠", roomName))
	}

	r.members[c.conn.RemoteAddr()] = c
	c.room = r
	r.broadcast(c, fmt.Sprintf("%s has joined the room", c.name))
	c.msg(fmt.Sprintf("Welcome to %s, %s !", r.name, c.name))
}

/**
 * **************************************************************************************
 * msg
 * **************************************************************************************
 */
func (s *server) msg(c *client, args []string) {
	if len(args) < 2 {
		c.err(errors.New("not enough arguments. Usage: /msg <message>"))
		return
	}
	if c.room == nil {
		c.err(errors.New("you must join a room before you can send a message"))
		return
	}
	c.room.broadcast(c, c.name+": "+strings.Join(args[1:], " "))
}

/**
 * **************************************************************************************
 * query
 * **************************************************************************************
 */
func (s *server) query(c *client, args []string) {
	room := c.room
	if room == nil {
		c.msg("You are not in a room !")
	} else {
		c.msg(fmt.Sprintf("You are in room %s", room.name))
	}
}

/**
 * **************************************************************************************
 * leave
 * **************************************************************************************
 */
func (s *server) leave(c *client, args []string) {
	if c.room == nil {
		c.err(fmt.Errorf("you are not in a room"))
		return
	}
	c.msg(fmt.Sprintf("Left room %s", c.room.name))
	s.quitCurrentRoom(c)
}

/**
 * **************************************************************************************
 * quit
 * **************************************************************************************
 */
func (s *server) quit(c *client, args []string) {
	log.Printf("Client has disconnected: %s", c.conn.RemoteAddr().String())
	s.quitCurrentRoom(c)
	c.msg("Sad to see you go :(")
	c.conn.Close()
}

/**
 * **************************************************************************************
 * helper functions
 * **************************************************************************************
 */
func (s *server) quitCurrentRoom(c *client) {
	if c.room != nil {
		oldRoom := s.rooms[c.room.name]
		delete(s.rooms[c.room.name].members, c.conn.RemoteAddr())
		c.room = nil
		oldRoom.broadcast(c, fmt.Sprintf("%s has left the room", c.name))
	}
}

func (s *server) listRooms(c *client, args []string) {
	var rooms []string
	for name := range s.rooms {
		rooms = append(rooms, name)
	}
	c.msg(fmt.Sprintf("Available rooms are: %s", strings.Join(rooms, ", ")))
}
