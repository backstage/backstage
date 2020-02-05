package storage

import (
	"fmt"
	"os"

	"go.etcd.io/bbolt"
)

type Config struct {
	Path string
	Mode os.FileMode
}

type Storage struct {
	db *bbolt.DB
}

func OpenStorage(config Config) (*Storage, error) {
	if config.Path == "" {
		config.Path = "inventory.db"
	}
	if config.Mode == 0 {
		config.Mode = 0600
	}
	db, err := bbolt.Open(config.Path, config.Mode, nil)
	if err != nil {
		return nil, err
	}

	return &Storage{
		db: db,
	}, nil
}

func (s *Storage) Close() error {
	return s.db.Close()
}

func (s *Storage) SetFact(entityUri, name, value string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(entityUri))
		if err != nil {
			return err
		}
		return b.Put([]byte(name), []byte(value))
	})
}

func (s *Storage) GetFact(entityUri, name string) (string, error) {
	var value string

	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(entityUri))
		if b == nil {
			return fmt.Errorf("bucket '%s' does not exist", entityUri)
		}
		value = string(b.Get([]byte(name)))
		return nil
	})
	if err != nil {
		return "", err
	}

	return value, nil
}

func (s *Storage) CreateEntity(entityUri string) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(entityUri))
		if err != nil {
			return err
		}
		return nil
	})
}

func (s *Storage) GetEntity(entityUri string) (string, error) {
	err := s.db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(entityUri))
		if b == nil {
			return fmt.Errorf("bucket '%s' does not exist", entityUri)
		}
		return nil
	})

	if err != nil {
		return "", err
	}

	return entityUri, nil
}
