package app

import (
	"context"
	"fmt"
	"github.com/golang/protobuf/jsonpb"
	identity "github.com/spotify/backstage/backend/proto/identity/v1"
	inventory "github.com/spotify/backstage/backend/proto/inventory/v1"
	pb "github.com/spotify/backstage/backend/proto/scaffolder/v1"
	"github.com/spotify/backstage/scaffolder/fs"
	"github.com/spotify/backstage/scaffolder/lib"
	"github.com/spotify/backstage/scaffolder/repository"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
)

// Server is the inventory Grpc server
type Server struct {
	repository *repository.Repository
	github     *lib.Github
	fs         *fs.Filesystem
	cookie     *lib.Cutter
	git        *lib.Git
	inventory  inventory.InventoryClient
}

// NewServer creates a new server for with all the things
func NewServer() *Server {
	conn, err := grpc.Dial("inventory:50051", grpc.WithInsecure())

	if err != nil {
		log.Fatal("Cannot connect to inventory service")
	}

	return &Server{
		github:    lib.NewGithubClient(),
		inventory: inventory.NewInventoryClient(conn),
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
		return nil, status.Error(codes.Internal, fmt.Sprintf("Could not create repository %s/%s %s", req.Org, req.ComponentId, err))
	}

	// move the template into a temporary directory
	tempFolder, err := s.fs.PrepareTemplate(
		fs.Template{
			ID: req.TemplateId,
		},
	)

	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Could not prepare the template %s", err))
	}

	// get the optional metadatafields from the json
	marshaler := &jsonpb.Marshaler{}
	cutterMetadata, err := marshaler.MarshalToString(req.Metadata)

	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Could not marshal the cookiecutter metadata %s", err))
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
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to push the repository to Github %s", err))
	}

	// notify the inventory service
	_, err = s.inventory.CreateEntity(ctx, &inventory.CreateEntityRequest{
		Entity: &inventory.Entity{
			Uri: fmt.Sprintf("boss://service/%s", req.ComponentId),
			Facts: []*inventory.Fact{
				{
					Name:  "githubOwner",
					Value: os.Getenv("BOSS_GH_USERNAME"),
				},
				{
					Name:  "githubRepo",
					Value: req.ComponentId,
				},
				{
					Name:  "backstageTemplate",
					Value: req.TemplateId,
				},
			},
		},
	})

	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to register the entity in the inventory %s", err))
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
