import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect

} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

import { Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const {CLIENT_ID} = process.env;
const {REDIRECT_URI} = process.env;
console.log(REDIRECT_URI)


interface AuthProviderProps{
    children: ReactNode;
}
interface IAuthContextData{
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
}
interface User{
    id: string;
    name: string;
    email: string |null;
    photo?: string | undefined;
}
interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

export const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }:AuthProviderProps ){
    const [user, setUser] = useState<User>({} as User);
    const [ userStorageLoading, setUserStorageLoading] = useState(true);
    const userStorageKey = '@gofinances:user';
    useEffect( ()=> {
        async function loadStorageData(){
            const userStorage = await AsyncStorage.getItem(userStorageKey);
            if(userStorage){
                const userLogged = JSON.parse(userStorage) as User;
                setUser(userLogged);
            }
            setUserStorageLoading(false);
        }
        loadStorageData();
    }, []);
 // https://accounts.google.com/o/oauth2/v2/auth
    async function signInWithGoogle(){
        try{
            console.log('loging in...')
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const {params, type} = await AuthSession
            .startAsync({authUrl}) as AuthorizationResponse;
            if(type === 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                
                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    photo: userInfo.picture
                }
                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
            
        }catch(error){
            throw(error);
        }
    }
    async function signInWithApple(){
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });
            if(credential){
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email,
                    name: credential.fullName!.givenName!,
                    photo: undefined
                };
                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);            
        }

    }


    return(
        <AuthContext.Provider value = {{
            user,
            signInWithGoogle,
            signInWithApple
            }}>
            { children }
        </AuthContext.Provider>
    );
}
function useAuth(){
    const context = useContext(AuthContext)
    return context;
}
export {AuthProvider, useAuth}
    