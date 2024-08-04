'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase'; // Ensure this path is correct
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  // Add item to the database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: '', price: '' });
    }
  };

  // Add sample items to the database if it's empty
  const addSampleItems = async () => {
    const q = query(collection(db, 'items'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const sampleItems = [
        { name: 'Coffee', price: '4.95' },
        { name: 'Movie', price: '24.95' },
        { name: 'Candy', price: '7.95' }
      ];
      for (const item of sampleItems) {
        await addDoc(collection(db, 'items'), item);
      }
    }
  };

  // Read items from the database
  useEffect(() => {
    addSampleItems(); // Ensure sample items are added if the collection is empty

    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
    });
    return () => unsubscribe();
  }, []);

  // Delete items from the database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: 4 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Expense Tracker
      </Typography>
      <Paper sx={{ padding: 2, width: '100%' }}>
        <form onSubmit={addItem}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Enter Item"
                variant="outlined"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Enter $"
                type="number"
                variant="outlined"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </form>
        <List>
          {items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`$${item.price}`}
              />
            </ListItem>
          ))}
        </List>
        {items.length > 0 && (
          <Grid container justifyContent="space-between" sx={{ paddingTop: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
