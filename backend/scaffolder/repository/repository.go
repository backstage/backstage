package repository

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	var templateDefinitions []*TemplateDefinition

	templateInfoFilePaths, err := filepath.Glob("templates/**/template-info.json")

	if err != nil {
		fmt.Errorf("failed to load template-info files")
		return nil, err
	}

	for _, templatePath := range templateInfoFilePaths {
		content, err := ioutil.ReadFile(templatePath)
		if err != nil {
			fmt.Errorf("failed to load path for %s", templatePath)
			continue
		}

		definition := TemplateDefinition{}
		err = json.Unmarshal([]byte(content), &definition)
		if err != nil {
			fmt.Errorf("failed to unmarshal  %s", templatePath)
			continue
		}

		templateDefinitions = append(templateDefinitions, &definition)
	}

	return templateDefinitions, nil
}
