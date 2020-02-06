module github.com/spotify/backstage/inventory

go 1.12

replace github.com/spotify/backstage/proto => ../proto

require (
	github.com/golang/protobuf v1.3.3
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	go.etcd.io/bbolt v1.3.3
	google.golang.org/grpc v1.27.0
)
