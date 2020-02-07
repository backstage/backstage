package main

import (
	"flag"
	"fmt"
	"github.com/spotify/backstage/inventory/config"
	"github.com/spotify/backstage/inventory/storage"
	"net"
	"os"
	"os/signal"

	"github.com/spotify/backstage/inventory/app"
	pb "github.com/spotify/backstage/proto/inventory/v1"

	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

func main() {
	configFile := flag.String("config", "", "specify a config.toml file")
	flag.Parse()
	go catchInterrupt()

	cfg := config.Initialize(*configFile)
	setupLogging(cfg)
	storage := getStorage(cfg)

	address := fmt.Sprintf("%v:%v", cfg.Server.Address, cfg.Server.Port)
	lis, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	log.Infof("inventory service listening on: %v", address)

	grpcServer := grpc.NewServer()
	pb.RegisterInventoryServer(grpcServer, &app.Server{Storage: storage})
	grpcServer.Serve(lis)
}

func getStorage(cfg *config.Config) *storage.Storage {
	storage, err := storage.OpenStorage(cfg.DB)
	if err != nil {
		log.Fatalf("could not open database: %v", err)
		os.Exit(1)
	}
	return storage
}

func setupLogging(cfg *config.Config) {
	if cfg.Logging.Format == "json" {
		log.SetFormatter(&log.JSONFormatter{
			FieldMap: log.FieldMap{
				log.FieldKeyLevel: "severity",
			},
		})
	}
	level, err := log.ParseLevel(cfg.Logging.Level)
	if err != nil {
		level = log.InfoLevel
	}
	log.SetOutput(os.Stdout)
	log.SetLevel(level)
}

func catchInterrupt() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill)
	s := <-c
	if s != os.Interrupt && s != os.Kill {
		return
	}
	log.Info("shutting down...")
	os.Exit(0)
}
