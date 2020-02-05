package app

import (
	"context"
	identity "github.com/spotify/backstage/backend/proto/identity/v1"
	pb "github.com/spotify/backstage/proto/scaffolder/v1"
	"github.com/spotify/backstage/scaffolder/repository"
)

// Server is the inventory Grpc server
type Server struct {
	Repository *repository.Repository
}

// GetAllTemplates returns the local templatess
func (s *Server) GetAllTemplates(ctx context.Context, req *pb.Empty) (*pb.GetAllTemplatesReply, error) {
	_, err := s.Repository.Load()
	template := &pb.Template{
		Id:   "react-ssr-template",
		Name: "React SSR Template",
		User: &identity.User{
			Id:   "spotify",
			Name: "Spotify",
		},
	}

	templates := []*pb.Template{template}

	return &pb.GetAllTemplatesReply{
		Templates: templates,
	}, err
}
