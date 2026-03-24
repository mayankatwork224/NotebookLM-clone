import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });


// This will delete all the vector from "default" namespace. 

// That can later on cause a Payment related issue. When you try to retrieve the document it will say, "Error fetching results [Auth] user is blocked"
// That means: ❌ Failed or missing payment , ❌ Account flagged / policy issue , ❌ Temporary account restriction


const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

const index = pc.index(process.env.PINECONE_INDEX as string);

// ✅ Delete everything in default namespace
async function deleteAllVectors() {
  try {
    // Option 1: Delete all vectors in the default namespace
    await index.namespace('default').deleteAll();
    
    console.log('Successfully deleted all vectors from the default namespace');
  } catch (error) {
    console.error('Error deleting vectors:', error);
  }
}

deleteAllVectors();