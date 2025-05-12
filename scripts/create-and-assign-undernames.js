import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ARIO, ANT, ArweaveSigner } from '@ar.io/sdk';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(readFileSync(join(__dirname, '../public/data/collection_metadata.json'), 'utf8'));
const wallet = JSON.parse(readFileSync(join(__dirname, '../wallet.json'), 'utf8'));

if (!process.env.ARNS_NAME) {
    throw new Error('ARNS_NAME environment variable is not set');
}

const ARNS_NAME = "manifoldtest";

// count the number of items in the data
// create undernames for each item in the data named after the item
// assign the arweave transactions inside each items image property to the relevant undername using setUndernameRecord

const ario = ARIO.mainnet({ signer: new ArweaveSigner(wallet) });

async function countItemsInCollection (data) {
    const count = Object.keys(data).length;
    console.log(`${count} items in collection`);
    console.log(typeof count)
    return count;
}

async function fetchArnsName () {
    const arns = await ario.getArNSRecord({ name: ARNS_NAME });
    console.log(arns)
    return arns
}

async function increaseUndernameLimit({name, qty}) {
    const result = await ario.increaseUndernameLimit({ name: name, increaseCount: qty});
    console.log(result)
    return
}


async function createAndAssignUndernames({ant, undername, transactionId, ttlSeconds}) {
    try {
        // Extract just the transaction ID from the Arweave URL
        const txId = transactionId.split('/').pop().replace(/[^a-zA-Z0-9-]/g, '');
        
        const result = await ant.setUndernameRecord({
            name: ARNS_NAME,  // The parent ARNS name
            undername: undername,
            transactionId: txId,
            ttlSeconds: ttlSeconds,
        });
        
        console.log(`Created undername ${undername} with transaction ID: ${txId}`);
        return result;
    } catch (error) {
        console.error(`Error creating undername ${undername}:`, error);
        throw error;
    }
}

async function main() {
    const itemCount = await countItemsInCollection(data);
    const arns = await fetchArnsName();
    const arnsUndernameLimit = arns.undernameLimit
    console.log(`${arnsUndernameLimit} undernames available`)

    const ant = await ANT.init({
        signer: new ArweaveSigner(wallet),
        processId: arns.processId
    });

    const records = await ant.getRecords()
    const unassignedUndernames = arnsUndernameLimit - Object.keys(records).length - 1
    
    if (itemCount > unassignedUndernames) {
        const undernamesNeeded = itemCount - unassignedUndernames;
        await increaseUndernameLimit({name: ARNS_NAME, qty: undernamesNeeded});
        console.log(`Increased undername limit by ${undernamesNeeded}`)
    } else {
        console.log(`No need to increase undername limit`);
    }

    // Use Promise.all to handle all async operations
    const undernamePromises = Object.entries(data).map(async ([id, item]) => {
        const undername = `${item.name.replace(/\s+/g, '-')}`;
        const transactionId = item.image;
        const ttlSeconds = 900;
        return createAndAssignUndernames({ant, undername, transactionId, ttlSeconds});
    });

    try {
        const results = await Promise.all(undernamePromises);
        console.log('All undernames created successfully:', results);
    } catch (error) {
        console.error('Error creating undernames:', error);
    }
}

main()
