package app

import (
	"context"
	"fmt"

	"github.com/spotify/backstage/inventory/storage"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/spotify/backstage/proto/inventory/v1"
)

// Server is the inventory Grpc server
type Server struct {
	Storage *storage.Storage
}

func (s *Server) CreateEntity(ctx context.Context, req *pb.CreateEntityRequest) (*pb.CreateEntityReply, error) {
	err := s.Storage.CreateEntity(req.GetEntity().GetUri())
	if err != nil {
		return nil, status.Error(codes.Internal, "could not create entity")
	}
	return &pb.CreateEntityReply{Entity: req.GetEntity()}, nil
}

// GetEntity returns an inventory Entity with the selected facts
func (s *Server) GetEntity(ctx context.Context, req *pb.GetEntityRequest) (*pb.GetEntityReply, error) {
	var facts []*pb.Fact
	entityUri, err := s.Storage.GetEntity(req.GetEntity().GetUri())
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("could not get entity %v", err))
	}
	for _, factName := range req.GetIncludeFacts() {
		value, err := s.Storage.GetFact(entityUri, factName)
		if err != nil {
			return nil, status.Error(codes.Internal, fmt.Sprintf("could not get fact %v for %v" , factName, entityUri))
		}
		facts = append(facts, &pb.Fact{Name: factName, Value: value})
	}

	return &pb.GetEntityReply{Entity: &pb.Entity{Uri: entityUri}, Facts: facts}, nil
}

func (s *Server) SetFact(ctx context.Context, req *pb.SetFactRequest) (*pb.SetFactReply, error) {
	err := s.Storage.SetFact(req.EntityUri, req.Name, req.Value)
	if err != nil {
		return nil, status.Error(codes.Internal, "could not set fact")
	}
	return &pb.SetFactReply{Fact: &pb.Fact{Name: req.GetName(), Value: req.GetValue()}}, nil
}

func (s *Server) GetFact(ctx context.Context, req *pb.GetFactRequest) (*pb.GetFactReply, error) {
	val, err := s.Storage.GetFact(req.EntityUri, req.Name)
	if err != nil {
		return nil, status.Error(codes.Internal, "could not set fact")
	}
	return &pb.GetFactReply{Fact: &pb.Fact{Name: req.GetName(), Value: val}}, nil
}
