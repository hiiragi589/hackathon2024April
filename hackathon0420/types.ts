// types.ts
import { StackScreenProps } from '@react-navigation/stack';

// HomeStackのパラメータを定義する
export type HomeStackParamList = {
    Home: undefined;
    Camera: undefined;  // 他にパラメータが必要な場合はここに追加します
    EditableImage: { image: string };  // 画像編集画面で必要なパラメータを定義
    // 他のスクリーンのパラメータも同様に定義
};

// StackScreenPropsを使用して、全てのスクリーンのPropsの型を生成する
export type HomeStackParamProps<Screen extends keyof HomeStackParamList> = StackScreenProps<HomeStackParamList, Screen>;