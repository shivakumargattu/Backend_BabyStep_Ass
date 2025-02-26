# Doctor Appointment Booking API

This is a backend API for managing doctor appointments using Node.js, Express, and MongoDB. It provides endpoints to manage doctors and appointments, ensuring time slot availability and validation.

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose ORM)**
- **Moment.js** (for date-time handling)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     PORT=5000
     ```
4. Start the server:
   ```sh
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

## Data Models

### Doctor Model
```js
{
  name: String, // Doctor's name
  specialization: String, // Optional
  workingHours: { start: String, end: String } // Daily working hours
}
```
### Appointment Model
```js
{
  doctorId: ObjectId, // Reference to Doctor
  date: Date, // Appointment date & time
  duration: Number, // Duration in minutes (30 or 60)
  appointmentType: String, // Example: "Routine Check-Up"
  patientName: String, // Patient's name
  notes: String (optional)
}
```

## API Endpoints

### Doctor Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/doctors` | Retrieve a list of all doctors |
| **GET** | `/doctors/:id` | Retrieve details of a single doctor |
| **GET** | `/doctors/:id/slots?date=YYYY-MM-DD` | Get available slots for a doctor on a given date |
| **POST** | `/doctors` | Add a new doctor |
| **DELETE** | `/doctors/:id` | Remove a doctor by ID |

### Appointment Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/appointments` | Retrieve all appointments |
| **GET** | `/appointments/:id` | Retrieve details of a specific appointment |
| **POST** | `/appointments` | Create a new appointment (validates time slot availability) |
| **PUT** | `/appointments/:id` | Update an existing appointment (ensures time slot is available) |
| **DELETE** | `/appointments/:id` | Cancel an appointment |

## Additional Features & Considerations

- **Time Slot Calculation**: Uses `moment.js` to check available time slots based on doctor's working hours.
- **Validation & Error Handling**: Ensures all required fields are provided and prevents conflicting appointments.
- **(Optional) Real-Time Updates**: WebSocket integration can be added to notify clients about appointment changes.

## Testing the API
- Use **Postman** or **cURL** to test the endpoints.
- Sample `POST /appointments` request:
  ```json
  {
    "doctorId": "65c34567890abcdef1234567",
    "date": "2025-03-05T09:00:00.000Z",
    "duration": 60,
    "appointmentType": "Ultrasound",
    "patientName": "Robert Brown",
    "notes": "Routine pregnancy ultrasound"
  }
  ```
![image](https://github.com/user-attachments/assets/e34c791c-bfbe-47aa-95d9-e49ffc518c55)

![image](https://github.com/user-attachments/assets/1e52c686-1623-4165-96d9-6a381d656c98)

