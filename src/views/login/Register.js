import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ActivityIndicator, 
    SafeAreaView 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Email không hợp lệ', 'Vui lòng nhập địa chỉ email hợp lệ.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Mật khẩu không hợp lệ', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== repassword) {
            Alert.alert('Mật khẩu và mật khẩu nhập lại không khớp');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const { uid } = userCredential.user;
            await firestore().collection('user').doc(uid).set({
                email: email,
                name: name,
                password: password,
                role: 'user'
            });
            Alert.alert('Đăng ký thành công');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Lỗi đăng ký', error);
            Alert.alert('Đã có lỗi xảy ra khi đăng ký', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>SpaApp</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Địa chỉ email"
                        placeholderTextColor="#6b7280"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={setEmail}
                        value={email} />

                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#6b7280"
                        secureTextEntry={true}
                        autoCorrect={false}
                        onChangeText={setPassword}
                        value={password} />

                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lại mật khẩu"
                        placeholderTextColor="#6b7280"
                        secureTextEntry={true}
                        autoCorrect={false}
                        onChangeText={setRepassword}
                        value={repassword} />

                    <TextInput
                        style={styles.input}
                        placeholder="Họ và tên"
                        placeholderTextColor="#6b7280"
                        autoCapitalize="words"
                        autoCorrect={false}
                        onChangeText={setName}
                        value={name} />

                    <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.button}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Đăng kí</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading} style={[styles.button, { backgroundColor: 'blue' }]}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Quay lại</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8ecf4',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: '#FFC0CB',
    },
    form: {
        paddingHorizontal: 40,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C9D3DB',
    },
    button: {
        height: 50,
        backgroundColor: '#FFC0CB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
