package main

import (
	"fmt"
	"net"

	"github.com/google/gopacket"
	layers "github.com/google/gopacket/layers"
)

var records map[string]string

func main() {
	records = map[string]string{
		"google.com": "74.125.193.102",
		"vercel.com": "76.76.21.142",
	}

	addr := net.UDPAddr{
		Port: 8090,
		IP:   net.ParseIP("127.0.0.1"),
	}
	u, _ := net.ListenUDP("udp", &addr)

	for {
		tmp := make([]byte, 1024)
		_, addr, _ := u.ReadFrom(tmp)
		clientAddr := addr
		packet := gopacket.NewPacket(tmp, layers.LayerTypeDNS, gopacket.Default)
		dnsPacket := packet.Layer(layers.LayerTypeDNS)
		tcp, _ := dnsPacket.(*layers.DNS)
		serveDNS(u, clientAddr, tcp)
	}
}

func serveDNS(u *net.UDPConn, clientAddr net.Addr, request *layers.DNS) {
	replyMess := request
	var dnsAnswer layers.DNSResourceRecord
	dnsAnswer.Type = layers.DNSTypeA
	var ip string
	var err error
	var ok bool
	ip, ok = records[string(request.Questions[0].Name)]
	if !ok {
		fmt.Println("No data present for that UP")
	}
	a, _, _ := net.ParseCIDR(ip + "/24")
	dnsAnswer.Type = layers.DNSTypeA
	dnsAnswer.IP = a
	dnsAnswer.Name = []byte(request.Questions[0].Name)
	fmt.Println(request.Questions[0].Name)
	dnsAnswer.Class = layers.DNSClassIN
	replyMess.QR = true
	replyMess.ANCount = 1
	replyMess.OpCode = layers.DNSOpCodeNotify
	replyMess.AA = true
	replyMess.Answers = append(replyMess.Answers, dnsAnswer)
	replyMess.ResponseCode = layers.DNSResponseCodeNoErr
	buf := gopacket.NewSerializeBuffer()
	opts := gopacket.SerializeOptions{}
	err = replyMess.SerializeTo(buf, opts)
	if err != nil {
		panic(err)
	}
	u.WriteTo(buf.Bytes(), clientAddr)
}