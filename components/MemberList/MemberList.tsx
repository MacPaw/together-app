import React, { useMemo, useState } from 'react';
import {
  Grid,
  GridCell,
  GridRow,
  Label,
  Tag,
  Tooltip,
  Accordion,
  AccordionTrigger,
  AccordionCollapsible,
  Banner,
} from '@macpaw/macpaw-ui';
import { useRouter } from 'next/router';
import { InfoIcon } from '@macpaw/macpaw-ui/lib/Icons/jsx';
import {
  getTagColorByCriticalBoolean,
  getDisplayTextFromBool,
  getCountryTagColorByMember,
  getLastCheckInStringByMember,
  getLocationStringByMember,
  getShortLocationStringByMember,
  getLastCheckInTagColorByMember,
  findMembersByQuery,
  filterMembersByLastCheckInString,
  getDisplayTextFromCheckInBoolByMember,
  getTagColorFromCheckInCriticalBoolByMember,
} from '../../helpers/client';
import MemberActions from './MemberActions/MemberActions';
import styles from './MemberList.module.sass';
import DownloadCSV from '../DownloadCSV/DownloadCSV';
import type { MemberDto } from '../../entities';

interface MemberListProps {
  teamId: string;
  members: MemberDto[];
  total: number;
  replaceMember: (member: MemberDto) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, total, teamId, replaceMember }: MemberListProps) => {
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();
  const query = router?.query?.search as string;
  const filteredList = query ? findMembersByQuery(query, members) : members;

  const checkedInWithin24Hours = useMemo(() => {
    return filterMembersByLastCheckInString('24hrs', filteredList);
  }, [filteredList]);

  return (
    <>
      <div className={styles.statistics}>
        <p><strong>Showing:</strong> {filteredList.length} of {total}</p>
        <p><strong>Checked-In Past 24 Hours:</strong> {checkedInWithin24Hours.length} of {filteredList.length}</p>
        <div className={styles.downloadCSV}>
          <DownloadCSV members={members}/>
        </div>
      </div>
      {
        filteredList.length === 0
          ? <Banner>
            <b>No members found.</b> Please try your query again. If you haven&apos;t used the search or filters, you
            probably don&apos;t have administrator permissions.
          </Banner>
          : <Accordion onChange={(key: any) => setActiveSection(key)}>
            {filteredList.map(member => {
              return (
                <Grid
                  key={member.slackId}
                  className={styles.panel}
                  action={<MemberActions teamId={teamId} member={member} replaceMember={replaceMember}/>}
                >
                  <AccordionTrigger
                    sectionKey={member.id}
                    style={{ cursor: 'pointer' }}
                  >
                    <GridRow>
                      <GridCell type='primary'>
                        <Label>Email</Label>
                        <b>{member.email}</b>
                      </GridCell>
                      <GridCell type='primary'>
                        <Label className={styles.labelWrapper}>
                          <div>Location</div>
                          <Tooltip
                            maxWidth={260}
                            position='top'
                            content={getLocationStringByMember(member)}
                          >
                            <InfoIcon className={styles.tooltipIcon}/>
                          </Tooltip>
                        </Label>
                        <Tag
                          color={getCountryTagColorByMember(member)}
                          borderRadius={20}
                        >
                          {getShortLocationStringByMember(member)}
                        </Tag>
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Last Check In</Label>
                        <Tag
                          color={getLastCheckInTagColorByMember(member)}
                          borderRadius={20}
                        >
                          {getLastCheckInStringByMember(member)}
                        </Tag>
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Safe</Label>
                        <Tag
                          color={getTagColorFromCheckInCriticalBoolByMember(member, 'isSafe')}
                          borderRadius={20}
                        >
                          {getDisplayTextFromCheckInBoolByMember(member, 'isSafe')}
                        </Tag>
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Mobilized</Label>
                        <Tag
                          color={getTagColorByCriticalBoolean(!member.isMobilized)}
                          borderRadius={20}
                        >
                          {getDisplayTextFromBool(member.isMobilized)}
                        </Tag>
                      </GridCell>
                    </GridRow>
                  </AccordionTrigger>
                  <AccordionCollapsible sectionKey={member.id}>
                    <GridRow>
                      <GridCell type='primary'>
                        <Label>Name</Label>
                        <b>{member.name}</b>
                      </GridCell>
                      <GridCell type='primary'>
                        <Label>Comment</Label>
                        <span>{member.checkIn && member.checkIn.comment || 'N/A'}</span>
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Can Work</Label>
                        {getDisplayTextFromCheckInBoolByMember(member, 'isAbleToWork')}
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Able To Assist</Label>
                        {getDisplayTextFromCheckInBoolByMember(member, 'isAbleToAssist')}
                      </GridCell>
                      <GridCell type='secondary'>
                      </GridCell>
                    </GridRow>
                    <GridRow>
                      <GridCell type='primary'>
                      </GridCell>
                      <GridCell type='primary'>
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Admin</Label>
                        {getDisplayTextFromBool(member.isAdmin)}
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Displayed On Map</Label>
                        {getDisplayTextFromBool(member.isOptedOutOfMap)}
                      </GridCell>
                      <GridCell type='secondary'>
                        <Label>Exempt From Check Ins</Label>
                        {getDisplayTextFromBool(member.isExemptFromCheckIn)}
                      </GridCell>
                    </GridRow>
                  </AccordionCollapsible>
                </Grid>
              );
            })}
          </Accordion>
      }
    </>
  );
};

export default MemberList;
