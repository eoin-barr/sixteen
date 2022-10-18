package main

import "net"

type room struct {
	name    string
	members map[net.Addr]*client
}

func (r *room) broadcast(sender *client, msg string) {
	// Iterating over the map of members and sending the message to each client
	for addr, m := range r.members {
		// Only send the message to the other clients (not the sender)
		if addr != sender.conn.RemoteAddr() {
			m.msg(msg)
		}
	}
}
