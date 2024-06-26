import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Text, Image } from 'react-native';
import useSWR from 'swr';
import SwipeControl from '../components/SwipeControl';
import * as Animatable from 'react-native-animatable';

// Function to fetch data from API
const fetcher = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

// Main component
const Homescreen = () => {
  // State variables
  const [randomArticle, setRandomArticle] = useState(null);
  const [animateCard, setAnimateCard] = useState(false);

  // Fetching data using useSWR hook
  const { data, error, mutate } = useSWR(
    'https://newsapi.org/v2/top-headlines?country=us&apiKey=195dd350be484a4cbcd39f56b11b6f97',
    fetcher,
  );

  // Effect hook to trigger animation when new data is fetched
  useEffect(() => {
    if (data) {
      setAnimateCard(true);
    }
  }, [data]);

  // Error handling
  if (error) {
    return (
      <SafeAreaView>
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }
  // Loading state
  if (!data) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Destructuring data
  const { articles } = data;
  const latestArticle = articles[0];

  // Function to handle swipe action
  const handleSwipe = async () => {
    try {
      await mutate();
      const randomIndex = Math.floor(Math.random() * articles.length);
      setRandomArticle(articles[randomIndex]);
    } catch (error) {
      console.error('Error fetching new news:', error);
    }
  };

  // Function to format date as "10 Jan 2024"
  const formatDate = dateString => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // JSX rendering
  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation={animateCard ? 'fadeInUp' : null} duration={1000} style={styles.newsContainer}>
        <Image
          style={styles.image}
          source={{ uri: randomArticle ? randomArticle.urlToImage : latestArticle.urlToImage }}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{randomArticle ? randomArticle.title : latestArticle.title}</Text>
          <Text style={styles.date}>
            {randomArticle ? formatDate(randomArticle.publishedAt) : formatDate(latestArticle.publishedAt)}
          </Text>
        </View>
      </Animatable.View>
      <View style={styles.bottomContainer}>
        <SwipeControl onSwipe={handleSwipe} />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  newsContainer: {
    flex: 1,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 16,
    marginTop: 30,
  },
  bottomContainer: {
    marginBottom: 20,
  },
  image: {
    height: 400,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  date: {
    fontSize: 18,
    color: 'black',
    marginBottom: 8,
  },
});

export default Homescreen;
