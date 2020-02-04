package model

import (
	"encoding/json"
	"io/ioutil"
)

type IdentityFileData struct {
	Users []struct {
		ID     string   `json:"id"`
		Name   string   `json:"name"`
		Groups []string `json:"groups"`
	}
	Groups []struct {
		ID     string   `json:"id"`
		Groups []string `json:"groups"`
	}
}

// LoadIdentityData loads identity data from a json file.
func LoadIdentityData(path string) (*IdentityData, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var identityFileData IdentityFileData
	if err := json.Unmarshal(data, &identityFileData); err != nil {
		return nil, err
	}

	identityData := IdentityData{
		Users:  map[string]User{},
		Groups: map[string]Group{},
	}

	for _, user := range identityFileData.Users {
		identityData.Users[user.ID] = User{
			ID:     user.ID,
			Name:   user.Name,
			Groups: user.Groups,
		}
	}

	for _, group := range identityFileData.Groups {
		identityData.Groups[group.ID] = Group{
			ID:     group.ID,
			Groups: group.Groups,
		}
	}

	return &identityData, nil
}
