import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout';
import fetcher from '../../libs/fetcher';
import useSWR from 'swr';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import Tooltip from '@material-ui/core/Tooltip';
import { ResponsiveBar } from '@nivo/bar';

export default function Chart() {
  const { data, error } = useSWR(
    `
    {
      questionCountAllAnswers
    }`,
    fetcher
  );
  const chartData = [];
  if (data) {
    if (data.questionCountAllAnswers) {
      data.questionCountAllAnswers.forEach((quest) =>
        chartData.push({
          id: quest._id,
          title: quest.qname,
          type: quest.qtype,
          data: quest.answercount.map((q) => {
            return { id: q.name, Jumlah: q.value };
          }),
          legend: quest.answercount.map((q) => {
            return { name: q.name };
          }),
        })
      );
    }

    //alert(JSON.stringify(chartData));
  }
  return (
    <Layout title="Chart" role="admin">
      <Grid container spacing={3}>
        {data &&
          chartData &&
          chartData.map((chart, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <Paper style={{ height: '400px' }}>
                <Typography variant="h5">
                  {chart.title}{' '}
                  <Link href={`/chart/${chart.id}`}>
                    <Tooltip title="Detail">
                      <IconButton>
                        <ListIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Typography>

                <ResponsiveBar
                  data={chart.data}
                  keys={['Jumlah']}
                  margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                  colorBy="index"
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
                      dataFrom: 'indexes',
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
