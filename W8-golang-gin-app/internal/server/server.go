package server

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"rgb/internal/conf"
	"rgb/internal/database"
	"rgb/internal/store"
	"syscall"
	"time"

	"github.com/rs/zerolog/log"
)

const InternalServerError = "Something went wrong!"

func Start(cfg conf.Config) {
	jwtSetup(cfg)
	store.SetDBConnection(database.NewDBOptions(cfg))
	router := setRouter(cfg)

	server := &http.Server{
		Addr:    cfg.Host + ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && errors.Is(err, http.ErrServerClosed) {
			log.Error().Err(err).Msg("Server ListenAndServe error")
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exiting")
}
