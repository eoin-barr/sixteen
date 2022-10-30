package server

import (
	"net/http"
	"rgb/internal/store"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func createPost(c *gin.Context) {
	post := c.MustGet(gin.BindKey).(*store.Post)
	user, err := currentUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := store.AddPost(user, post); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg":  "Post created successfully",
		"data": post,
	})
}

func indexPosts(c *gin.Context) {
	user, err := currentUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := store.FetchUserPosts(user); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg":  "Posts fetched successfully",
		"data": user.Posts,
	})

}

func updatePost(c *gin.Context) {
	jsonPost := c.MustGet(gin.BindKey).(*store.Post)
	user, err := currentUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	dbPost, err := store.FetchPost(jsonPost.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if user.ID != dbPost.UserID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	jsonPost.ModifiedAt = time.Now()
	if err := store.UpdatePost(jsonPost); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg":  "Post updated successfully",
		"data": jsonPost,
	})
}

func deletePost(c *gin.Context) {
	paramID := c.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "not valid id"})
		return
	}
	user, err := currentUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	post, err := store.FetchPost(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if user.ID != post.UserID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if err := store.DeletePost(post); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Post deleted successfully"})

}
