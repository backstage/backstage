package main

import (
	"context"
	"log"
	"net"

	pb "github.com/spotify/backstage/backend/proto/scaffolder/v1"
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
	pb.RegisterScaffolderServer(grpcServer, &server{})

	log.Println("Serving Scaffolder Service")
	grpcServer.Serve(lis)
}

type server struct {
}

func (s *server) GetAllTemplates(ctx context.Context, req *pb.Empty) (*pb.GetAllTemplatesResponse, error) {
	return &pb.GetAllTemplatesResponse{}, nil
}