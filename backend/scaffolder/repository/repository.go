package repository

import (
	"fmt"
	"path/filepath"
)

// Repository Repository
type Repository struct{}

// TemplateDefinition maps to whats stored in the repo
type TemplateDefinition struct {
	ID          string
	Name        string
	Description string
	OwnerID     string
}

// Load will return all the Repository templates
func (s *Repository) Load() ([]*TemplateDefinition, error) {
	matches, err := filepath.Glob("templates/**/template-info.json")
	fmt.Println(matches)

	return []*TemplateDefinition{}, err
}
