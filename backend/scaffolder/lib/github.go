package lib

import (
	"context"
	gh "github.com/google/go-github/v29/github"
	"golang.org/x/oauth2"
	"log"
	"os"
)

// Github is the exported struct
type Github struct {
	client *gh.Client
	ctx    *context.Context
}

// NewGithubClient returns a new client with the correct access token enabled
func NewGithubClient() *Github {
	accessToken := os.Getenv("BOSS_GH_ACCESS_TOKEN")

	if accessToken == "" {
		log.Fatal("No BOSS_GH_ACCESS_TOKEN set. Cannot continue")
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: accessToken},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := gh.NewClient(tc)

	return &Github{
		client: client,
		ctx:    &ctx,
	}
}

// Repository holds the information of the created repo
type Repository struct {
	Org     string
	Name    string
	Private bool
}

// CreateRepository will create the repository in Github ready for use by the scaffolder
func (g *Github) CreateRepository(repo Repository) (*gh.Repository, error) {
	ghRepo := &gh.Repository{
		Name:    &repo.Name,
		Private: &repo.Private,
	}

	var org string

	if repo.Org != "" {
		org = repo.Org
	}

	created, _, err := g.client.Repositories.Create(*g.ctx, org, ghRepo)

	return created, err
}
