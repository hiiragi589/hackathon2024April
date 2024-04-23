import * as FileSystem from "expo-file-system"

// ディレクトリに画像を保存してフルパスを返す関数
export const saveToDirAndReturnPath = async (uri: string) => {
  const tempDir = FileSystem.documentDirectory as string
  const imgName = uri.slice(uri.lastIndexOf("/") + 1)
  FileSystem.getInfoAsync(tempDir).then((dirInfo) => {
    if (!dirInfo.exists) {
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory as string, {
        intermediates: true,
      })
    }
  })
  const to = tempDir + imgName
  await FileSystem.copyAsync({ from: uri, to })
  return to
}
