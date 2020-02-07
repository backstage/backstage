package main

import (
	"log"
	"net"

	"github.com/spotify/backstage/builds/ghactions"
	"github.com/spotify/backstage/builds/service"
	buildsv1 "github.com/spotify/backstage/proto/builds/v1"
	inventoryv1 "github.com/spotify/backstage/proto/inventory/v1"

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

	conn, err := grpc.Dial("inventory:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatal("Cannot connect to inventory service")
	}

	inventory := inventoryv1.NewInventoryClient(conn)

	ghClient, err := ghactions.NewFromEnv()
	if err != nil {
		log.Fatalf("Failed to create github client, %s", err)
	}

	buildsv1.RegisterBuildsServer(grpcServer, service.New(ghClient, inventory))

	log.Println("Serving Builds Service")
	grpcServer.Serve(lis)
}
