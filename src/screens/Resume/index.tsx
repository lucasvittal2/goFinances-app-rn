import React from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard';
import { useTheme  } from 'styled-components';
import { VictoryPie} from 'victory-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButtom,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';
interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
};
interface CategoryData{
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percentFormatted: string;
    percent: number;
} 
import { useEffect } from 'react';
import { categories } from '../../utils/categories';
import { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useAuth } from '../../hooks/auth';
export function Resume(){
    const [ isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState( new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const theme  = useTheme();
    const { user } = useAuth();
    function handleDateChange(action: 'next' | 'prev'){
        
        if(action === 'next'){
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
        }
        else{
            setSelectedDate(subMonths(selectedDate, 1));
        }

    }
    async function loadData(){
      setIsLoading(true);
      const dataKey = `@gofinances:transactions_user${user.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const responseFormatted = response ? JSON.parse(response) : [];

      
      const expensives = responseFormatted.filter(( expensive: TransactionData) =>{ 
        return (
            expensive.type === 'negative' && 
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date( expensive.date).getFullYear() === selectedDate.getFullYear()
        );
      }
      );
      
      const expensiveTotal = expensives
      .reduce((accumulator: number, expensive: TransactionData)=>{
          return accumulator + Number(expensive.amount);
      },0);
      
      const totalByCategory: CategoryData[] = [];
      const data = categories.forEach(category => {
          let categorySum = 0;
          expensives.forEach( (expensive: TransactionData) => {
              if(expensive.category   === category.key){
                  categorySum += Number(expensive.amount);
              }

          })
          if(categorySum > 0){
            const totalFormatted = categorySum
            .toLocaleString( 'pt-BR',{
                style: 'currency',
                currency: 'BRL'
            });
            const percent = (categorySum/ expensiveTotal * 100);
            const percentFormatted = `${percent.toFixed(1)}%`;

            totalByCategory.push({
                key: category.key,
                name: category.name,
                color: category.color,
                total: categorySum,
                percent,
                percentFormatted,
                totalFormatted
            });}
      });
      console.log(expensives);
      setTotalByCategories(totalByCategory);
      setIsLoading(false);
      
    }

    
    useFocusEffect(useCallback(() => {
        loadData();
      },[ selectedDate]));
    return(
        <Container>
            <Header>
                    <Title> Resumo por Categoria</Title>
            </Header>
            {
            isLoading?
           
                <LoadContainer>
                    <ActivityIndicator color = { theme.colors.secondary } size = 'large'/>
                </LoadContainer> :
               <Content
               showsVerticalScrollIndicator = { false }
               contentContainerStyle={
                   {
                       paddingHorizontal: 24,
                       paddingBottom: useBottomTabBarHeight(),
                       
                   
                   }
               } 
           >
                
                <MonthSelect>
                    <MonthSelectButtom onPress = { ()=> handleDateChange('prev')}>
                        <MonthSelectIcon name="chevron-left"/>
                    </MonthSelectButtom>

                    <Month> {format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }</Month>

                    <MonthSelectButtom onPress = { ()=> handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right"/>
                    </MonthSelectButtom>
                </MonthSelect>
                
                    <ChartContainer>
                        <VictoryPie
                        data = { totalByCategories}
                        colorScale = { totalByCategories.map( category => category.color)}
                        style = {{
                            labels:{
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape,
                                marginRight: 10
                            }
                        }}
                        labelRadius = { 130 }
                        x = "percentFormatted"
                        y = "total"
                        />
                    </ChartContainer>
                    { 
                    totalByCategories.map( item => (
                                <HistoryCard
                                key = {item.key}
                                title = {item.name}
                                amount = {item.totalFormatted}
                                color = {item.color}
                                />
                            ))
                        }
                </Content>
                
                } 
        </Container>
    )
}