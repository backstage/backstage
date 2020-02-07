package config

import (
	"fmt"
	"github.com/spotify/backstage/inventory/storage"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/kardianos/osext"
	"github.com/sirupsen/logrus"
)

// Config struct holds the current configuration
type Config struct {
	Server struct {
		Address string
		Port    int
	}

	Logging struct {
		Format string
		Level  string
	}

	DB storage.Config
}

// Initialize a new Config
func Initialize(configFile string) *Config {
	cfg := DefaultConfig()
	ReadConfigFile(cfg, getConfigFilePath(configFile))

	return cfg
}

// DefaultConfig returns a Config struct with default values
func DefaultConfig() *Config {
	cfg := &Config{}

	cfg.Server.Address = "0.0.0.0"
	cfg.Server.Port = 50051

	cfg.Logging.Format = "text"
	cfg.Logging.Level = "DEBUG"

	return cfg
}

func getConfigFilePath(configPath string) string {
	if configPath != "" {
		if _, err := os.Stat(configPath); err == nil {
			return configPath
		}
		panic(fmt.Sprintf("unable to open %s.", configPath))
	}
	path, _ := osext.ExecutableFolder()
	path = fmt.Sprintf("%s/config.toml", path)
	if _, err := os.Open(path); err == nil {
		return path
	}
	return ""
}

func ReadConfigFile(cfg *Config, path string) {
	_, err := os.Stat(path)
	if err != nil {
		return
	}

	if _, err := toml.DecodeFile(path, cfg); err != nil {
		logrus.WithError(err).Fatal("unable to read config")
	}
}