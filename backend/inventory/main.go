package main

import (
	"context"
	"log"
	"net"

	pb "github.com/spotify/backstage/inventory/protos"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

type inventoryServer struct {
}

func (s *inventoryServer) GetEntity(ctx context.Context, req *pb.GetEntityRequest) (*pb.GetEntityReply, error) {
	return &pb.GetEntityReply{}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterInventoryServer(grpcServer, &inventoryServer{})
	grpcServer.Serve(lis)
}
