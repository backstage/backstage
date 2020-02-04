package app

import (
	"context"
	"testing"

	pb "github.com/spotify/backstage/inventory/protos"
)

func TestServer(t *testing.T) {
	s := Server{}
	req := &pb.GetEntityRequest{Entity: &pb.Entity{Kind: "test", Id: "test"}}
	resp, err := s.GetEntity(context.Background(), req)
	if err != nil {
		t.Errorf("ServerTest(GetEntity) got unexpected error")
	}
	if resp.GetEntity().GetId() != req.GetEntity().GetId() {
		t.Errorf("ServerTest(GetEntity) got %v, wanted %v", resp.GetEntity().GetId(), req.GetEntity().GetId())
	}
}
