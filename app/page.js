'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
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
  Grid,
  Box,
  AppBar,
  Toolbar,
  Button as MuiButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { scroller } from 'react-scroll';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  const infoRef = useRef(null);
  const itemsRef = useRef(null);

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
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: 4, backgroundColor: '#cce7ff' }}
    >
      <AppBar position="static">
        <Toolbar>
          <MuiButton color="inherit" onClick={() => scroller.scrollTo('info', { smooth: true })}>
            Info
          </MuiButton>
          <MuiButton color="inherit" onClick={() => scroller.scrollTo('items', { smooth: true })} sx={{ marginLeft: 2 }}>
            Items
          </MuiButton>
        </Toolbar>
      </AppBar>
      <Box id="info" ref={infoRef} sx={{ padding: 2, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Expense Tracker
        </Typography>
        <Paper sx={{ padding: 2, width: '100%', backgroundColor: '#fff' }}>
          <Typography variant="h6" gutterBottom>
            About This App
          </Typography>
          <Typography paragraph>
            This is an Expense Tracker application that helps you keep track of your expenses. 
            You can add items with their prices, view the total amount spent, and delete items as needed.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Typography paragraph>
            - Add new items with their price.
            - View a list of added items with the ability to delete them.
            - See the total amount spent at the bottom of the list.
          </Typography>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Typography paragraph>
            To add a new item, enter the item name and its price, then click the "Add Item" button. 
            The item will appear in the list below, and you can delete it using the trash icon. 
            Use the "Items" tab to navigate to the list of items.
          </Typography>
        </Paper>
      </Box>
      <Box id="items" ref={itemsRef} sx={{ padding: 2, width: '100%' }}>
        <Paper sx={{ padding: 2, width: '100%', backgroundColor: '#fff' }}>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', marginTop: 2 }}>
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
          </Box>
          {items.length > 0 && (
            <Grid container justifyContent="space-between" sx={{ paddingTop: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
