package app

import (
	"context"
	"fmt"
	"github.com/golang/protobuf/jsonpb"
	identity "github.com/spotify/backstage/backend/proto/identity/v1"
	pb "github.com/spotify/backstage/backend/proto/scaffolder/v1"
	"github.com/spotify/backstage/scaffolder/fs"
	"github.com/spotify/backstage/scaffolder/lib"
	"github.com/spotify/backstage/scaffolder/repository"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
)

// Server is the inventory Grpc server
type Server struct {
	repository *repository.Repository
	github     *lib.Github
	fs         *fs.Filesystem
	cookie     *lib.Cutter
	git        *lib.Git
}

// NewServer creates a new server for with all the things
func NewServer() *Server {
	return &Server{
		github: lib.NewGithubClient(),
	}
}

// Create scaffolds the repo in github and then will create push to the repository
func (s *Server) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateReply, error) {
	// first create the repository with github
	log.Printf("Creating repository for Component %s", req.ComponentId)
	repo := lib.Repository{
		Name:    req.ComponentId,
		Org:     req.Org,
		Private: req.Private,
	}
	if _, err := s.github.CreateRepository(repo); err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Could not create repository %s/%s", req.Org, req.ComponentId))
	}

	// move the template into a temporary directory
	tempFolder, err := s.fs.PrepareTemplate(
		fs.Template{
			ID: req.TemplateId,
		},
	)

	if err != nil {
		return nil, status.Error(codes.Internal, "Could not prepare the template")
	}

	// get the optional metadatafields from the json
	marshaler := &jsonpb.Marshaler{}
	cutterMetadata, err := marshaler.MarshalToString(req.Metadata)

	if err != nil {
		return nil, status.Error(codes.Internal, "Could not marshal the cookiecutter metadata")
	}

	cookieTemplate := lib.CookieCutterTemplate{
		Path:        tempFolder,
		ComponentID: req.ComponentId,
		Metadata:    cutterMetadata,
	}

	// create the cookicutter json
	if err := s.cookie.WriteMetadata(cookieTemplate); err != nil {
		return nil, status.Error(codes.Internal, "Could not write cookie metadata")
	}

	// run the cookiecutter on the folder
	if err := s.cookie.Run(cookieTemplate); err != nil {
		return nil, status.Error(codes.Internal, "Failed to run the cookie cutter")
	}

	// push to github
	pushOptions := lib.PushRepositoryOptions{
		TempFolder:  tempFolder,
		ComponentID: req.ComponentId,
		Org:         req.Org,
	}

	if err := s.git.Push(pushOptions); err != nil {
		return nil, status.Error(codes.Internal, "Failed to push the repository to Github")
	}

	return &pb.CreateReply{
		ComponentId: req.ComponentId,
	}, nil
}

// ListTemplates returns the local templatess
func (s *Server) ListTemplates(ctx context.Context, req *pb.Empty) (*pb.ListTemplatesReply, error) {
	// TODO(blam): yes we currently read the disk on every load. but it's fine for now 🤷‍♂️
	definitions, err := s.repository.Load()
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

	return &pb.ListTemplatesReply{
		Templates: templates,
	}, err
}
