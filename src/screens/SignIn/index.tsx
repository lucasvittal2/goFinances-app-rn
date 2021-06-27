import React, { useContext } from 'react';
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
    const { user, signInWithGoogle } = useAuth();
    

    async function handleSignWithGoogle(){
        try{
            await signInWithGoogle();
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
                        Controle suas{'\n'}
                        finanças de forma{'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com{'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                    title = "Entrar com Google"
                    svg = {GoogleSvg}
                    onPress = { handleSignWithGoogle }
                    />
                    <SignInSocialButton
                    title = "Entrar com Apple"
                    svg = {AppleSvg}
                    />
                </FooterWrapper>

            </Footer>

        </Container>
    )
};