package app

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"reflect"
	"testing"

	"github.com/spotify/backstage/inventory/storage"

	pb "github.com/spotify/backstage/proto/inventory/v1"
)

var entityURI = "boss://test/test"

func TestServer(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	t.Run("Listing Entities matching prefix", func(t *testing.T) {
		entity := &pb.Entity{Uri: entityURI}

		s.CreateEntity(context.Background(), &pb.CreateEntityRequest{Entity: entity})
		setFactReq := &pb.SetFactRequest{EntityUri: entityURI, Name: "test-name", Value: "test-value"}
		s.SetFact(context.Background(), setFactReq)

		list, err := s.ListEntities(context.Background(), &pb.ListEntitiesRequest{UriPrefix: ""})
		if err != nil {
			t.Errorf("ServerTest(ListEntities) could not list: %v", err)
		}
		if len(list.GetEntities()) != 1 {
			t.Errorf("ServerTest(ListEntities) expected %v items, got %v", 1, len(list.GetEntities()))
		}
		if list.GetEntities()[0].GetEntity().GetUri() != entityURI {
			t.Errorf("ServerTest(ListEntities) expected uri %v, got %v", "boss://test/test", list.GetEntities()[0].GetEntity().GetUri())
		}
		expectedFacts := []*pb.Fact{{Name: "test-name", Value: "test-value"}}
		if !reflect.DeepEqual(list.GetEntities()[0].GetFacts(), expectedFacts) {
			t.Errorf("ServerTest(ListEntities) got %v, wanted %v", list.GetEntities()[0].GetFacts(), expectedFacts)
		}
	})

	t.Run("Listing Entities not matching prefix", func(t *testing.T) {
		entity := &pb.Entity{Uri: entityURI}

		s.CreateEntity(context.Background(), &pb.CreateEntityRequest{Entity: entity})
		list, err := s.ListEntities(context.Background(), &pb.ListEntitiesRequest{UriPrefix: "boss://test2"})
		if err != nil {
			t.Errorf("ServerTest(TestServerListEntities) could not list: %v", err)
		}
		if len(list.GetEntities()) != 0 {
			t.Errorf("ServerTest(TestServerListEntities) expected %v items, got %v", 0, len(list.GetEntities()))
		}
	})

	t.Run("Creating entity", func(t *testing.T) {
		entity := &pb.Entity{Uri: entityURI}
		createReq := &pb.CreateEntityRequest{Entity: entity}
		resp, err := s.CreateEntity(context.Background(), createReq)
		if err != nil {
			t.Errorf("ServerTest(CreateEntity) got unexpected error %v", err)
		}
		if resp.GetEntity().GetUri() != entity.GetUri() {
			t.Errorf("ServerTest(CreateEntity) expected %v, but got %v", entity.GetUri(), resp.GetEntity().GetUri())
		}
	})

	t.Run("Get entity with included facts", func(t *testing.T) {
		setFactReq := &pb.SetFactRequest{EntityUri: entityURI, Name: "test-name", Value: "test-value"}
		s.SetFact(context.Background(), setFactReq)

		entity := &pb.Entity{Uri: entityURI}
		req := &pb.GetEntityRequest{Entity: entity}

		resp, err := s.GetEntity(context.Background(), req)
		if err != nil {
			t.Errorf("ServerTest(GetEntity) got unexpected error %v", err)
		}
		if resp == nil {
			t.Errorf("ServerTest(GetEntity) returned nil")
		}
		expectedFacts := []*pb.Fact{{Name: "test-name", Value: "test-value"}}
		if !reflect.DeepEqual(resp.GetFacts(), expectedFacts) {
			t.Errorf("ServerTest(GetEntity) got %v, wanted %v", resp.GetFacts(), expectedFacts)
		}
	})
	t.Run("Set fact for existing entity", func(t *testing.T) {
		entity := &pb.Entity{Uri: entityURI}
		createReq := &pb.CreateEntityRequest{Entity: entity}
		s.CreateEntity(context.Background(), createReq)

		req := &pb.SetFactRequest{EntityUri: entityURI, Name: "test-name", Value: "test-value"}
		resp, err := s.SetFact(context.Background(), req)
		if err != nil {
			t.Errorf("ServerTest(SetFact) got unexpected error %v", err)
		}
		if resp == nil {
			t.Errorf("ServerTest(SetFact) returned nil")
		}

		fact := &pb.Fact{Name: req.GetName(), Value: req.GetValue()}
		assertFact(t, resp.GetFact(), fact)
	})

	t.Run("Set fact for non-existing entity", func(t *testing.T) {
		req := &pb.SetFactRequest{EntityUri: entityURI, Name: "test-name", Value: "test-value"}
		resp, err := s.SetFact(context.Background(), req)
		if err != nil {
			t.Errorf("ServerTest(SetFact) got unexpected error %v", err)
		}
		if resp == nil {
			t.Errorf("ServerTest(SetFact) returned nil")
		}

		fact := &pb.Fact{Name: req.GetName(), Value: req.GetValue()}
		assertFact(t, resp.GetFact(), fact)
	})
}

func assertFact(t *testing.T, got, want *pb.Fact) {
	if !reflect.DeepEqual(got, want) {
		t.Errorf("ServerTest(SetFact) got %v, wanted %v", got, want)
	}
}

type TestStorage struct {
	Storage *storage.Storage
	Path    string
}

// NewTestStorage returns a TestStorage using a temporary path.
func NewTestStorage() *TestStorage {
	f, err := ioutil.TempFile("", "")
	if err != nil {
		panic(fmt.Sprintf("temp file: %s", err))
	}
	path := f.Name()
	f.Close()
	os.Remove(path)

	config := storage.Config{Path: path}
	storage, _ := storage.OpenStorage(config)
	return &TestStorage{Storage: storage, Path: path}
}

func (db *TestStorage) Close() {
	defer os.Remove(db.Path)
	db.Storage.Close()
}
