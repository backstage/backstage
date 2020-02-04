package service

import (
	"context"

	"github.com/spotify/backstage/identity/model"
	identityv1 "github.com/spotify/backstage/proto/identity/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type identityDataServer model.IdentityData

// New creates a new identity data server
func New(data *model.IdentityData) identityv1.IdentityServer {
	return (*identityDataServer)(data)
}

func (s *identityDataServer) GetUser(ctx context.Context, req *identityv1.GetUserRequest) (*identityv1.GetUserReply, error) {
	id := req.GetId()
	if id == "" {
		return nil, status.Error(codes.InvalidArgument, "ID is required in GetUserRequest")
	}

	user, ok := s.Users[id]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "User '%s' not found", id)
	}

	var replyGroups []*identityv1.Group
	for _, groupID := range user.Groups {
		replyGroups = append(replyGroups, &identityv1.Group{
			Id: groupID,
		})
	}

	return &identityv1.GetUserReply{
		User:   &identityv1.User{Id: user.ID, Name: user.Name},
		Groups: replyGroups,
	}, nil
}

func (s *identityDataServer) GetGroup(ctx context.Context, req *identityv1.GetGroupRequest) (*identityv1.GetGroupReply, error) {
	id := req.GetId()
	if id == "" {
		return nil, status.Error(codes.InvalidArgument, "ID is required in GetGroupRequest")
	}

	group, ok := s.Groups[id]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "Group '%s' not found", id)
	}

	var replyUsers []*identityv1.User
	for _, userID := range group.Users {
		replyUsers = append(replyUsers, &identityv1.User{
			Id: userID,
		})
	}

	var replyGroups []*identityv1.Group
	for _, groupID := range group.Groups {
		replyGroups = append(replyGroups, &identityv1.Group{
			Id: groupID,
		})
	}

	return &identityv1.GetGroupReply{
		Group: &identityv1.Group{Id: group.ID, Users: replyUsers, Groups: replyGroups},
	}, nil
}
