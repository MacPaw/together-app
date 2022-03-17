import React from 'react';
import { Button, Dropdown, DropdownItem, Tooltip, notify } from '@macpaw/macpaw-ui';
import { MoreIcon } from '@macpaw/macpaw-ui/lib/Icons/jsx';
import {
  getGoogleMapsUrlByMember,
  getSlackUrlByMember,
  getErrorTextFromAxiosError,
  getOrganizationMapUrlByMember,
} from '../../../helpers/client';
import axios from 'axios';
import type { MemberDto, MemberIsAttribute } from '../../../entities';

interface MemberActionsProps {
  teamId: string;
  member: MemberDto;
  replaceMember: (member: MemberDto) => void;
}

const MemberActions: React.FC<MemberActionsProps> = ({ member, teamId, replaceMember }: MemberActionsProps) => {
  const slackUrl = getSlackUrlByMember(member, teamId);
  const googleMapsUrl = getGoogleMapsUrlByMember(member);
  const organizationMapUrl = getOrganizationMapUrlByMember(member);

  const manageIsAttribute = (attribute: MemberIsAttribute) => () => axios.post(
    '/api/set-is-attribute', {
      attribute,
      memberId: member.id,
      value: !member[attribute],
    })
    .then((response) => {
      const updatedMember = response.data;

      replaceMember(updatedMember);
      notify(`Done! Member successfully updated.`, 'success')
    })
    .catch((error) => notify(getErrorTextFromAxiosError(error), 'error'));

  return (
    <Dropdown
      position="right"
      trigger={
        <Button icon color="transparent">
          <MoreIcon/>
        </Button>
      }
    >
      <a target="_blank" rel="noopener noreferrer" href={slackUrl}>
        <DropdownItem>
          Message in Slack
        </DropdownItem>
      </a>
      {(googleMapsUrl || organizationMapUrl) && (
        <DropdownItem separator/>
      )}
      {googleMapsUrl && (
        <a target="_blank" rel="noopener noreferrer" href={googleMapsUrl}>
          <DropdownItem>
            View on Google Maps
          </DropdownItem>
        </a>
      )}
      {organizationMapUrl && (
        <a target="_blank" rel="noopener noreferrer" href={organizationMapUrl}>
          <DropdownItem>
            View on Organization Map
          </DropdownItem>
        </a>
      )}
      <DropdownItem separator/>
      <DropdownItem onClick={manageIsAttribute('isMobilized')}>
        {member.isMobilized ? 'Unmark as Mobilized' : 'Mark as Mobilized'}
      </DropdownItem>
      <DropdownItem separator/>
      <DropdownItem onClick={manageIsAttribute('isAdmin')}>
        <Tooltip
          maxWidth={340}
          position='left'
          content={`Admins are able to view and manage members in this list.`}
        >
          {member.isAdmin ? 'Revoke Admin Permissions' : 'Give Admin Permissions'}
        </Tooltip>
      </DropdownItem>
      <DropdownItem onClick={manageIsAttribute('isExemptFromCheckIn')}>
        <Tooltip
          maxWidth={340}
          position='left'
          content={`Members who are exempt from checking in will not receive check in requests and reminders, and will also not be included in monitoring.`}
        >
          {member.isExemptFromCheckIn ? 'Require Check Ins' : 'Exempt From Check Ins'}
        </Tooltip>
      </DropdownItem>
      <DropdownItem onClick={manageIsAttribute('isOptedOutOfMap')}>
        <Tooltip
          maxWidth={340}
          position='left'
          content={`This displays whether or not a member has opted out of being displayed on the Organization Map.`}
        >
          {member.isOptedOutOfMap ? 'Display on Map' : 'Hide on Map'}
        </Tooltip>
      </DropdownItem>
    </Dropdown>
  );
};

export default MemberActions;
