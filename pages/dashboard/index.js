import React from 'react';
import Layout from '../../components/layout';
import { useSession } from 'next-auth/client';
import QuestionList from '../../components/question/questionList';

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <QuestionList />
    </Layout>
  );
}
