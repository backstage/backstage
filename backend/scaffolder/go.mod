module github.com/spotify/backstage/scaffolder

go 1.13

replace github.com/spotify/backstage/backend/proto => ../proto

require (
	github.com/spotify/backstage/backend/proto v0.0.0-00010101000000-000000000000 // indirect
	google.golang.org/grpc v1.27.0
)
