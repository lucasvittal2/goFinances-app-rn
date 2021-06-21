import React,{ useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  HighlightCards,
  Icon,
  Transactions,
  TransactionsList,
  Title,
  LogoutButton,
  LoadContainer
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { number, string } from "yup";
import theme from "../../global/styles/theme";
import { LastTransaction } from "../../components/HighlightCard/styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}interface HighlightProps {
  total: string;
  lastTransation: string;
}
interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  accountBalance: HighlightProps;
}
export function DashBoard() {

  const [isLoading, setIsLoading] = useState(true);
  const [ transactions, setTransactions] = useState<DataListProps[]>();
  const [ highlightData, setHighlightData] = useState<HighlightData>({entries: 0, expensive: 0, accountBalance: 0} as HighlightData);
  function getLastTransactionDate(collection: DataListProps[], type: 'positive'|'negative'){
    const lastTransaction = 
   new Date ( 
      Math.max.apply(
      Math,
        collection
          .filter((transaction) => transaction.type === 'positive')
          .map((transaction) => new Date(transaction.date).getTime())));

      return `${ lastTransaction.getDate() } de  ${ lastTransaction.toLocaleDateString('pt-BR',{month: 'long'}) }`
  }
  
  async function loadTransaction(){
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal  = 0;
    let expensiveTotal  = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if( item.type === 'positive'){
          entriesTotal += Number(item.amount);
        }
        else{
          expensiveTotal += Number(item.amount);
        }
        const amount = Number(item.amount).toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        });
        const dateFormatted = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        } ).format(new Date(item.date));
      
        return {
          id: item.id,
          title: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: dateFormatted,
        }
      }
    );
    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 à ${lastTransactionExpensives}`;
    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransation: ` ultima entrada ${lastTransactionEntries}`
      },
      expensive:{
        total:expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransation: ` ultima saída  ${lastTransactionExpensives}`
      },
      accountBalance:{
        total: (entriesTotal - expensiveTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransation:  totalInterval
      }
    })
    setIsLoading(false);
  }
  useEffect(() => {
    loadTransaction();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransaction();
  },[]));
  return (
    <Container>
      {
        isLoading? 
        <LoadContainer>
            <ActivityIndicator color = { theme.colors.secondary } size = 'large'/>
        </LoadContainer> :
        <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo
                source={{
                  uri: "https://avatars.githubusercontent.com/u/62555057?v=4",
                }}
              />
              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>Lucas</UserName>
              </User>
            </UserInfo>
            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>
          </UserWrapper>
        </Header>

        <HighlightCards
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
            <HighlightCard
              type="up"
              title="Entradas"
              amount= { highlightData.entries.total }
              lastTransaction= {highlightData.entries.lastTransation}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount= { highlightData.expensive.total }
              lastTransaction= { highlightData.expensive.lastTransation }
            />
            <HighlightCard
              type="total"
              title="Total"
              amount= { highlightData.accountBalance.total }
              lastTransaction= { highlightData.accountBalance.lastTransation }
            />
        </HighlightCards>
        <Transactions>
          <Title> Listagem </Title>
          <TransactionsList
            data = { transactions }
            renderItem={({ item }) => <TransactionCard data = { item } />}
            keyExtractor={(item) => item.id}
          />
        </Transactions>
      </>
      }
    </Container>
  );
}
