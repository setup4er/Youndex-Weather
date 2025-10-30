import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchStyles } from '../styles/commonStyles';

const SearchBar = ({ 
  searchQuery, 
  onSearchQueryChange, 
  onSearch, 
  onClear,
  loading,
  placeholder = "Введите город или страну..." 
}) => {
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.inputContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#7f8c8d" 
          style={searchStyles.searchIcon}
        />
        <TextInput
          style={searchStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          onSubmitEditing={() => onSearch()}
          editable={!loading}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={searchStyles.clearButton}
            onPress={onClear}
          >
            <Ionicons name="close-circle" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          searchStyles.searchButton,
          loading && searchStyles.searchButtonDisabled
        ]}
        onPress={() => onSearch()}
        disabled={loading || !searchQuery.trim()}
      >
        {loading ? (
          <Text style={searchStyles.searchButtonText}>...</Text>
        ) : (
          <Ionicons name="navigate" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;