import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})