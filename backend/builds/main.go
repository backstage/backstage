package main

import (
	"log"
	"net"

	"github.com/spotify/backstage/builds/ghactions"
	"github.com/spotify/backstage/builds/service"
	buildsv1 "github.com/spotify/backstage/proto/builds/v1"

	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()

	ghClient, err := ghactions.NewFromEnv()
	if err != nil {
		log.Fatalf("Failed to create github client, %s", err)
	}

	buildsv1.RegisterBuildsServer(grpcServer, service.New(ghClient))

	log.Println("Serving Builds Service")
	grpcServer.Serve(lis)
}
