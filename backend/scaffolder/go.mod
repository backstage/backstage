module github.com/spotify/backstage/scaffolder

go 1.13

replace (
	github.com/spotify/backstage/backend/proto => ./../proto
	github.com/spotify/backstage/proto => ../proto
)

require (
	github.com/golang/protobuf v1.3.3
	github.com/google/go-github/v29 v29.0.2
	github.com/spotify/backstage/backend/proto v0.0.0-00010101000000-000000000000
	github.com/spotify/backstage/proto v0.0.0-00010101000000-000000000000
	golang.org/x/oauth2 v0.0.0-20180821212333-d2e6202438be
	google.golang.org/grpc v1.27.0
)
