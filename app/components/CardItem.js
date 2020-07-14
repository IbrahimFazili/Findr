import React from "react";
import styles from "../assets/styles";

import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import Icon from "./Icon";

const CardItem = ({
  actions,
  description,
  image,
  name,
  keywords,
  onPressLeft,
  onPressRight,
  status,
  variant,
}) => {
  // Custom styling
  const fullWidth = Dimensions.get("window").width;
  const fullHeight = Dimensions.get("window").height;

  const imageWrapperStyle = [
    {
      width: variant ? fullWidth / 2 - 60 : styles.containerCardItem.width,
      height: variant ? (fullHeight * 0.2) / 2 : (fullHeight * 0.685) / 2,
      margin: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderRadius: variant ? 10 : 40,
      flex: variant ? 1 : 0,
      overflow: "hidden",
    },
  ];

  const imageStyle = [
    {
      width: variant ? fullWidth / 2 - 60 : styles.containerCardItem.width,
      height: variant ? (fullHeight * 0.2) / 2 : (fullHeight * 0.685) / 2,
      margin: 0,
      flex: variant ? 1 : 0,
    },
  ];

  const nameStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: "#1a5d57",
      fontSize: variant ? 15 : 30,
      alignSelf: "center",
      marginLeft: 3,
    },
  ];

  const CourseHeaderStyle = [
    {
      paddingTop: variant ? 10 : 15,
      paddingBottom: variant ? 5 : 7,
      color: "#757E90",
      fontSize: variant ? 5 : 19,
      alignSelf: "center",
    },
  ];

  const theHeight = [
    {
      height: variant ? fullHeight * 0.2 : fullHeight * 0.685,
    },
  ];

  return (
    <View
      style={[
        variant ? styles.matchContainerCardItem : styles.containerCardItem,
        theHeight,
      ]}
    >
      {/* IMAGE */} 
      <View style={imageWrapperStyle}>
        <Image source={image} style={imageStyle} />
      </View>

      {/* MATCHES */}
      {/* {matches && (
        <View style={styles.matchesCardItem}>
          <Text style={styles.matchesTextCardItem}>
            <Icon name="heart" /> {matches}% Match!
          </Text>
        </View>
      )} */}

      {/* NAME */}
      <Text style={nameStyle} numberOfLines={1}>{name}</Text>

      {/* Keywords */}
      {keywords && (
        <Text style={CourseHeaderStyle}>
          {keywords.map((item, index) => (
            <Text key={String(index)}>
              {index === keywords.length - 1 ? " " + item.toUpperCase() : " " + item.toUpperCase() + ","}
            </Text>
          ))}
        </Text>
      )}

      {/* DESCRIPTION */}
      {description && (
        <Text style={styles.descriptionCardItem}>{description}</Text>
      )}

      {/* STATUS */}
      {status && (
        <View style={styles.status}>
          <View style={status === "Online" ? styles.online : styles.offline} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}

      {/* ACTIONS */}
      {actions && (
        <View style={styles.actionsCardItem}>
          <TouchableOpacity style={styles.button} onPress={() => onPressLeft()}>
            <Text style={styles.dislike}>
              <Icon name="dislike" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressRight()}
          >
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
