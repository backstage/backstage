module github.com/spotify/backstage/builds

go 1.12

replace github.com/spotify/backstage/proto => ../proto

require (
	github.com/prometheus/common v0.9.1
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	google.golang.org/grpc v1.27.1
)
