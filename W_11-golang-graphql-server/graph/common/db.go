package common

import (
	"github.com/eoin-barr/gql-postgres-2/graph/model"
	"gorm.io/driver/postgres"

	// "gorm.io/driver/sqlite"
	"gorm.io/gorm"
	// "gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDb() (*gorm.DB, error) {
	// var err error
	// db, err := gorm.Open(sqlite.Open("dev.db"), &gorm.Config{
	// 	Logger: logger.Default.LogMode(logger.Silent),
	// })
	// if err != nil {
	// 	return nil, err
	// }
	// db.AutoMigrate(&model.Todo{})
	// return db, nil
	db, err := gorm.Open(postgres.Open("postgres://postgres:postgres@localhost:5432/postgres"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&model.Todo{})
	DB = db
	return db, nil

}
