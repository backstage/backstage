module github.com/spotify/backstage/identity

go 1.13

replace github.com/spotify/backstage/proto => ../proto

require (
	github.com/golang/mock v1.1.1
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	golang.org/x/lint v0.0.0-20190313153728-d0100b6bd8b3 // indirect
	golang.org/x/tools v0.0.0-20190524140312-2c0ae7006135 // indirect
	google.golang.org/grpc v1.27.0
	honnef.co/go/tools v0.0.0-20190523083050-ea95bdfd59fc // indirect
)
