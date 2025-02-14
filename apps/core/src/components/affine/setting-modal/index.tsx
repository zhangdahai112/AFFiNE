import { WorkspaceDetailSkeleton } from '@affine/component/setting-components';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { ContactWithUsIcon } from '@blocksuite/icons';
import { Modal, type ModalProps } from '@toeverything/components/modal';
import { Suspense, useCallback } from 'react';

import { useCurrentLoginStatus } from '../../../hooks/affine/use-current-login-status';
import { AccountSetting } from './account-setting';
import {
  GeneralSetting,
  type GeneralSettingKeys,
  useGeneralSettingList,
} from './general-setting';
import { SettingSidebar } from './setting-sidebar';
import * as style from './style.css';
import { WorkspaceSetting } from './workspace-setting';

type ActiveTab = GeneralSettingKeys | 'workspace' | 'account';

export interface SettingProps extends ModalProps {
  activeTab: ActiveTab;
  workspaceId: string | null;
  onSettingClick: (params: {
    activeTab: ActiveTab;
    workspaceId: string | null;
  }) => void;
}

export const SettingModal = ({
  activeTab = 'appearance',
  workspaceId = null,
  onSettingClick,
  ...modalProps
}: SettingProps) => {
  const t = useAFFiNEI18N();
  const loginStatus = useCurrentLoginStatus();

  const generalSettingList = useGeneralSettingList();

  const onGeneralSettingClick = useCallback(
    (key: GeneralSettingKeys) => {
      onSettingClick({
        activeTab: key,
        workspaceId: null,
      });
    },
    [onSettingClick]
  );
  const onWorkspaceSettingClick = useCallback(
    (workspaceId: string) => {
      onSettingClick({
        activeTab: 'workspace',
        workspaceId,
      });
    },
    [onSettingClick]
  );
  const onAccountSettingClick = useCallback(() => {
    onSettingClick({ activeTab: 'account', workspaceId: null });
  }, [onSettingClick]);

  return (
    <Modal
      width={1080}
      height={760}
      contentOptions={{
        ['data-testid' as string]: 'setting-modal',
        style: {
          maxHeight: '85vh',
          maxWidth: '70vw',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
        },
      }}
      {...modalProps}
    >
      <SettingSidebar
        generalSettingList={generalSettingList}
        onGeneralSettingClick={onGeneralSettingClick}
        onWorkspaceSettingClick={onWorkspaceSettingClick}
        selectedGeneralKey={activeTab}
        selectedWorkspaceId={workspaceId}
        onAccountSettingClick={onAccountSettingClick}
      />

      <div data-testid="setting-modal-content" className={style.wrapper}>
        <div className={style.content}>
          {activeTab === 'workspace' && workspaceId ? (
            <Suspense fallback={<WorkspaceDetailSkeleton />}>
              <WorkspaceSetting key={workspaceId} workspaceId={workspaceId} />
            </Suspense>
          ) : null}
          {generalSettingList.find(v => v.key === activeTab) ? (
            <GeneralSetting generalKey={activeTab as GeneralSettingKeys} />
          ) : null}
          {activeTab === 'account' && loginStatus === 'authenticated' ? (
            <AccountSetting />
          ) : null}
        </div>
        <div className="footer">
          <a
            href="https://community.affine.pro/home"
            target="_blank"
            rel="noreferrer"
            className={style.suggestionLink}
          >
            <span className={style.suggestionLinkIcon}>
              <ContactWithUsIcon />
            </span>
            {t['com.affine.settings.suggestion']()}
          </a>
        </div>
      </div>
    </Modal>
  );
};
