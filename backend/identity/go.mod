module github.com/spotify/backstage/identity

go 1.13

replace github.com/spotify/backstage/proto => ../proto

require (
	github.com/golang/mock v1.1.1
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	google.golang.org/grpc v1.27.0
)
