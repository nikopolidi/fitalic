import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProgressStore } from '../../services/storage';
import { ProgressPhoto } from '../../types/database';

/**
 * Photo gallery component for progress tracking
 */
export const ProgressGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Get progress photos from store
  const progressStore = useProgressStore();
  const photos = progressStore.progressPhotos;
  
  // Screen dimensions for grid layout
  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 48) / 3; // 3 columns with margins
  
  // Add new progress photo
  const handleAddPhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }
      
      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        
        // Add progress photo
        progressStore.addProgressPhoto({
          id: `photo_${Date.now()}`,
          uri: photoUri,
          timestamp: Date.now(),
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error picking progress photo:', error);
    }
  };
  
  // View photo details
  const handlePhotoPress = (photo: ProgressPhoto) => {
    setSelectedPhoto(photo);
    setIsModalVisible(true);
  };
  
  // Delete photo
  const handleDeletePhoto = (photoId: string) => {
    progressStore.deleteProgressPhoto(photoId);
    setIsModalVisible(false);
  };
  
  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Render photo item
  const renderPhotoItem = ({ item }: { item: ProgressPhoto }) => (
    <TouchableOpacity
      style={[styles.photoItem, { width: itemSize, height: itemSize * 1.33 }]}
      onPress={() => handlePhotoPress(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.photoDateOverlay}>
        <Text style={styles.photoDate}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render add photo button
  const renderAddButton = () => (
    <TouchableOpacity
      style={[styles.addPhotoButton, { width: itemSize, height: itemSize * 1.33 }]}
      onPress={handleAddPhoto}
    >
      <FontAwesome name="plus" size={24} color="#007AFF" />
      <Text style={styles.addPhotoText}>Add Photo</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Progress Photos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="camera" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>No progress photos yet</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddPhoto}>
            <Text style={styles.emptyButtonText}>Add Your First Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.photoGrid}
          ListFooterComponent={renderAddButton}
        />
      )}
      
      {/* Photo detail modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
                <Text style={styles.modalDate}>{formatDate(selectedPhoto.timestamp)}</Text>
                {selectedPhoto.notes && (
                  <Text style={styles.modalNotes}>{selectedPhoto.notes}</Text>
                )}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => handleDeletePhoto(selectedPhoto.id)}
                  >
                    <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoGrid: {
    paddingBottom: 16,
  },
  photoItem: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoDateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
  },
  photoDate: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
  addPhotoButton: {
    margin: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalNotes: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FFEBEB',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
});

export default ProgressGallery;
