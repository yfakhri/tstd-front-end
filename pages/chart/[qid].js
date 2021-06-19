import React from 'react';
import Layout from '../../components/layout';
import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import fetcher from '../../libs/fetcher';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import { useRouter } from 'next/router';
import { ResponsiveBar } from '@nivo/bar';

export default function ChartDetail() {
  const router = useRouter();
  const { qid } = router.query;
  const { data, error } = useSWR(
    `
    {
      questionCountDetail(questionId:"${qid}")
    }`,
    fetcher
  );
  const chartData = [];
  if (data) {
    if (data.questionCountDetail) {
      data.questionCountDetail.details.forEach((quest) =>
        chartData.push({
          title: quest.qname,
          type: quest.qtype,
          key: quest.answerdetail.keys,
          data: quest.answerdetail.data,
        })
      );
    }

    //alert(JSON.stringify(chartData));
  }
  return (
    <Layout title="Chart" role="admin">
      <Grid container spacing={3}>
        {data && chartData && (
          <Grid item xs={12}>
            <Typography variant="h4">
              <IconButton onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
              Detail {data.questionCountDetail.title}
            </Typography>
          </Grid>
        )}
        {data &&
          chartData &&
          chartData.map((chart, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <Paper style={{ height: '400px' }}>
                <Typography variant="h5">{chart.title}</Typography>
                <ResponsiveBar
                  data={chart.data}
                  keys={chart.key}
                  margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                  colorBy="id"
                  colors={{ scheme: 'category10' }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chart.title,
                    legendPosition: 'middle',
                    legendOffset: 32,
                  }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
}
