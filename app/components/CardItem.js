import React from 'react';
import styles from '../assets/styles';

import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Icon from './Icon';

const CardItem = ({
  actions,
  description,
  image,
  matchesPage,
  name,
  courses,
  onPressLeft,
  onPressRight,
  status,
  variant
}) => {
  // Custom styling
  const fullWidth = Dimensions.get('window').width;
  const imageStyle = [
    {
      borderRadius: 8,
      width: variant ? fullWidth / 2 - 30 : fullWidth - 80,
      height: matchesPage ? (variant ? 120 : 300) : (variant ? 110 : 200),
      margin: variant ? 0 : 20
    }
  ];

  const nameStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: '#363636',
      fontSize: variant ? 15 : 30,
      alignSelf: 'center'
    }
  ];

  const CourseHeaderStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: '#757E90',
      fontSize: variant ? 5 : 19,
      alignSelf: 'center'
    }
  ];

  return (
    <View style={styles.containerCardItem}>
      {/* IMAGE */}
      <Image source={image} style={imageStyle} />

      {/* MATCHES */}
      {/* {matches && (
        <View style={styles.matchesCardItem}>
          <Text style={styles.matchesTextCardItem}>
            <Icon name="heart" /> {matches}% Match!
          </Text>
        </View>
      )} */}

      {/* NAME */}
      <Text style={nameStyle}>{name}</Text>

      {/* Courses */}
      {courses && <Text style={CourseHeaderStyle}>
        {courses.map((item, index) => (
          <Text key={String(index)} >
            {index === courses.length - 1 ? " " + item : " " + item + ","}
          </Text>
        ))}
      </Text>}
      

      {/* DESCRIPTION */}
      {description && (
        <Text style={styles.descriptionCardItem}>{description}</Text>
      )}

      {/* STATUS */}
      {status && (
        <View style={styles.status}>
          <View style={status === 'Online' ? styles.online : styles.offline} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}

      {/* ACTIONS */}
      {actions && (
        <View style={styles.actionsCardItem}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressLeft()}
          >
            <Text style={styles.dislike}>
              <Icon name="dislike" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => onPressRight()}>
            <Text style={styles.like}>
              <Icon name="like" />
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
};

export default CardItem;
