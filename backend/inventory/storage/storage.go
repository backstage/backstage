package storage

import (
	"fmt"
	"os"
	"strings"

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

func (s *Storage) SetFact(entityUri, name, value string) (err error) {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(entityUri))
		if err != nil {
			return err
		}
		err = b.Put([]byte(name), []byte(value))
		if err != nil {
			return err
		}
		return nil
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

func (s *Storage) ListEntities(uriPrefix string) ([]string, error) {
	entities := []string{}
	err := s.db.View(func(tx *bbolt.Tx) error {
		err := tx.ForEach(func(name []byte, b *bbolt.Bucket) error {
			namestring := string(name)
			if uriPrefix == "" || strings.HasPrefix(namestring, uriPrefix) {
				entities = append(entities, namestring)
			}
			return nil
		})

		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return entities, nil
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

func (s *Storage) GetFacts(entityUri string) (map[string]string, error) {
	facts := make(map[string]string)

	err := s.db.View(func(tx *bbolt.Tx) error {
		entityBucket := tx.Bucket([]byte(entityUri))
		if entityBucket == nil {
			return fmt.Errorf("bucket '%s' does not exist", entityUri)
		}
		c := entityBucket.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			facts[string(k)] = string(v)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return facts, nil
}
