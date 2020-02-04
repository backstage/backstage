package model

type IdentityData struct {
	Users  map[string]User
	Groups map[string]Group
}

type User struct {
	ID     string
	Name   string
	Groups []string
}

type Group struct {
	ID     string
	Users  []string
	Groups []string
}
