package main

import (
	"log"
	"net"

	"github.com/spotify/backstage/inventory/app"
	pb "github.com/spotify/backstage/proto/inventory/v1"

	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterInventoryServer(grpcServer, &app.Server{})
	grpcServer.Serve(lis)
}
