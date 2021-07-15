import React, { useContext, useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google-icon.svg';
import LogoSvg from '../../assets/logo.svg';
import { AuthContext, useAuth } from '../../hooks/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import {
    Container,
    Header,
    TitleWrapper,
    SignInTitle,
    Footer,
    Title,
    FooterWrapper
 } from './styles';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import theme from '../../global/styles/theme';



export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const {  signInWithGoogle, signInWithApple } = useAuth();
    
   
    async function handleSignInWithGoogle(){
        try{
            setIsLoading(true);
             return await signInWithGoogle();
        }catch(error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta google');
            setIsLoading(false);
        }
            

    }
    async function handleSignInWithApple(){
        try{
           return  await signInWithApple();
        }catch(error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta google');
            setIsLoading(false);
        }
        
    }
    return(
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width = {RFValue(120)}
                        height = {RFValue(68)}
                    />
                    <Title>
                        Control your{'\n'}
                        finances{'\n'}
                        simply
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                login with one of the {'\n'}
                accounts below
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                    title = "Login with Google"
                    svg = {GoogleSvg}
                    onPress = { handleSignInWithGoogle}
                    />

                   { Platform.OS === 'ios' &&<SignInSocialButton
                    title = "Login With Apple"
                    svg = {AppleSvg}
                    onPress = { handleSignInWithApple }
                    />}
                </FooterWrapper>
            {isLoading && <ActivityIndicator color={theme.colors.shape} size={24} style={{marginTop:18}}/> }
            </Footer>

        </Container>
    )
};