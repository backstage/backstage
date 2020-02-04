package main

import (
	"log"
	"net"

	"github.com/spotify/backstage/identity/model"
	"github.com/spotify/backstage/identity/service"

	identityv1 "github.com/spotify/backstage/proto/identity/v1"
	"google.golang.org/grpc"
)

const (
	port     = ":50051"
	dataPath = "./identity-data.json"
)

func main() {
	data, err := model.LoadIdentityData(dataPath)
	if err != nil {
		log.Fatalf("failed to load identity data, %s", err)
	}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	identityv1.RegisterIdentityServer(grpcServer, service.New(data))

	log.Println("Serving Identity Service")
	grpcServer.Serve(lis)
}
