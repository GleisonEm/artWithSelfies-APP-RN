/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useState} from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	Image,
	ActivityIndicator,
	ToastAndroid,
	Alert,
	Pressable,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Upload from './services/Upload';

const LoadingComponent = () => {
	return (
		<View style={[styles.containerActivity, styles.horizontal]}>
			<ActivityIndicator size="large" color="#00ff00" />
		</View>
	);
};

const showToast = (message) => {
	ToastAndroid.showWithGravity(
		message,
		ToastAndroid.SHORT,
		ToastAndroid.CENTER,
	);
};

export const ChoosePhotoScreen = ({navigation, route}) => {
	const isDarkMode = useColorScheme() === 'dark';
	const [imageUrl, setImageUrl] = useState(
		'https://spassodourado.com.br/wp-content/uploads/2015/01/default-placeholder.png',
		// 'http://192.168.0.106:8004/media/CjNVPYKd.png'
	);
	const [artUrl, setArtUrl] = useState(
		route.params.imageShow
			? route.params.imageShow
			: 'https://spassodourado.com.br/wp-content/uploads/2015/01/default-placeholder.png',
	);
	const [userSendPhoto, setUserSendPhoto] = useState(false);
	const [loadingSendPhoto, setLoadingSendPhoto] = useState(false);

	if (loadingSendPhoto) {
		return LoadingComponent();
	}

	const getPhotoFromLibrary = async () => {
		const options = {
			title: 'Alterar Foto',
			takePhotoButtonTitle: 'Câmera',
			chooseFromLibraryButtonTitle: 'Galeria',
			cancelButtonTitle: 'Cancelar',
			rotation: 360,
		};
		launchImageLibrary(options, async (response) => {
			if (response.didCancel) {
				return;
			} else if (response.error) {
				showToast(
					'Você precisa dar permissões de armazenamento e câmera para atualizar a foto.',
				);
			} else {
				let mode = 'contain';
				let onlyScaleDown = false;
				let image = response.assets[0];

				await ImageResizer.createResizedImage(
					image.uri,
					1200,
					1200,
					'JPEG',
					100,
					0,
					undefined,
					false,
					{mode, onlyScaleDown},
				)
					.then(async (resizedImage) => {
						let formData = new FormData();
						formData.append('file_uploaded', {
							uri: resizedImage.uri,
							name: resizedImage.name,
							type: 'image/jpeg',
						});
						formData.append('robin', 'robin');
						setImageUrl(resizedImage.uri);
						setLoadingSendPhoto(true);

						const result = await Upload.getImageIA(formData);

						setLoadingSendPhoto(false);
						if (result.ok) {
							if (result.imageLink) {
								setImageUrl(result.imageLink);
								setUserSendPhoto(true);
							} else {
								Alert.alert(
									'Erro de conexão',
									'Não foi possivel obter a imagem!',
								);
							}
						} else {
							showToast(result.message);
						}
					})
					.catch(() => {
						Alert.alert('Erro de conexão', 'Não foi possivel obter a imagem!');
					});
			}
		});
	};

	const getPhotoFromCamera = async () => {
		const options = {
			quality: 0.9,
			cameraType: 'front',
		};
		launchCamera(options, async (response) => {
			if (response.didCancel) {
				return;
			} else if (response.error) {
				showToast(
					'Você precisa dar permissões de armazenamento e câmera para atualizar a foto.',
				);
			} else {
				let mode = 'contain';
				let onlyScaleDown = false;
				let image = response.assets[0];

				await ImageResizer.createResizedImage(
					image.uri,
					1200,
					1200,
					'JPEG',
					100,
					0,
					undefined,
					false,
					{mode, onlyScaleDown},
				)
					.then(async (resizedImage) => {
						let formData = new FormData();
						formData.append('file_uploaded', {
							uri: resizedImage.uri,
							name: resizedImage.name,
							type: 'image/jpeg',
						});
						setImageUrl(resizedImage.uri);
						setLoadingSendPhoto(true);
						const result = await Upload.getImageIA(formData);

						setLoadingSendPhoto(false);
						if (result.ok) {
							if (result.imageLink) {
								setImageUrl(result.imageLink);
								setUserSendPhoto(true);
							} else {
								showToast('Não foi possivel obter a imagem!');
							}
						} else {
							showToast(result.message);
						}
					})
					.catch(() => {
						showToast('Não foi possivel obter a imagem!');
					});
			}
		});
	};

	const navigateToManageImagem = () => {
		navigation.navigate('ManageImage', {imageUrl, artUrl});
	};

	return (
		<SafeAreaView>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<View style={styles.container}>
				<View style={styles.containerBts}>
					<Pressable
						style={[styles.button, styles.buttonCamera]}
						onPress={() => getPhotoFromCamera()}>
						<Text style={styles.textStyle}>Câmera</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonGaleria]}
						onPress={() => getPhotoFromLibrary()}>
						<Text style={styles.textStyle}>Galeria</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.buttonContinuar]}
						onPress={() => navigateToManageImagem()}
						disabled={!userSendPhoto}>
						<Text style={styles.textStyle}>Continuar</Text>
					</Pressable>
				</View>
				<Image style={styles.imageBeginUpload} source={{uri: imageUrl}} />
				<Image style={styles.artBeginUpload} source={{uri: artUrl}} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	containerBts: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	libraryBt: {
		borderRadius: 10,
		backgroundColor: '#ffffff',
	},
	cameraBt: {
		borderRadius: 10,
		backgroundColor: '#ffffff',
	},
	nextBt: {
		borderRadius: 10,
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
	imageBeginUpload: {
		width: '80%',
		height: '39%',
		alignSelf: 'center',
		margin: 20,
	},
	artBeginUpload: {
		width: '80%',
		height: '39%',
		alignSelf: 'center',
		margin: 20,
	},
	container: {
		maxHeight: '98%'
	},
	containerActivity: {
		flex: 1,
		justifyContent: 'center',
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
		color: '#F3F3F3',
	},
	button: {
		borderRadius: 10,
		margin: 20,
		padding: 10,
		elevation: 2,
	},
	buttonCamera: {
		backgroundColor: '#FF0000',
	},
	buttonGaleria: {
		backgroundColor: '#90EE90',
	},
	buttonContinuar: {
		backgroundColor: '#4682B4',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
