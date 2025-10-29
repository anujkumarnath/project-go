package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
	router.GET("/users/:email", getUser)
	router.POST("/users", addUser)
	router.PUT("/users/:email", updateUser)
	router.DELETE("/users/:email", deleteUser)

	router.Run("localhost:8080")
}

type User struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Dob   string `json:"dob"`
}

var users = []User{
	{Email: "anujkumarnath@gmail.com", Name: "Anuj Kumar Nath", Dob: "1997-10-28T13:45:00.000Z"},
	{Email: "abc@def.com", Name: "Abc", Dob: "1994-04-01T13:45:00.000Z"},
	{Email: "ghi@jlk.com", Name: "Ghi", Dob: "1992-01-11T13:45:00.000Z"},
}

func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, users)
}

func addUser(c *gin.Context) {
	var newUser User

	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	users = append(users, newUser)
	c.JSON(http.StatusCreated, newUser)
}

func updateUser(c *gin.Context) {
	email := c.Param("email")
	for index := range users {
		if users[index].Email == email {
			var inputUser struct {
				Name  *string `json:"name"`	
				Email *string `json:"email"`	
				Dob   *string `json:"dob"`	
			}

			if err := c.BindJSON(&inputUser); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}

			fmt.Println("found user, updating", users[index].Name)

			if inputUser.Name != nil {
				users[index].Name  = *inputUser.Name
			}

			if inputUser.Email != nil {
				users[index].Email = *inputUser.Email
			}

			if inputUser.Dob != nil {
				users[index].Dob   = *inputUser.Dob
			}

			c.JSON(http.StatusOK, users[index])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
}

func deleteUser(c *gin.Context) {
	email := c.Param("email")
	for index := range users {
		if users[index].Email == email {
			var targetUser User = users[index]

			fmt.Println("found user, deleting", users[index].Name)
			users = append(users[:index], users[index+1:]...)
			c.JSON(http.StatusOK, targetUser)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
}

func getUser(c *gin.Context) {
	email := c.Param("email")
	for _, user := range users {
		if user.Email == email {
			c.JSON(http.StatusOK, user)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
}
