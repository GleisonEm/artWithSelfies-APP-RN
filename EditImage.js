/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import CameraRoll from '@react-native-community/cameraroll';
import ViewShot from 'react-native-view-shot';
import Gestures from 'react-native-easy-gestures';
import {ColorPicker} from 'react-native-color-picker';
// import { ColorPicker } from '@nativepaint/react-native-color-picker';
import React, {useState, useCallback, useRef} from 'react';
import {
	ImageBackground,
	StyleSheet,
	Image,
	Text,
	View,
	PermissionsAndroid,
	Pressable,
	Alert,
	Modal,
} from 'react-native';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import rgbHex from "rgb-hex";
import hexRgb from 'hex-rgb';

export const EditImageScreen = ({navigation, route}) => {
	const [imageOfArt, setImageOfArt] = useState(
		route.params.uri
			? route.params.uri
			: 'http://192.168.0.106:8000/static/obra1.jpeg',
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [widthPen, setWidthPen] = useState(10);
	const [color, setColor] = useState('#000000');
	const viewRef = useRef(2);
	const sketchRef = useRef(3);

	const onCapture2 = useCallback(async () => {
		viewRef.current.capture().then(async (uri) => {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				);

				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					CameraRoll.save(uri);
					Alert.alert('Sucesso', 'Imagem salva na galeria!');
				} else {
					Alert.alert('Erro', 'Faltando permissões para a câmera');
				}
			} catch (err) {
				Alert.alert('Erro', err);
			}
		});
	}, []);

	const clearSketch = useCallback(() => {
		sketchRef.current.clear();
	});

	const undoSketch = useCallback(() => {
		sketchRef.current.undo();
	});

	return (
		<View style={styles.container}>
			<View style={styles.containerBts}>
				<Pressable
					style={[styles.button, styles.buttonGaleria]}
					onPress={() => navigation.goBack()}>
					<Text style={styles.textStyle}>Voltar</Text>
				</Pressable>
				<Pressable
					style={[styles.button, {backgroundColor: '#808080'}]}
					onPress={undoSketch}>
					<Text style={styles.textStyle}>Desfazer</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.buttonCamera]}
					onPress={clearSketch}>
					<Text style={styles.textStyle}>Limpar</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.buttonContinuar]}
					onPress={onCapture2}>
					<Text style={styles.textStyle}>Salvar</Text>
				</Pressable>
			</View>
			<ViewShot ref={viewRef} style={{flex: 1}}>
				<ImageBackground
					source={{uri: imageOfArt}}
					resizeMode="cover"
					style={styles.image}>
					<SketchCanvas
						style={{flex: 1}}
						strokeColor={color}
						strokeWidth={widthPen}
						ref={sketchRef}
					/>
				</ImageBackground>
			</ViewShot>
			<Modal
				animationType="slide"
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<Pressable
					style={[styles.button, styles.buttonGaleria]}
					onPress={() => setModalVisible(false)}>
					<Text style={styles.textStyle}>Voltar</Text>
				</Pressable>
				<ColorPicker
					onColorSelected={(color) => {
						setColor(color);
						setModalVisible(false);
					}}
					style={{flex: 1}}
				/>
			</Modal>
			<View>
				<View style={styles.containerBts}>
					<View style={styles.chooseColor}>
						<Text style={[styles.textColor, {marginRight: 5}]}>
							Cor:
						</Text>
						<Pressable
							style={{
								width: 30,
								height: 30,
								borderRadius: 44 / 2,
								elevation: 2,
								borderColor: '#0000',
								backgroundColor: color,
							}}
							onPress={() => setModalVisible(true)}></Pressable>
					</View>
					<View style={{flexDirection: 'column', marginBottom: 10}}>
						<Text style={[styles.textColor2, {margin: 5}]}>
							Pincel:
						</Text>
						<View
							style={[styles.chooseColor, {justifyContent: 'space-evenly'}]}>
							<Pressable
								style={{
									width: 30,
									height: 30,
									borderRadius: 44 / 2,
									elevation: 2,
									alignItems: 'center',
									borderColor: '#000',
									backgroundColor: '#fff',
								}}
								onPress={() => setWidthPen(widthPen - 1)}>
								<Text style={styles.textColor}>-</Text>
							</Pressable>
							<Pressable
								style={{
									width: 30,
									height: 30,
									borderRadius: 44 / 2,
									elevation: 2,
									alignItems: 'center',
									borderColor: '#000',
									backgroundColor: '#fff',
								}}
								onPress={() => setWidthPen(widthPen + 1)}>
								<Text style={styles.textColor}>+</Text>
							</Pressable>
						</View>
					</View>


					<View style={{flexDirection: 'column', marginBottom: 10}}>
						<Text style={[styles.textColor2, {margin: 5}]}>
							Opacidade:
						</Text>
						<View
							style={[styles.chooseColor, {justifyContent: 'space-evenly'}]}>
							<Pressable
								style={{
									width: 30,
									height: 30,
									borderRadius: 44 / 2,
									elevation: 2,
									alignItems: 'center',
									borderColor: '#000',
									backgroundColor: '#fff',
								}}
								onPress={() => {
										let convert = hexRgb(color);
										setColor("#" + rgbHex(convert.red, convert.green, convert.blue, convert.alpha - 0.1))
									}}>
								<Text style={styles.textColor}>-</Text>
							</Pressable>
							<Pressable
								style={{
									width: 30,
									height: 30,
									borderRadius: 44 / 2,
									elevation: 2,
									alignItems: 'center',
									borderColor: '#000',
									backgroundColor: '#fff',
								}}
								onPress={() => {
									let convert = hexRgb(color);
									setColor("#" + rgbHex(convert.red, convert.green, convert.blue, convert.alpha + 0.1))
								}}>
								<Text style={styles.textColor}>+</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	containerBts: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	container: {
		flex: 1,
		justifyContent: 'space-between',
		maxHeight: '100%',
	},
	image: {
		flex: 1,
	},
	imageSelfie: {
		width: 400,
		height: 400,
	},
	text: {
		color: 'white',
		fontSize: 42,
		lineHeight: 84,
		fontWeight: 'bold',
		backgroundColor: '#000000',
	},
	btSave: {
		width: 200,
		alignSelf: 'center',
	},
	button: {
		borderRadius: 10,
		margin: 10,
		padding: 10,
		elevation: 2,
	},
	buttonCamera: {
		backgroundColor: '#FF0000',
	},
	buttonGaleria: {
		backgroundColor: '#B0E0E6',
	},
	buttonContinuar: {
		backgroundColor: '#4682B4',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	textColor: {
		fontSize: 16,
		color: 'black',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	textColor2: {
		fontSize: 13,
		color: 'black',
		alignSelf: 'flex-end',
		textAlign: 'center',
	},
	chooseColor: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});
