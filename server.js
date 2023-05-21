import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';

const PORT = 3008;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));


const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const bankAccountCollection = db.collection('bankaccounts');

app.get('/start', async (req,res)=> {
    const bankAccountsArray = await bankAccountCollection.find().toArray();
    res.sendFile('start.html', { root: app.get('views') });
});

app.get('/api/account', async (req, res) => {
    try {
      const bankAccounts = await bankAccountCollection.find().toArray();
      res.json({ bankAccounts });
    } catch (error) {
      console.error('Failed to retrieve bank accounts:', error);
      res.sendStatus(500);
    }
  });
  

app.get('/add', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});

app.post('/api/account', async (req,res) => {
    try {
        const {name,balance} = req.body;
        const id= new ObjectId();
        const results = await client
            .db('bank')
            .collection('bankaccounts')
            .insertOne({_id:id,name,balance});

            if (results) {
                res.sendStatus(200); 
              } else {
                res.sendStatus(500); 
              }
    }   catch (error) {
        console.error('Failed to add bank account:', error);
        res.sendStatus(500);
    }
});

app.post('/api/withdraw/:accountId', async (req,res) => {
    try {
        const accountId = req.params.accountId;
        const withdrawAmount = parseFloat(req.body.amount);
        const account = await bankAccountCollection.findOne({ _id: new ObjectId(accountId) });
        if (!account) {
        return res.status(404).send('Account not found');
        }

        if (account.balance < withdrawAmount) {
        return res.status(400).send('Insufficient balance');
        }

        const updatedAccount = await bankAccountCollection.findOneAndUpdate(
            { _id: new ObjectId(accountId) },
            { $inc: { balance: -withdrawAmount } },
            { returnOriginal: false }
          );
        if (!updatedAccount) {
            return res.sendStatus(404);
        }
        const newBalance = updatedAccount.balance - withdrawAmount;
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to withdraw:', error);
        res.sendStatus(500);
    }
})

app.post('/api/deposit/:accountId', async (req,res) => {
    try {
        const accountId = req.params.accountId;
        const depositAmount = parseFloat(req.body.amount);
        const account = await bankAccountCollection.findOne({ _id: new ObjectId(accountId) });
        if (!account) {
        return res.status(404).send('Account not found');
        }


        const updatedAccount = await bankAccountCollection.findOneAndUpdate(
            { _id: new ObjectId(accountId) },
            { $inc: { balance: +depositAmount } },
            { returnOriginal: false }
          );
        if (!updatedAccount) {
            return res.sendStatus(404);
        }
        const newBalance = updatedAccount.balance + depositAmount;
        res.sendStatus(200);
    } catch (error) {
        console.error('Failed to deposit:', error);
        res.sendStatus(500);
    }
});

app.delete('/api/remove/:accountId', async (req, res) => {
    try {
      const accountId = req.params.accountId;
      console.log('Remove request received for account ID:', accountId);
  
      const result = await bankAccountCollection.deleteOne({ _id: new ObjectId(accountId) });
      if (!result) {
        return res.sendStatus(404);
      }
  
      res.sendStatus(204); 
    } catch (error) {
      console.error('Failed to remove account:', error);
      res.sendStatus(500);
    }
});
  
  

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})