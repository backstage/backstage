package lib

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
)

// Cutter is the wrapper around cookiecutter
type Cutter struct {
}

// CookieCutterTemplate holds the template ID and metadata for copying
type CookieCutterTemplate struct {
	Path        string
	Metadata    string
	ComponentID string
}

// WriteMetadata runs cookiecutter in the folder provided
func (c *Cutter) WriteMetadata(template CookieCutterTemplate) error {
	var temporaryCookieCutter map[string]interface{}
	err := json.Unmarshal([]byte(template.Metadata), &temporaryCookieCutter)
	if err != nil {
		return err
	}

	temporaryCookieCutter["component_id"] = template.ComponentID
	finalMetadata, _ := json.Marshal(temporaryCookieCutter)

	file, err := os.Create(fmt.Sprintf("%s/cookiecutter.json", template.Path))

	if err != nil {
		return err
	}

	defer file.Close()

	_, err = file.Write(finalMetadata)

	return err
}

// Run will run the cookie cutter
func (c *Cutter) Run(template CookieCutterTemplate) error {
	// TODO(blam): Probably need to wrap this in a timeout or something to avoid waiting to long
	log.Printf("Running cookiecutter on %s", template.Path)
	log.Printf("With metadata %s", template.Metadata)

	cmd := exec.Command("cookiecutter", "--no-input", "-v", template.Path)
	cmd.Dir = template.Path
	output, err := cmd.Output()

	if err != nil {
		log.Printf("Cookie cutter failed with output: %s", output)
	}

	return err
}
