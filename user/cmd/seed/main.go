package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"user/config"
	"user/models"
)

var firstNames = []string{
	"Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
	"Ananya", "Diya", "Saanvi", "Aanya", "Aadhya", "Isha", "Priya", "Meera", "Kavya", "Riya",
	"James", "Oliver", "Emma", "Sophia", "Liam", "Noah", "Ava", "Isabella", "Mia", "Charlotte",
	"Lucas", "Mason", "Ethan", "Logan", "Aiden", "Ella", "Amelia", "Harper", "Luna", "Chloe",
	"Rahul", "Amit", "Sneha", "Pooja", "Rohit", "Neha", "Vikram", "Anjali", "Deepak", "Sunita",
}

var lastNames = []string{
	"Sharma", "Verma", "Patel", "Gupta", "Singh", "Kumar", "Nath", "Das", "Roy", "Mehta",
	"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore",
	"Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Lee", "Clark",
	"Joshi", "Rao", "Reddy", "Iyer", "Nair", "Mishra", "Pandey", "Shah", "Chopra", "Bose",
	"Chen", "Wang", "Kim", "Tanaka", "Ali", "Khan", "Malik", "Ahmed", "Sato", "Suzuki",
}

var domains = []string{
	"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "proton.me",
}

func main() {
	client := config.ConnectDB()
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()

	collection := config.GetCollection(client, "project_go", "users")

	users := make([]interface{}, 500)
	for i := range 500 {
		first := firstNames[rand.Intn(len(firstNames))]
		last := lastNames[rand.Intn(len(lastNames))]
		domain := domains[rand.Intn(len(domains))]

		// random DOB between 1970 and 2005
		year := 1970 + rand.Intn(36)
		month := 1 + rand.Intn(12)
		day := 1 + rand.Intn(28)
		dob := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)

		users[i] = models.User{
			Name:  fmt.Sprintf("%s %s", first, last),
			Email: fmt.Sprintf("%s.%s.%d@%s", first, last, i, domain),
			DOB:   dob.Format(time.RFC3339),
		}
	}

	result, err := collection.InsertMany(context.TODO(), users)
	if err != nil {
		log.Fatal("Failed to insert users:", err)
	}

	fmt.Printf("Inserted %d users\n", len(result.InsertedIDs))
}
