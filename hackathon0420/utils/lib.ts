import * as FileSystem from 'expo-file-system';
/*import * as MediaLibrary from 'expo-media-library';*/

export const saveToDirAndReturnPath = async (uri: string): Promise<string> => {
  try {
    // メディアライブラリへのアクセス権をリクエスト
   /* const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error("メディアライブラリへのアクセスが許可されませんでした。");
    }*/

    // メディアライブラリにアセットを作成
   /* const asset = await MediaLibrary.createAssetAsync(uri);
    if (!asset) {
      throw new Error("アセットの作成に失敗しました。");
    }*/

    // ドキュメントディレクトリのパスを確認
    const tempDir = FileSystem.documentDirectory;
    if (!tempDir) {
      throw new Error("ドキュメントディレクトリが利用できません");
    }

    // 新しいファイルパスを生成
    const imgName = uri.slice(uri.lastIndexOf("/") + 1);
    const to = tempDir + imgName;

    // ドキュメントディレクトリの存在を確認し、なければ作成
    const dirInfo = await FileSystem.getInfoAsync(tempDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
    }

    // ファイルを新しいパスにコピー
    await FileSystem.copyAsync({ from: uri, to });

    // 新しいパスを返す
    return to;
  } catch (error) {
    // エラーをキャッチし、コンソールに出力
    console.error("エラーが発生しました: ", error);
    throw new Error("ファイル処理中にエラーが発生しました。");
  }
};
