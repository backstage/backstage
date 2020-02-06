package service

import (
	"context"
	"fmt"
	"regexp"

	"github.com/spotify/backstage/builds/ghactions"
	buildsv1 "github.com/spotify/backstage/proto/builds/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type service struct {
	ghClient *ghactions.Client
}

var _ buildsv1.BuildsServer = (*service)(nil)

// New creates a new identity data server
func New(ghClient *ghactions.Client) buildsv1.BuildsServer {
	return &service{ghClient}
}

func (s *service) ListBuilds(ctx context.Context, req *buildsv1.ListBuildsRequest) (*buildsv1.ListBuildsReply, error) {
	owner := "spotify"
	repo := "backstage"

	result, err := s.ghClient.ListWorkflowRuns(ctx, owner, repo)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to fetch workflow runs for %s/%s, %s", owner, repo, err)
	}

	builds := make([]*buildsv1.Build, len(result.Runs))

	for i, run := range result.Runs {
		builds[i] = s.transformBuild(owner, repo, &run)
	}

	return &buildsv1.ListBuildsReply{
		EntityUri: "",
		Builds:    builds,
	}, nil
}

func (s *service) GetBuild(ctx context.Context, req *buildsv1.GetBuildRequest) (*buildsv1.GetBuildReply, error) {
	uri := req.GetBuildUri()

	owner, repo, runID, err := s.parseBuildURI(uri)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Invalid build URI '%s', %s", uri, err)
	}

	run, err := s.ghClient.GetWorkflowRun(ctx, owner, repo, runID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to fetch workflow run for %s/%s/%s, %s", owner, repo, runID, err)
	}

	return &buildsv1.GetBuildReply{
		Build: s.transformBuild(owner, repo, run),
		Details: &buildsv1.BuildDetails{
			Author:      run.HeadCommit.Author.Name,
			LogUrl:      run.LogsURL,
			OverviewUrl: run.HTMLURL,
		},
	}, nil
}

func (s *service) transformBuild(owner, repo string, run *ghactions.WorkflowRunResponse) *buildsv1.Build {
	stat := buildsv1.BuildStatus_NULL
	switch run.Status {
	case "queued":
		stat = buildsv1.BuildStatus_PENDING
	case "in_progress":
		stat = buildsv1.BuildStatus_RUNNING
	case "completed":
		if run.Conclusion != nil {
			switch *run.Conclusion {
			case "success":
				stat = buildsv1.BuildStatus_SUCCESS
			case "neutral":
				stat = buildsv1.BuildStatus_SUCCESS
			case "failure":
				stat = buildsv1.BuildStatus_FAILURE
			case "cancelled":
				stat = buildsv1.BuildStatus_FAILURE
			case "timed_out":
				stat = buildsv1.BuildStatus_FAILURE
			case "action_required":
				stat = buildsv1.BuildStatus_RUNNING
			}
		}
	}

	return &buildsv1.Build{
		Uri:      fmt.Sprintf("entity:build:%s/%s/%d", owner, repo, run.ID),
		CommitId: run.HeadCommit.ID,
		Message:  run.HeadCommit.Message,
		Status:   stat,
	}
}

var entityURIRegex = regexp.MustCompile("^entity:build:([^/:]+)/([^/:]+)/([^/:]+)$")

func (s *service) parseBuildURI(uri string) (owner, repo, runID string, err error) {
	if uri == "" {
		return "", "", "", fmt.Errorf("uri is empty")
	}

	match := entityURIRegex.FindStringSubmatch(uri)
	if err != nil {
		return "", "", "", fmt.Errorf("uri does not match")
	}

	return match[1], match[2], match[3], nil
}
