import React, { useEffect, useState } from 'react';
import { DownloadIcon } from '@macpaw/macpaw-ui/lib/Icons/jsx';
import { Button } from '@macpaw/macpaw-ui';
import convertObjectToCSV from '../../helpers/client/csv';

import type { MemberDto } from '../../entities';

interface DownloadCSVProps {
  members: MemberDto[]
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({ members }: DownloadCSVProps) => {
  const [link, setLink] = useState('');

  const download = () => {
    convertObjectToCSV(members)
      .then(csv => {
        const url = URL.createObjectURL(new Blob([csv], {
          type: 'text/csv;encoding:utf-8',
        }));

        setLink(url);
      });
  };

  useEffect(download, [members]);

  return (
    // @ts-ignore-next-line
    <Button color='secondary' iconLeft={<DownloadIcon width={22}/>} href={link} scale="small" download="members.csv"
            onClick={download}
            disabled={!link}>Download CSV
    </Button>);
};

export default DownloadCSV;
