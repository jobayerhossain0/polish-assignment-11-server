require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("historical-artifact");
    const artifacts = database.collection("artifacts");
    const likedArtifacts = database.collection("liked_artifacts");

    app.post("/artifacts", async (req, res) => {
      const artifact = req.body;

      const result = await artifacts.insertOne(artifact);

      res.send(result);
    });

    app.get("/artifacts", async (req, res) => {
      const allArtifacts = await artifacts.find().toArray();
      res.send(allArtifacts);
    });

    // app.get("/artifacts/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const artifactsByEmail = await artifacts
    //     .find({ addedBy: email })
    //     .toArray();
    //   res.send(artifactsByEmail);
    // });

    app.get("/artifacts/:id", async (req, res) => {
      const id = req.params.id;
      const artifact = await artifacts.findOne({ _id: new ObjectId(id) });
      res.send(artifact);
    });

    app.delete("/artifacts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await artifacts.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/artifacts/my/:email", async (req, res) => {
      const email = req.params.email;

      const myArtifacts = await artifacts
        .find({ artifact_adder_email: email })
        .toArray();

      res.send(myArtifacts);
    });

    app.post("/artifacts/liked", async (req, res) => {
      const result = await likedArtifacts.insertOne(req.body);

      res.send(result);
    });

    app.get("/artifacts/liked", async (req, res) => {
      const result = await likedArtifacts.find().toArray();

      res.send(result);
    });

    app.get("/artifacts/liked/:email", async (req, res) => {
      const { email } = req.params;

      const result = await likedArtifacts.find({ liked_by: email }).toArray();

      res.send(result);
    });

    // app.delete("/artifacts/id/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const result = await artifacts.deleteOne({ _id: new ObjectId(id) });
    //   res.send(result);
    // });

    // app.post("/visa-applications", async (req, res) => {
    //   const application = req.body;
    //   const result = await visaApplications.insertOne(application);
    //   res.send(result);
    // });

    // app.get("/visa-applications", async (req, res) => {
    //   const applications = await visaApplications.find().toArray();
    //   res.send(applications);
    // });

    // app.get("/visa-applications/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const { country_name } = req.query; // Get the country_name query parameter

    //   // Build the filter object dynamically
    //   const filter = { email };
    //   if (country_name) {
    //     filter["visaInfo.country_name"] = country_name;
    //   }

    //   const applicationsByEmail = await visaApplications.find(filter).toArray();
    //   res.send(applicationsByEmail);
    // });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
