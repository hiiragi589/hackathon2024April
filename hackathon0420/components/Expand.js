import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import ExtractData from "../components/ExtractData"

const Accordion = ({ content }) => {
  const [expanded, setExpanded] = useState(false);

  return (
      <View style={styles.container}>

        {/* <ExtractData/> */}
        <View style={styles.inner_container}>
          <ExtractData/>
          {/* <Text>{title}</Text> */}
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.button}>
            <Text>{expanded ? '-' : '+'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text>delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text>edit</Text>
          </TouchableOpacity>
        </View>
        {expanded && (
          <View style={styles.content}>
            <Text>{content}</Text>
          </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    padding: 10,
  },
  inner_container: {
    borderWidth: 1,
    borderColor: '#fff',
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center'
,  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {
    bfontSize: 16,
    fontWeight: "bold",
  },
});

export default Accordion;
