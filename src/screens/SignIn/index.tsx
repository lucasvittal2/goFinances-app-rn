import React, { useContext, useEffect } from 'react';
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
import { Alert } from 'react-native';



export function SignIn(){
    const {  signInWithGoogle, signInWithApple } = useAuth();
    
   
    async function handleSignInWithGoogle(){
        try{
            await signInWithGoogle();
        }catch(error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta google')
        }
    }
    async function handleSignInWithApple(){
        try{
            await signInWithApple();
        }catch(error){
            console.log(error);
            Alert.alert('Não foi possível conectar a conta google')
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
                    <SignInSocialButton
                    title = "Login With Apple"
                    svg = {AppleSvg}
                    onPress = { handleSignInWithApple }
                    />
                </FooterWrapper>

            </Footer>

        </Container>
    )
};