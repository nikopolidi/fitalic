import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ProgressPhoto } from '../../types/database';

type ProgressGalleryProps = {
  photos: ProgressPhoto[];
  onAddPhoto: () => void;
  onDeletePhoto: (photoId: string) => void;
};

/**
 * Component for displaying progress photos in a gallery
 */
export const ProgressGallery: React.FC<ProgressGalleryProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto
}) => {
  const { theme } = useUnistyles();
  
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - (theme.spacing.md * 3)) / 2;
  
  const renderPhoto = ({ item }: { item: ProgressPhoto }) => (
    <TouchableOpacity 
      style={[styles.photoContainer, { width: imageSize, height: imageSize }]}
      onPress={() => setSelectedPhoto(item)}
    >
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.photo} 
        resizeMode="cover"
      />
      <Text style={styles.photoDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No progress photos yet</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddPhoto}
          >
            <FontAwesome name="camera" size={20} color={theme.colors.text} />
            <Text style={styles.addButtonText}>Add First Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.photoGrid}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TouchableOpacity 
                style={[styles.addPhotoButton, { width: imageSize, height: imageSize }]}
                onPress={onAddPhoto}
              >
                <FontAwesome name="plus" size={30} color={theme.colors.primary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            }
          />
          
          <Modal
            visible={!!selectedPhoto}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectedPhoto(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedPhoto && (
                  <>
                    <Image 
                      source={{ uri: selectedPhoto?.imageUri }} 
                      style={styles.fullSizePhoto} 
                      resizeMode="contain"
                    />
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoInfoText}>
                        {new Date(selectedPhoto.date).toLocaleDateString()}
                      </Text>
                      {selectedPhoto.notes && (
                        <Text style={styles.photoNote}>{selectedPhoto.notes}</Text>
                      )}
                    </View>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => {
                          if (selectedPhoto) {
                            onDeletePhoto(selectedPhoto.id);
                            setSelectedPhoto(null);
                          }
                        }}
                      >
                        <FontAwesome name="trash" size={20} color={theme.colors.error} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setSelectedPhoto(null)}
                      >
                        <FontAwesome name="times" size={20} color={theme.colors.text} />
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  photoGrid: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  photoContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoDate: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.opacity(theme.colors.background, 0.7),
    color: theme.colors.text,
    fontSize: theme.typography.caption.fontSize,
    padding: theme.spacing.xs,
    textAlign: 'center',
  },
  addPhotoButton: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addPhotoText: {
    color: theme.colors.primary,
    fontSize: theme.typography.bodySmall.fontSize,
    marginTop: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.opacity(theme.colors.background, 0.9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    padding: theme.spacing.md,
  },
  fullSizePhoto: {
    width: '100%',
    height: 400,
    borderRadius: theme.borderRadius.md,
  },
  photoInfo: {
    marginTop: theme.spacing.md,
  },
  photoInfoText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '500',
  },
  photoNote: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.opacity(theme.colors.error, 0.1),
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  deleteButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.body.fontSize,
    marginLeft: theme.spacing.xs,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  closeButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    marginLeft: theme.spacing.xs,
  },
}));

export default ProgressGallery;
