/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
	FlatList,
	Image,
	Modal,
	Pressable,
	TouchableOpacity,
	ImageBackground,
	Alert,
} from 'react-native';

import Main from './services/Main';

export const ChooseArtScreen = ({navigation}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [requestFailed, setRequestFailed] = useState(false);
	const [show, setShow] = useState(false);
	const [imageShow, setImageShow] = useState('https://upload.wikimedia.org/wikipedia/commons/a/a7/Blank_portrait%2C_male_%28rectangular%29.png');
	const [descriptionShow, setDescriptionShow] = useState('Dados não carregados');

	useEffect(() => {
		if (!items.length) {
			setLoading(true);
			loadItems();
			setLoading(false);
		}
	});

	const loadItems = async () => {
		const result = await Main.getArts();

		if (result.ok) {
			setRequestFailed(false)
			setItems(result.arts);
		} else {
			setRequestFailed(true)
			Alert.alert(
				'Erro de conexão',
				result.message
			)
		}
	};

	const _renderItem = (item) => {
		return (
			<View
				style={{
					flexDirection: 'column',
					height: 200,
					width: '33%',
					margin: 1,
					borderRadius: 10,
				}}>
				<TouchableOpacity onPress={() => {
					setImageShow(item.imagelink)
					setShow(true)
					setDescriptionShow(item.description)
					setModalVisible(true)
					}}>
					<Image
						style={styles.imageThumbnail}
						source={{uri: item.imagelink}}
					/>
				</TouchableOpacity>
			</View>
		);
	}

	const reloadItems = async () =>  {
		setLoading(true);
		loadItems();
		setLoading(false);
	};

	const navigateToChoosePhoto = () => {
		setShow(false)
    navigation.navigate('ChoosePhoto', {imageShow});
  };

	if (loading) {
		return (
			<View style={[styles.containerLoading, styles.horizontalLoading]}>
				<ActivityIndicator size="large" color="#000000" />
			</View>
		);
	}


	if (requestFailed) {
		return (
			<View style={[styles.containerLoading, styles.horizontalLoading]}>
				<Pressable
					style={[styles.buttonReload, styles.buttonClose]}
					onPress={() => reloadItems()}
				>
					<Text style={styles.textStyle}>Tentar novamente</Text>
				</Pressable>
			</View>
		);
	}
	return (
    <SafeAreaView style={styles.container}>
			<Text style={styles.textTitle}>Escolha a arte para montar a sua propia Arte😝</Text>
      <FlatList
        data={items}
        renderItem={({item}) => _renderItem(item)}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
			{show &&
				<View style={styles.centeredView}>
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<ImageBackground
							style={styles.imageShow}
							source={{uri: imageShow}}>
							<View style={styles.centeredView}>
								<Text style={styles.textDescription}>{descriptionShow}</Text>
								<View style={styles.buttonsShow}>
									<Pressable
											style={[styles.button, styles.buttonChoose]}
											onPress={() => navigateToChoosePhoto()}
										>
											<Text style={styles.textStyle}>Escolher</Text>
									</Pressable>
									<Pressable
											style={[styles.button, styles.buttonClose]}
											onPress={() => {
												setShow(false)
												setModalVisible(!modalVisible)}
											}
										>
											<Text style={styles.textStyle}>Voltar</Text>
									</Pressable>
								</View>
							</View>
						</ImageBackground>
					</Modal>
				</View>
			}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
	container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
		width: '100%',
  },
	imageShow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  	flex: 1,
  },
	centeredView: {
    justifyContent: 'center',
    alignItems: "center",
		margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
		width: '90%',
  },
	buttonsShow: {
		flexDirection: 'row',
	},
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
		margin: 20,
    padding: 10,
    elevation: 2
  },
	buttonReload: {
    borderRadius: 10,
		margin: 20,
    padding: 10,
    elevation: 2,
		width: 100,
		height: 55,
		alignSelf:'center'
  },
  buttonChoose: {
    backgroundColor: "#90EE90",
  },
  buttonClose: {
    backgroundColor: "#ff5555",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
	textDescription: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
	textTitle: {
		fontSize: 25,
		padding: 20,
    color: "black",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
	containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalLoading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    color: '#F3F3F3',
  },
});
