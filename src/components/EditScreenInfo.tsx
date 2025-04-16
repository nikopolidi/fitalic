import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExternalLink } from './ExternalLink';

export default function EditScreenInfo({ path }: { path: string }) {
  const title = "Open up the code for this screen:";
  const description =
    "Change any of the text, save the file, and your app will automatically update.";

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{path}</Text>
        </View>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <View style={styles.linkContainer}>
        <ExternalLink
          style={styles.link}
          href="https://docs.expo.dev/router/introduction/"
        >
          <Text style={styles.linkText}>
            Tap here to learn more about file-based routing
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  codeText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  link: {
    paddingTop: 15,
  },
  linkText: {
    textAlign: 'center',
    color: '#007AFF',
  },
});
