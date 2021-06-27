import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as GoogleSignIn from 'expo-google-sign-in';
import { Alert, Platform} from 'react-native';

interface AuthProviderProps{
    children: ReactNode;
}
interface IAuthContextData{
    user: User;
    signInWithGoogle(): Promise<void>;
}
interface User{
    id: string;
    name: string;
    email: string;
    photo?: string;
}
interface googleUser{
    user: GoogleSignIn.GoogleUser | null;
}
export const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }:AuthProviderProps ){
    const [user, setUser] = useState<User>({} as User);
    //  const user: User = {
    //     id: '12123',
    //     name: 'Lucas Vital',
    //     email: 'lucasvittal@gmail.com',
    // }
 
    
    async function initAsync(){
        const androidClientId = '1031429828207-cguo5pnf25k5ugcbkemol6bvfcpdqf17.apps.googleusercontent.com';
        const IosClientId = '1031429828207-pvmc17np19068l1pfrof5tqvkpo2o1pi.apps.googleusercontent.com';
        
        console.log(Platform.OS === 'android'? androidClientId: IosClientId)
        await GoogleSignIn.initAsync({
            clientId: Platform.OS === 'android'? androidClientId: IosClientId,
            scopes: ['profile', 'email'],
            
        });
        syncWithStateAsync();
    }
    async function syncWithStateAsync(){
        const user = await GoogleSignIn.signInSilentlyAsync();
        const userLogged: User = {
            id: String( user?.uid),
            email: String(user?.email),
            name: String(user?.displayName),
            photo: user?.photoURL
        }
        setUser(userLogged);
    }
    async function signInWithGoogle(){
        try{
            await initAsync();// !!!
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user} = await GoogleSignIn.signInAsync();
            if( type === 'success'){
                syncWithStateAsync();
            }
        }catch(error){
            throw(error);
        }
    }

    async function signOutWithGoogle() {
        await GoogleSignIn.signOutAsync();
        setUser({} as User);
        
    }
    
    return(
    <AuthContext.Provider value = {{
        user,
        signInWithGoogle
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
    