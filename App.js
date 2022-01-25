import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ChoosePhotoScreen} from './ChoosePhoto';
import {ManageImageScreen} from './ManageImage';
import {ChooseArtScreen} from './ChooseArt';
import {EditImageScreen} from './EditImage';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
                <Stack.Screen name="Main" component={ChooseArtScreen} />
                <Stack.Screen name="ChoosePhoto" component={ChoosePhotoScreen} />
                <Stack.Screen name="ManageImage" component={ManageImageScreen} />
								<Stack.Screen name="EditImage" component={EditImageScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
