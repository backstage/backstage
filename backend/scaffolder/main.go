package main

import (
	"context"
	"log"
	"net"

	identityv1 "github.com/spotify/backstage/proto/identity/v1"
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
	identityv1.RegisterIdentityServer(grpcServer, &server{})

	log.Println("Serving Identity Service")
	grpcServer.Serve(lis)
}

type server struct {
}

func (s *server) GetUser(ctx context.Context, req *identityv1.GetUserRequest) (*identityv1.GetUserReply, error) {
	return &identityv1.GetUserReply{}, nil
}

func (s *server) GetGroup(ctx context.Context, req *identityv1.GetGroupRequest) (*identityv1.GetGroupReply, error) {
	return &identityv1.GetGroupReply{}, nil
}
