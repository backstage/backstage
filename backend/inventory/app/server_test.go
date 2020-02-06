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

func TestServerListEntities(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entity := &pb.Entity{Uri: "boss://test/test"}

	_, err := s.CreateEntity(context.Background(), &pb.CreateEntityRequest{Entity: entity})
	if err != nil {
		t.Errorf("ServerTest(TestServerListEntities) could not create: %v", err)
	}

	list, err := s.ListEntities(context.Background(), &pb.ListEntitiesRequest{UriPrefix: ""})
	if err != nil {
		t.Errorf("ServerTest(TestServerListEntities) could not list: %v", err)
	}
	if len(list.GetEntities()) != 1 {
		t.Errorf("ServerTest(TestServerListEntities) expected %v items, got %v", 1, len(list.GetEntities()))
	}
	if list.GetEntities()[0].GetUri() != "boss://test/test" {
		t.Errorf("ServerTest(TestServerListEntities) expected uri %v, got %v", "boss://test/test", list.GetEntities()[0].GetUri())
	}

	list, err = s.ListEntities(context.Background(), &pb.ListEntitiesRequest{UriPrefix: "boss://test2"})
	if err != nil {
		t.Errorf("ServerTest(TestServerListEntities) could not list: %v", err)
	}
	if len(list.GetEntities()) != 0 {
		t.Errorf("ServerTest(TestServerListEntities) expected %v items, got %v", 0, len(list.GetEntities()))
	}
}

func TestServerCreateEntity(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entity := &pb.Entity{Uri: "boss://test/test"}
	createReq := &pb.CreateEntityRequest{Entity: entity}
	resp, err := s.CreateEntity(context.Background(), createReq)
	if err != nil {
		t.Errorf("ServerTest(CreateEntity) got unexpected error %v", err)
	}
	if resp.GetEntity().GetUri() != entity.GetUri() {
		t.Errorf("ServerTest(CreateEntity) expected %v, but got %v", entity.GetUri(), resp.GetEntity().GetUri())
	}
}

func TestServerGetEntity(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entity := &pb.Entity{Uri: "boss://test/test"}
	createReq := &pb.CreateEntityRequest{Entity: entity}
	s.CreateEntity(context.Background(), createReq)

	req := &pb.GetEntityRequest{Entity: entity}
	resp, err := s.GetEntity(context.Background(), req)
	if err != nil {
		t.Errorf("ServerTest(GetEntity) got unexpected error %v", err)
	}
	if resp == nil {
		t.Errorf("ServerTest(GetEntity) returned nil")
	}
	if resp.GetEntity().GetUri() != entity.GetUri() {
		t.Errorf("ServerTest(GetEntity) got %v, wanted %v", resp.GetEntity().GetUri(), entity.GetUri())
	}
}

func TestServerGetEntityWithIncludedFacts(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entityUri := "boss://test/test"
	setFactReq := &pb.SetFactRequest{EntityUri: entityUri, Name: "test-name", Value: "test-value"}
	s.SetFact(context.Background(), setFactReq)

	entity := &pb.Entity{Uri: entityUri}
	req := &pb.GetEntityRequest{Entity: entity, IncludeFacts: []string{"test-name"}}

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
}

func TestServerSetFactForExistingEntity(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entity := &pb.Entity{Uri: "boss://test/test"}
	createReq := &pb.CreateEntityRequest{Entity: entity}
	s.CreateEntity(context.Background(), createReq)

	req := &pb.SetFactRequest{EntityUri: "boss://test/test", Name: "test-name", Value: "test-value"}
	resp, err := s.SetFact(context.Background(), req)
	if err != nil {
		t.Errorf("ServerTest(SetFact) got unexpected error %v", err)
	}
	if resp == nil {
		t.Errorf("ServerTest(SetFact) returned nil")
	}
	fact := &pb.Fact{Name: req.GetName(), Value: req.GetValue()}
	if !reflect.DeepEqual(resp.GetFact(), fact) {
		t.Errorf("ServerTest(SetFact) got %v, wanted %v", resp.GetFact(), fact)
	}
}

func TestServerSetFactForNonExistingEntity(t *testing.T) {
	testStorage := NewTestStorage()
	defer testStorage.Close()
	s := Server{Storage: testStorage.Storage}

	entityUri := "boss://test/test"
	req := &pb.SetFactRequest{EntityUri: entityUri, Name: "test-name", Value: "test-value"}
	resp, err := s.SetFact(context.Background(), req)
	if err != nil {
		t.Errorf("ServerTest(SetFact) got unexpected error %v", err)
	}
	if resp == nil {
		t.Errorf("ServerTest(SetFact) returned nil")
	}

	fact := &pb.Fact{Name: req.GetName(), Value: req.GetValue()}
	if !reflect.DeepEqual(resp.GetFact(), fact) {
		t.Errorf("ServerTest(SetFact) got %v, wanted %v", resp.GetFact(), fact)
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
