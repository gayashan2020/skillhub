// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const attributes = [
  { name: "Role", description: "Defines the role of a user (e.g., Admin, Editor, Viewer)." },
  { name: "Department", description: "Represents the department a user belongs to (e.g., Sales, IT, HR)." },
  { name: "Access Level", description: "Indicates the user's level of access (e.g., Basic, Premium, Enterprise)." },
  { name: "Region", description: "Specifies the geographical location of the user (e.g., US, Europe, Asia)." },
  { name: "Resource Type", description: "Categorizes resources (e.g., Document, Video, Image, API)." },
  { name: "Resource Sensitivity", description: "Defines the sensitivity level of the resource (e.g., Public, Internal, Confidential)." },
  { name: "Owner", description: "Indicates the user or team owning the resource." },
  { name: "Status", description: "Specifies the resource's status (e.g., Active, Inactive, Archived)." },
  { name: "Action Type", description: "Represents the type of actions allowed (e.g., Read, Write, Update, Delete)." },
  { name: "Condition", description: "Defines conditions for access (e.g., Time-based, IP-restricted)." },
  { name: "Environment", description: "Represents the environment for access control (e.g., Production, Staging, Development)." },
  { name: "Project", description: "Links users or resources to specific projects (e.g., Project A, Project B)." },
  { name: "Team", description: "Assigns users or resources to specific teams (e.g., Frontend Team, Backend Team)." },
  { name: "Priority", description: "Indicates the priority of a resource or task (e.g., Low, Medium, High)." },
  { name: "Category", description: "Categorizes resources or entities (e.g., Finance, Marketing, Engineering)." },
];

const load = async () => {
  try {
    console.log("Checking for existing data...");
    const existingAttributes = await prisma.attribute.findMany();

    if (existingAttributes.length > 0) {
      console.log("Deleting existing data...");
      await prisma.attribute.deleteMany();
      console.log("Deleted records in the Attribute table.");

      console.log("Resetting auto-increment...");
      await prisma.$executeRawUnsafe('ALTER SEQUENCE "Attribute_id_seq" RESTART WITH 1');
      console.log("Reset auto-increment for Attribute table.");
    }

    console.log("Seeding data...");
    await prisma.attribute.createMany({
      data: attributes,
    });
    console.log("Added attribute data.");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
