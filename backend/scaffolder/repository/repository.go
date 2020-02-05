package repository

import (
	"fmt"
	"path/filepath"
)

// Local Repository
type Local struct{}

// TemplateDefinition maps to whats stored in the repo
type TemplateDefinition struct {
	ID          string
	Name        string
	Description string
	OwnerID     string
}

// Load will return all the local templates
func (s *Local) Load() ([]*TemplateDefinition, error) {
	matches, err := filepath.Glob("templates/**/template-info.json")
	fmt.Println(matches)
}
