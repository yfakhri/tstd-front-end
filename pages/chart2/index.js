import React from 'react';
import Layout from '../../components/layout';
import fetcher from '../../libs/fetcher';
import useSWR from 'swr';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { VictoryPie, VictoryTooltip, VictoryLegend } from 'victory';

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
    data.questionCountAllAnswers.forEach((quest) =>
      chartData.push({
        title: quest.qname,
        type: quest.qtype,
        data: quest.answercount.map((q) => {
          return { x: q.name, y: q.value };
        }),
        legend: quest.answercount.map((q) => {
          return { name: q.name };
        }),
      })
    );
    //alert(JSON.stringify(chartData));
  }
  return (
    <Layout title="Chart" role="admin">
      <Grid container spacing={3}>
        {data &&
          chartData &&
          chartData.map((chart) => (
            <Grid item xs={12} sm={6}>
              <Paper>
                <Typography variant="h5">{chart.title}</Typography>

                <svg width={420} height={300}>
                  <VictoryPie
                    standalone={false}
                    width={300}
                    height={200}
                    padding={{
                      left: 0,
                      bottom: 20,
                      top: 20,
                    }}
                    colorScale="cool"
                    data={chart.data}
                    labels={({ datum }) => `${datum.x}:${datum.y}`}
                    labelComponent={<VictoryTooltip />}
                  />
                  <VictoryLegend
                    standalone={false}
                    colorScale="cool"
                    x={240}
                    y={40}
                    gutter={30}
                    title="Legend"
                    centerTitle
                    style={{ border: { stroke: 'black' } }}
                    data={chart.legend}
                  />
                </svg>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
}
