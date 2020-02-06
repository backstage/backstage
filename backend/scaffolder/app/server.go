package app

import (
	"context"
	"fmt"
	"github.com/golang/protobuf/jsonpb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os/exec"

	identity "github.com/spotify/backstage/backend/proto/identity/v1"
	pb "github.com/spotify/backstage/backend/proto/scaffolder/v1"
	"github.com/spotify/backstage/scaffolder/fs"
	"github.com/spotify/backstage/scaffolder/remote"
	"github.com/spotify/backstage/scaffolder/repository"
)

// Server is the inventory Grpc server
type Server struct {
	repository *repository.Repository
	github     *remote.Github
	fs         *fs.Filesystem
}

// NewServer creates a new server for with all the things
func NewServer() *Server {
	return &Server{
		github: remote.NewGithubClient(),
	}
}

// Create scaffolds the repo in github and then will create push to the repository
func (s *Server) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateReply, error) {
	// first create the repository with github
	log.Printf("Creating repository for Component %s", req.ComponentId)
	// repo := remote.Repository{
	// 	Name:    req.ComponentId,
	// 	Org:     req.Org,
	// 	Private: req.Private,
	// }

	// if _, err := s.github.CreateRepository(repo); err != nil {
	// 	return nil, status.Error(codes.Internal, fmt.Sprintf("Could not create repository %s/%s", req.Org, req.ComponentId))
	// }

	marshaller := &jsonpb.Marshaler{}
	d, e := marshaller.MarshalToString(req.Metadata)

	// move the template into a temporary directory
	tempFolder, err := s.fs.PrepareTemplate(
		fs.Template{
			ID:       req.TemplateId,
			Metadata: req.Metadata,
		},
	)
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Could not prepare the template"))
	}

	log.Printf("Created temporary folder %s", tempFolder)
	// TODO(blam): Probably need to wrap this in a timeout or something to avoid waiting to long
	cmd := exec.Command("cookiecutter", "--no-input", "-v", tempFolder)
	cmd.Dir = tempFolder
	err := cmd.Run()

	fmt.Println(output)
	fmt.Println(err)

	// use git bindings to add the remote with access token and push to the directory
	return nil, nil
}

// ListTemplates returns the local templatess
func (s *Server) ListTemplates(ctx context.Context, req *pb.Empty) (*pb.ListTemplatesReply, error) {
	// todo (blam): yes we currently read the disk on every load. but it's fine for now 🤷‍♂️
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
