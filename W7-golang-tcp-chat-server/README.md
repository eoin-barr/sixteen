# Golang TCP Chat

![golang tcp chat](assets/tcp-chat.gif)

This project was inspired by [pltov's](https://github.com/plutov) golang tcp server. It's a simple project that works in conjunction with `telnet` which handles creating a remote connection with a system over a TCP network. The go server supports several commands which enable clients to create, join and leave chat rooms as well as to send messages once inside a chat room.

## Technologies used

| Golang |
| ------ |

## How run this locally

1. Download `telnet` or a similar package to handle creating a remote connection with a system over a TCP network

```bash
// mac
brew install telnet
```

2. Clone this repository.

3. Navigate to the root of the repository and run the following commands to run the server:

```bash
go build .
./W7-golang-tcp-chat-server
```

4. Open a new terminal and run the following command to create a client:

```bash
telnet localhost 8080
```

5. Run `/commands` to see a list of all the availbale server commands.
