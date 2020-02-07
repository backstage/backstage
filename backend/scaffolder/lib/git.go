package lib

import (
	"fmt"
	"gopkg.in/src-d/go-git.v4"
	"gopkg.in/src-d/go-git.v4/config"
	"gopkg.in/src-d/go-git.v4/plumbing/object"
	"log"
	"os"
	"time"
)

// Git is the wrapper around Git
type Git struct{}

// PushRepositoryOptions holds the arguments for the push
type PushRepositoryOptions struct {
	TempFolder  string
	ComponentID string
	Org         string
}

// Push will push the repository to github
func (g *Git) Push(options PushRepositoryOptions) error {
	// use git bindings to add the remote with access token and push to the directory
	repo, err := git.PlainInit(
		fmt.Sprintf("%s/%s", options.TempFolder, options.ComponentID),
		false,
	)

	if err != nil {
		log.Printf("Failed to init the git repository")
		return err
	}

	worktree, err := repo.Worktree()
	if err != nil {
		log.Printf("Failed to create the worktree")
		return err
	}

	_, err = worktree.Add(".")
	if err != nil {
		log.Printf("Failed to add the files to the worktre")
		return err
	}

	_, err = worktree.Commit("Initial Commit", &git.CommitOptions{
		Author: &object.Signature{
			Name:  "Backstage",
			Email: "backstage@spotfy.com",
			When:  time.Now(),
		},
	})

	if err != nil {
		log.Printf("Failed to create the initial commit")
		return err
	}

	var org string = os.Getenv("BOSS_GH_USERNAME")
	if options.Org != "" {
		org = options.Org
	}

	remote := fmt.Sprintf(
		"https://%s:%s@github.com/%s/%s.git",
		os.Getenv("BOSS_GH_USERNAME"),
		os.Getenv("BOSS_GH_ACCESS_TOKEN"),
		org,
		options.ComponentID,
	)

	_, err = repo.CreateRemote(&config.RemoteConfig{
		Name: "github",
		URLs: []string{remote},
	})

	if err != nil {
		log.Printf("Failed to create the remote")
		return err
	}

	err = repo.Push(&git.PushOptions{
		RemoteName: "github",
	})

	if err != nil {
		log.Printf("Failled to push the repository")
		return err
	}

	return nil
}
