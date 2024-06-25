/* eslint-disable */

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import debounce from 'lodash.debounce';

const API_KEY = '1d0a1a93adc34e67b845acf77b504bca';

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   Not used
  let history = useRef(new Array());
  const [error, setError] = useState(null);

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
      //   history.current = history.current ? history.current.push(searchQuery) : [searchQuery]
      //   console.log(history.current);
      setResults(filteredData);
    } catch (error) {
      //   console.error('Error fetching data:', error);
      setError('oops! something went wrong!');
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

  const closeModal = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      {error && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!error}
          onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
