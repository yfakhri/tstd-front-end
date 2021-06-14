import React from 'react';
import Layout from '../../components/layout';
import { useSession } from 'next-auth/client';
import fetcher from '../../libs/fetcher';
import useSWR from 'swr';
import DataGrid from 'react-data-grid';
import Grid from '@material-ui/core/Grid';
import { exportToXlsx } from '../../components/exportUtils';

function ExportButton({ onExport, children }) {
  const [exporting, setExporting] = React.useState(false);
  return (
    <button
      disabled={exporting}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? 'Exporting' : children}
    </button>
  );
}

export default function Users() {
  const { data, error } = useSWR(
    `
  {
    questionAllAnswers
    questionMany{
      _id
      qname
    }
  }`,
    fetcher
  );
  const columns = [
    { key: 'name', name: 'Nama', width: 240, resizable: true, frozen: true },
    { key: 'email', name: 'Email', width: 240, resizable: true, frozen: true },
  ];
  const rows = [];
  if (data) {
    data.questionMany.forEach((quest) =>
      columns.push({
        key: quest._id,
        name: quest.qname,
        width: 200,
        resizable: true,
      })
    );
  }
  return (
    <Layout title="Users" role="admin">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {data && data.questionAllAnswers && (
            <>
              <ExportButton
                onExport={() =>
                  exportToXlsx(
                    <DataGrid
                      columns={columns}
                      rows={data.questionAllAnswers}
                    />,
                    'Tstudy.xlsx'
                  )
                }
              >
                Export to XSLX
              </ExportButton>
              <DataGrid columns={columns} rows={data.questionAllAnswers} />
            </>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
