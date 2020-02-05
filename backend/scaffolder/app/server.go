package app

import (
	"context"
	"fmt"
	"github.com/spotify/backstage/scaffolder/repository"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/spotify/backstage/proto/scaffolder/v1"
)

// Server is the inventory Grpc server
type Server struct {
	Repository *repsoitory.Repository
}

// GetAllTemplates returns the local templatess
func (s *server) GetAllTemplates(ctx context.Context, req *pb.Empty) (*pb.GetAllTemplatesResponse, error) {
	err, localTemplates := s.repostiory.Load()
	template := &pb.Template{
		Id:   "react-ssr-template",
		Name: "React SSR Template",
		User: &identity.User{
			Id:   "spotify",
			Name: "Spotify",
		},
	}

	templates := []*pb.Template{template}

	return &pb.GetAllTemplatesResponse{
		Templates: templates,
	}, nil
}
