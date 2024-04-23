import { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Button,
} from "react-native"
import Layout from "./constants/Layout"
import { Entypo, Feather, MaterialIcons, Ionicons } from "@expo/vector-icons"

import { HomeStackParamProps } from "./types"

import { Camera, CameraType, FlashMode } from "expo-camera"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import {
  GestureEvent,
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler"

import { saveToDirAndReturnPath } from "./utils/lib"

export default function CameraScreen({
  navigation,
  route,
}: HomeStackParamProps<"Camera">) {

  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [camera, setCamera] = useState<Camera | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [type, setType] = useState<CameraType.back | CameraType.front>(
    CameraType.back
  )
  const [zoom, setZoom] = useState(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    requestPermission()
  }, [])

  // ピンチによるズーム
  const onPinchGestureEvent = (
    e: GestureEvent<PinchGestureHandlerEventPayload>
  ) => {
    var scale = e.nativeEvent.scale
    var velocity = e.nativeEvent.velocity / 20

    let newZoom =
      velocity > 0
        ? zoom + scale * velocity * (Platform.OS === "ios" ? 0.01 : 25)
        : zoom -
          scale * Math.abs(velocity) * (Platform.OS === "ios" ? 0.02 : 50)

    if (newZoom < 0) newZoom = 0
    else if (newZoom > 0.5) newZoom = 0.5

    setZoom(newZoom)
  }

  if (!permission) {
    return <View />
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>
          カメラのアクセス許可が必要です
        </Text>
        <Button onPress={() => navigation.goBack()} title={"キャンセル"} />
      </View>
    )
  }

  // 内カメ・外カメの切り替え
  const toggleCameraType = () => {
    setType((current) => {
      return current === CameraType.back ? CameraType.front : CameraType.back
    })
  }

  // 写真の撮影
  const takePicture = async () => {
    if (camera) {
      const image = await camera.takePictureAsync({})
      setImage(image.uri)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 7, justifyContent: "center" }}>
        {image !== null ? (
          <View>
            <Image
              source={{ uri: image ? image : undefined }}
              style={styles.image}
            ></Image>
            <View style={styles.rowEndContainer}>
              <TouchableOpacity
                onPress={async () => {
                  const manipResult = await manipulateAsync(
                    image!,
                    [{ rotate: 90 }],
                    { compress: 1, format: SaveFormat.PNG }
                  )
                  setImage(manipResult.uri)
                }}
                style={styles.rotateButton}
              >
                <MaterialIcons
                  name="rotate-right"
                  size={Layout.window.height * 0.0375}
                  color="gray"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const manipResult = await manipulateAsync(
                    image!,
                    [{ rotate: -90 }],
                    { compress: 1, format: SaveFormat.PNG }
                  )
                  setImage(manipResult.uri)
                }}
                style={styles.rotateButton}
              >
                <MaterialIcons
                  name="rotate-left"
                  size={Layout.window.height * 0.0375}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <GestureHandlerRootView>
              <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
                <Camera
                  style={{
                    width: Layout.window.width,
                    height: Layout.window.width,
                  }}
                  type={type}
                  flashMode={flash ? FlashMode.on : FlashMode.off}
                  zoom={zoom}
                  ref={(ref) => setCamera(ref)}
                ></Camera>
              </PinchGestureHandler>
            </GestureHandlerRootView>
            <View style={styles.rowEndContainer}>
              <TouchableOpacity
                onPress={() => setFlash(!flash)}
                style={styles.flashButton}
              >
                <Ionicons
                  name={!flash ? "flash-outline" : "flash-off-outline"}
                  size={Layout.window.height * 0.025}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View style={{ flex: 3, justifyContent: "center" }}>
        {image !== null ? (
          <View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={() => setImage(null)}>
                <Text style={styles.againText}>もう一度撮影する</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: Layout.window.height * 0.02,
                }}
                onPress={async () => {
                  const newUri = (await saveToDirAndReturnPath(
                    image!
                  )) as string
                  navigation.replace("EditableImage", {
                    image: newUri.slice(newUri.lastIndexOf("/") + 1),
                  })
                }}
              >
                <Text style={styles.completeText}>完了</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.mainButtonContainer}>
            <TouchableOpacity
              style={{ marginRight: Layout.window.width * 0.1 }}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name="cancel"
                size={Layout.window.height * 0.04}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture}>
              <Entypo
                name="circle"
                size={Layout.window.height * 0.075}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginLeft: Layout.window.width * 0.1 }}
              onPress={toggleCameraType}
            >
              <Feather
                name="refresh-cw"
                size={Layout.window.height * 0.035}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#333",
  },

  noPermissionText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: Layout.window.width * 0.04,
  },

  image: {
    width: Layout.window.width,
    height: Layout.window.width,
    borderColor: "white",
    borderWidth: 1,
  },

  rowEndContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  rotateButton: { marginRight: 16, marginTop: 8 },

  flashButton: {
    marginRight: 16,
    marginTop: 8,
    borderWidth: 0.75,
    borderRadius: Layout.window.height * 0.03,
    padding: 4,
    borderColor: "white",
  },

  againText: {
    color: "white",
    fontSize: Layout.window.width * 0.04,
  },

  completeText: {
    color: "white",
    marginTop: Layout.window.height * 0.03,
    fontSize: Layout.window.width * 0.045,
    fontWeight: "bold",
  },

  mainButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
})

