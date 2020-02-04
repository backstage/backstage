package app

import (
	"context"

	pb "github.com/spotify/backstage/inventory/protos"
)

// Server is the inventory GRPC server
type Server struct {
}

// GetEntity returns an inventory Entitity with the selected facts
func (s *Server) GetEntity(ctx context.Context, req *pb.GetEntityRequest) (*pb.GetEntityReply, error) {
	return &pb.GetEntityReply{Entity: req.GetEntity()}, nil
}
