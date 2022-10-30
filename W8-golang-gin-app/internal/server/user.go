package server

import (
	"net/http"
	"rgb/internal/store"

	"github.com/gin-gonic/gin"
)

func signUp(c *gin.Context) {
	user := c.MustGet(gin.BindKey).(*store.User)
	if err := store.AddUser(user); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg": "Signed up successfully",
		"jwt": generateJWT(user),
	})
}

func signIn(c *gin.Context) {
	user := c.MustGet(gin.BindKey).(*store.User)
	user, err := store.Authenticate(user.Username, user.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Sign in failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg": "Signed in successfully",
		"jwt": generateJWT(user),
	})
}
