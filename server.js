import express from "express";
import cors from "cors";
import { db } from "./src/db.js"; // Import the database connection
import { CarListing } from "./src/schema.js";
import { eq } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";
import prerender from 'prerender-node';
import { AnonymousComments } from "./src/schema.js";
import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const upload = multer();
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all origins
app.use(cors());

// Add Prerender.io middleware (add your real token here)
prerender.set('prerenderToken', 'Co5rRA3EnfSUizkP6NYw');
app.use(prerender);

// Middleware to parse JSON requests
app.use(express.json());


// ✅ Root route to confirm server is working
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

app.get("/api/cars", async (req, res) => {
  try {
    console.log("Fetching all car listings...");

    const listings = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.soldOut, true))
      .orderBy(CarListing.createdAt, "desc");

    console.log("Listings fetched successfully:", listings);

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

// ✅ API endpoint to fetch all cars (both sold-out and available)
app.get("/api/all-cars", async (req, res) => {
  try {
    console.log("Fetching all cars (sold-out and available)...");

    // Fetch all cars without filtering by soldOut
    const allCars = await db.select().from(CarListing).orderBy(CarListing.createdAt, "desc");

    console.log("All cars fetched successfully:", allCars);

    res.status(200).json(allCars);
  } catch (error) {
    console.error("Error fetching all cars:", error);
    res.status(500).json({ error: "Failed to fetch all cars." });
  }
});
// ✅ API endpoint to fetch only sold-out cars
app.get("/api/soldout-cars", async (req, res) => {
  try {
    console.log("Fetching all sold-out cars...");

    // Fetch cars where soldOut is true
    const soldOutCars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.soldOut, true))
      .orderBy(CarListing.createdAt, "desc");

    console.log("Sold-out cars fetched successfully:", soldOutCars);

    res.status(200).json(soldOutCars);
  } catch (error) {
    console.error("Error fetching sold-out cars:", error);
    res.status(500).json({ error: "Failed to fetch sold-out cars." });
  }
});
// ✅ API endpoint to fetch only available cars (soldOut: false)
app.get("/api/available-cars", async (req, res) => {
  try {
    console.log("Fetching all available cars...");

    // Fetch cars where soldOut is false
    const availableCars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.soldOut, false))
      .orderBy(CarListing.createdAt, "desc");

    console.log("Available cars fetched successfully:", availableCars);

    res.status(200).json(availableCars);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({ error: "Failed to fetch available cars." });
  }
});


// ✅ API endpoint to fetch a car by ID (JSON for React)
app.get("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const cars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, parsedId))
      .limit(1);

    if (cars.length === 0) {
      return res.status(404).json({ error: "Car not found." });
    }

    res.status(200).json(cars[0]);
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    res.status(500).json({ error: "Failed to fetch car." });
  }
});



// ✅ SSR/OG tags + redirect for bots and browsers
app.get("/car/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).send("Invalid car ID.");
    }

    const cars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, parsedId))
      .limit(1);

    if (cars.length === 0) {
      return res.status(404).send("Car not found.");
    }

    const car = cars[0];
    const image = Array.isArray(car.pictures) ? car.pictures[0] : car.pictures;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${car.make} ${car.model} (${car.year}) - Carvision</title>
          <meta property="og:title" content="${car.make} ${car.model} (${car.year}) - Carvision" />
          <meta property="og:description" content="${car.comment || "Find your dream car at Carvision!"}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://carvision.onrender.com/car/${car.id}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${car.make} ${car.model} (${car.year})" />
          <meta name="twitter:description" content="${car.comment || "Find your dream car at Carvision!"}" />
          <meta name="twitter:image" content="${image}" />
        </head>
        <body>
          <script>
            // List of known bots/crawlers
            const bots = [
              'facebookexternalhit',
              'Twitterbot',
              'Slackbot',
              'WhatsApp',
              'TelegramBot',
              'Discordbot'
            ];
            const ua = navigator.userAgent;
            const isBot = bots.some(bot => ua.includes(bot));
            if (!isBot) {
              window.location.replace("https://carvisioni.com/cardetails/${car.id}");
            }
          </script>
          <p>Redirecting to car details...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error rendering car SSR page:", error);
    res.status(500).send("Server error.");
  }
});

// ...existing code...
// ✅ API endpoint to add a new car listing
app.post("/api/add-listing", async (req, res) => {
  try {
    const { pictures, make, year, comment, mileage, sellingPrice, fuelType, category } = req.body;

    await db.insert(CarListing).values({
      pictures,
      make,
      year: year ? parseInt(year, 10) : null,
      mileage: mileage ? parseInt(mileage, 10) : null,
      sellingPrice,
      fuelType,
      category,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      soldOut: false,
    });

    console.log("New car listing added successfully!");

    res.status(200).json({ message: "Listing added successfully!" });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: "Failed to add listing." });
  }
});

// ✅ API endpoint to update car details
app.put("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const { make, year, mileage, sellingPrice, fuelType, comment, pictures, category, soldOut } = req.body;

    const updatedRows = await db
      .update(CarListing)
      .set({
        make,
        year: year ? parseInt(year, 10) : null,
        mileage: mileage ? parseInt(mileage, 10) : null,
        sellingPrice,
        fuelType,
        pictures,
        category,
        comment,
        soldOut, // Update the soldOut field
        updatedAt: new Date().toISOString(),
      })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or no changes made." });
    }

    console.log("Car details updated successfully!");
    res.status(200).json({ message: "Car details updated successfully!" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ error: "Failed to update car details." });
  }
});

// ✅ API endpoint to toggle the "Sold Out" status of a car
app.put("/api/cars/:id/soldout", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const { soldOut } = req.body; // Expecting soldOut in the request body

    const updatedRows = await db
      .update(CarListing)
      .set({ soldOut, updatedAt: new Date().toISOString() })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or no changes made." });
    }

    console.log(`Car ID ${id} marked as ${soldOut ? "sold out" : "available"}`);
    res.status(200).json({ message: `Car marked as ${soldOut ? "sold out" : "available"} successfully!` });
  } catch (error) {
    console.error("Error toggling soldOut status:", error);
    res.status(500).json({ error: "Failed to toggle soldOut status." });
  }
});
// ✅ API endpoint to mark a car as "unsold" (soldOut: false)
app.put("/api/cars/:id/unsoldout", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    // Set soldOut to false
    const updatedRows = await db
      .update(CarListing)
      .set({ soldOut: false, updatedAt: new Date().toISOString() })
      .where(eq(CarListing.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Car not found or no changes made." });
    }

    console.log(`Car ID ${id} marked as available (unsold)`);
    res.status(200).json({ message: `Car ID ${id} marked as available (unsold) successfully!` });
  } catch (error) {
    console.error("Error marking car as unsold:", error);
    res.status(500).json({ error: "Failed to mark car as unsold." });
  }
});
// ✅ API endpoint to delete a car
app.delete("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    // Delete the car from the database
    const deletedRows = await db.delete(CarListing).where(eq(CarListing.id, parsedId));

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Car not found." });
    }

    console.log(`Car ID ${id} deleted successfully`);
    res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car." });
  }
});

// ✅ API endpoint to fetch comments for a specific car
app.get("/api/comments/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const parsedCarId = parseInt(carId, 10);

    if (isNaN(parsedCarId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const comments = await db
      .select()
      .from(AnonymousComments)
      .where(eq(AnonymousComments.carId, parsedCarId))
      .orderBy(AnonymousComments.createdAt, "desc");

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// ✅ API endpoint to add a new comment
app.post("/api/comments", async (req, res) => {
  try {
    const { carId, comment } = req.body;

    if (!carId || !comment) {
      return res.status(400).json({ error: "Car ID and comment are required." });
    }

    if (comment.split(" ").length > 40) {
      return res.status(400).json({ error: "Comment must be under 40 words." });
    }

    const newComment = await db.insert(AnonymousComments).values({
      carId: parseInt(carId, 10),
      comment,
      likes: 0,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      id: newComment.insertId,
      carId,
      comment,
      likes: 0,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// ✅ API endpoint to like a comment
app.post("/api/comments/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid comment ID." });
    }

    const updatedRows = await db
      .update(AnonymousComments)
      .set({ likes: AnonymousComments.likes + 1 })
      .where(eq(AnonymousComments.id, parsedId));

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({ message: "Comment liked successfully!" });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ error: "Failed to like comment." });
  }
});
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

app.get("/api/car-comments/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const parsedCarId = parseInt(carId, 10);
    const limitNum = parseInt(req.query.limit, 10) || 1;

    if (isNaN(parsedCarId)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const comments = await db
      .select()
      .from(AnonymousComments)
      .where(eq(AnonymousComments.carId, parsedCarId))
      .orderBy(AnonymousComments.createdAt, "desc")
      .limit(limitNum);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching latest comment:", error);
    res.status(500).json({ error: "Failed to fetch latest comment." });
  }
});
app.get("/car/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).send("Invalid car ID.");
    }

    // Fetch car details from your DB
    const cars = await db
      .select()
      .from(CarListing)
      .where(eq(CarListing.id, parsedId))
      .limit(1);

    if (cars.length === 0) {
      return res.status(404).send("Car not found.");
    }

    const car = cars[0];
    // Get the first image or fallback
    let image = Array.isArray(car.pictures) ? car.pictures[0] : car.pictures;
    // Always use CDN for DigitalOcean Spaces images
    if (image && typeof image === "string" && image.includes(".digitaloceanspaces.com")) {
      image = image.replace(".digitaloceanspaces.com", ".cdn.digitaloceanspaces.com");
    }
    // Fallback image if missing
    if (!image) {
      image = "https://carvisioni.com/Favicon.png";
    }

    // Render HTML with dynamic OG tags
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${car.make} ${car.model} (${car.year}) - Carvision</title>
          <meta property="og:title" content="${car.make} ${car.model} (${car.year}) - Carvision" />
          <meta property="og:description" content="${car.comment || "Find your dream car at Carvision!"}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="${car.comment || "Find your dream car at Carvision!"}" />
          <link rel="icon" href="/Favicon.png" />
          <script>
            // Redirect users to the React SPA route after OG tags are read by bots
            if (!navigator.userAgent.includes('facebookexternalhit') && !navigator.userAgent.includes('Twitterbot') && !navigator.userAgent.includes('Slackbot')) {
              window.location.replace("/#/car/${car.id}");
            }
          </script>
        </head>
        <body>
          <p>Redirecting to car details...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error rendering car SSR page:", error);
    res.status(500).send("Server error.");
  }
});

// Serve the APK file
app.get("/downloads/app.apk", (req, res) => {
  const filePath = path.join(__dirname, "downloads", "app.apk");
  res.download(filePath, "CarVisionApp.apk", (err) => {
    if (err) {
      console.error("Error sending APK file:", err);
      res.status(500).send("Failed to download the file.");
    }
  });
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
