import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileCustomer from './ProfileCustomer'
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Details from './Details'

const Stack = createStackNavigator();

const HomeScreenCustomer = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userQuerySnapshot = await firestore().collection('user').get();
                userQuerySnapshot.forEach(doc => {
                    const user = doc.data();
                    setUsername(user.user);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchServices();
        fetchUserData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
            fetchUserData();
        });

        return unsubscribe;
    }, [navigation]);


    const handleServicePress = (service) => {
        navigation.navigate('Details', { service });
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.serviceItem} onPress={() => handleServicePress(item)}>
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{`${index + 1}. ${item.service}`}</Text>
                <Text style={styles.servicePrice}>{item.prices}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileCustomer')}>
                    <Icon name="user" size={25} color="black" style={styles.profileIcon} />
                </TouchableOpacity>
            </View>

            <Text style={styles.username}>{username}</Text>

            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => String(item.id)}
                style={styles.serviceList}
            />
        </View>
    );
};

const HomeCustomer = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeCustomer"
                component={HomeScreenCustomer}
                initialParams={route.params}
            />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8ecf4',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileIcon: {
        padding: 5,
    },
    username: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666',
    },
    serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        elevation: 3,
    },
    serviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    servicePrice: {
        fontSize: 16,
        color: '#666',
    },
    serviceList: {
        flex: 1,
    },
});

export default HomeCustomer;
