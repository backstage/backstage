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
	// todo (blam): yes we currently read the disk on every load. but it's fine for now 🤷‍♂️
	definitions, err := s.Repository.Load()
	var templates []*pb.Template

	for _, definition := range definitions {
		template := &pb.Template{
			Id:          definition.ID,
			Name:        definition.Name,
			Description: definition.Description,
			// need to actually call the idenity service here to get the
			// actual user and propgate back when needed.
			User: &identity.User{
				Id:   "spotify",
				Name: "Spotify",
			},
		}

		templates = append(templates, template)
	}

	return &pb.GetAllTemplatesReply{
		Templates: templates,
	}, err
}
