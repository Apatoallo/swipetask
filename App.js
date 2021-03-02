import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, Text, View } from 'react-native';
import Swap from './pages/Swap'


export default function App() {
  return (
    <>
      <Swap/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
