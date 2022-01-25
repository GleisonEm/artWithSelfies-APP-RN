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
} from 'react-native';

export const ManageImageScreen = ({navigation, route}) => {
	const [imageOfArt, setImageOfArt] = useState(
		route.params.artUrl
			? route.params.artUrl
			: 'http://192.168.0.106:8000/static/obra1.jpeg',
	);
	const [imageUrl, setImageUrl] = useState(
		route.params
			? route.params.imageUrl
			: 'https://spassodourado.com.br/wp-content/uploads/2015/01/default-placeholder.png',
	);
	const viewRef = useRef(2);
	const onCaptureUriAndNavigate = useCallback(async () => {
		viewRef.current.capture().then(async (uri) => {
			try {
				navigation.navigate('EditImage', {uri})
			} catch (err) {
				Alert.alert('Erro', err);
			}
		});
	}, []);

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

	return (
		<View style={styles.container}>
			<ViewShot ref={viewRef} style={{flex: 1}}>
				<ImageBackground
					source={{uri: imageOfArt}}
					resizeMode="cover"
					style={styles.image}>
					<Gestures
						scalable={{
							min: 0.1,
							max: 7,
						}}
						rotatable={true}
						onEnd={(event, styles) => {}}>
						<Image
							source={{uri: imageUrl}}
							style={{
								width: 300,
								height: 300,
							}}
						/>
					</Gestures>
				</ImageBackground>
			</ViewShot>
			<View style={styles.containerBts}>
				<Pressable
					style={[styles.button, styles.buttonGaleria]}
					onPress={() => navigation.navigate('Main')}>
					<Text style={styles.textStyle}>Artes</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.buttonCamera]}
					onPress={() => navigation.goBack()}>
					<Text style={styles.textStyle}>Câmera</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.buttonContinuar]}
					onPress={onCapture2}>
					<Text style={styles.textStyle}>Salvar</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.buttonEdit]}
					onPress={onCaptureUriAndNavigate}>
					<Text style={styles.textStyle}>Editar</Text>
				</Pressable>
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
		maxHeight: '100%'
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
		backgroundColor: '#90EE99',
	},
	buttonContinuar: {
		backgroundColor: '#4682B4',
	},
	buttonEdit: {
		backgroundColor: '#55ff',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
