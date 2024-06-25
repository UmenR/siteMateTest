/* eslint-disable */

import React, {useState, useEffect, useCallback} from 'react';
import {View, TextInput, FlatList, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import debounce from 'lodash.debounce';

const API_KEY = '1d0a1a93adc34e67b845acf77b504bca';

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async (searchQuery: any) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${searchQuery}&from=2024-05-25&sortBy=popularity&apiKey=${API_KEY}`,
      );
      const filteredData = response.data.articles.filter(
        article => article.title != '[Removed]',
      );
      console.log(filteredData);
      setResults(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 500), []);

  useEffect(() => {
    debouncedFetchResults(query);
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [query, debouncedFetchResults]);

  const renderItem = ({item}) => (
    <View style={styles.resultItem}>
      <Text>Title: {item.title}</Text>
      <Text style={{fontWeight: 'bold'}}>by: {item.author}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
      />
      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
      {!isLoading && query && (
        <FlatList
          data={results}
          keyExtractor={item => item.title}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  resultItem: {
    padding: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
});

export default HomeScreen;
