module github.com/spotify/backstage/inventory

go 1.12

replace github.com/spotify/backstage/proto => ../proto

require (
	github.com/golang/protobuf v1.3.3
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	go.etcd.io/bbolt v1.3.3
	golang.org/x/lint v0.0.0-20190313153728-d0100b6bd8b3
	golang.org/x/tools v0.0.0-20190524140312-2c0ae7006135
	google.golang.org/grpc v1.27.0
	honnef.co/go/tools v0.0.0-20190523083050-ea95bdfd59fc
)
