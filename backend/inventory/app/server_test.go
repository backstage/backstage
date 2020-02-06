package app

import (
	"context"
	"fmt"
	"github.com/spotify/backstage/inventory/storage"
	"io/ioutil"
	"os"
	"reflect"
	"testing"

	pb "github.com/spotify/backstage/proto/inventory/v1"
)

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
	if resp.GetEntity().GetUri() !=  entity.GetUri() {
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
	expectedFacts := []*pb.Fact{{Uri: "boss://test/test/test-name", Value: "test-value"}}
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
	fact := &pb.Fact{Uri: entity.GetUri() + "/" + req.Name, Value: "test-value"}
	if !reflect.DeepEqual(resp.GetFact(), fact) {
		t.Errorf("ServerTest(SetFact) got %v, wanted %v", resp.GetFact()	, fact)
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
	fact := &pb.Fact{Uri: entityUri + "/" + req.Name, Value: "test-value"}
	if !reflect.DeepEqual(resp.GetFact(), fact) {
		t.Errorf("ServerTest(SetFact) got %v, wanted %v", resp.GetFact()	, fact)
	}
}

type TestStorage struct {
	Storage *storage.Storage
	Path string
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

