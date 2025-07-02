// TODO: find a better naming convention for the file that was an index file before
import * as React from 'react';

import { useTracking } from '@strapi/admin/strapi-admin';
import { Flex, IconButton } from '@strapi/design-system';
import { Crop as Resize, Download as DownloadIcon, Trash } from '@strapi/icons';
import cropperjscss from 'cropperjs/dist/cropper.css?raw';
import { useIntl } from 'react-intl';
import { createGlobalStyle } from 'styled-components';

import { AssetType } from '../../../constants';
import { useCropImg } from '../../../hooks/useCropImg';
import { useEditAsset } from '../../../hooks/useEditAsset';
import { useUpload } from '../../../hooks/useUpload';
import { createAssetUrl, getTrad, downloadFile } from '../../../utils';
import { CopyLinkButton } from '../../CopyLinkButton/CopyLinkButton';
import { UploadProgress } from '../../UploadProgress/UploadProgress';
import { RemoveAssetDialog } from '../RemoveAssetDialog';

import { AssetPreview } from './AssetPreview';
import { CroppingActions } from './CroppingActions';
import {
  ActionRow,
  BadgeOverride,
  RelativeBox,
  UploadProgressWrapper,
  Wrapper,
} from './PreviewComponents';

import type { File as FileDefinition, RawFile } from '../../../../../shared/contracts/files';

import { FocalActions } from './FocalActions';

// @ts-ignore
import { ImageFocalPoint, FocalPoint } from '@lemoncode/react-image-focal-point';
import '@lemoncode/react-image-focal-point/style.css';

interface Asset extends Omit<FileDefinition, 'folder'> {
  isLocal?: boolean;
  rawFile?: RawFile;
  folder?: FileDefinition['folder'] & { id: number };
  focalPoint?: FocalPoint | null;
}

interface PreviewBoxProps {
  asset: Asset;
  canUpdate: boolean;
  canCopyLink: boolean;
  canDownload: boolean;
  replacementFile?: File;
  onDelete: (asset?: Asset | null) => void;
  onCropFinish: () => void;
  onCropStart: () => void;
  onCropCancel: () => void;
  onFocalStart: () => void;
  onFocalFinish: () => void;
  onFocalCancel: () => void;
  trackedLocation?: string;
}

export const PreviewBox = ({
  asset,
  canUpdate,
  canCopyLink,
  canDownload,
  onDelete,
  onCropFinish,
  onCropStart,
  onCropCancel,
  onFocalStart,
  onFocalFinish,
  onFocalCancel,
  replacementFile,
  trackedLocation,
}: PreviewBoxProps) => {
  const CropperjsStyle = createGlobalStyle`${cropperjscss}`;
  const { trackUsage } = useTracking();
  const previewRef = React.useRef(null);
  const [isCropImageReady, setIsCropImageReady] = React.useState(false);
  const [hasCropIntent, setHasCropIntent] = React.useState<boolean | null>(null);
  const [assetUrl, setAssetUrl] = React.useState(createAssetUrl(asset, false));
  const [thumbnailUrl, setThumbnailUrl] = React.useState(createAssetUrl(asset, true));
  const { formatMessage } = useIntl();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { crop, produceFile, stopCropping, isCropping, isCropperReady, width, height } =
    useCropImg();
  const { editAsset, error, isLoading, progress, cancel } = useEditAsset();

  const [hasFocalIntent, setHasFocalIntent] = React.useState<boolean | null>(null);
  const [focalPoint, setFocalPoint] = React.useState<FocalPoint>(asset.focalPoint || null);
  const [isFocalImageReady, setIsFocalImageReady] = React.useState(false);
  const [stopFocal, setStopFocal] = React.useState(true);

  const {
    upload,
    isLoading: isLoadingUpload,
    cancel: cancelUpload,
    error: uploadError,
    progress: progressUpload,
  } = useUpload();

  React.useEffect(() => {
    // Whenever a replacementUrl is set, make sure to permutate the real asset.url by
    // the locally generated one
    if (replacementFile) {
      const fileLocalUrl = URL.createObjectURL(replacementFile);

      if (asset.isLocal) {
        asset.url = fileLocalUrl;
      }

      setAssetUrl(fileLocalUrl);
      setThumbnailUrl(fileLocalUrl);
    }
  }, [replacementFile, asset]);

  React.useEffect(() => {
    if (hasCropIntent === false) {
      stopCropping();
      onCropCancel();
    }
  }, [hasCropIntent, stopCropping, onCropCancel, onCropFinish]);

  React.useEffect(() => {
    if (hasFocalIntent === false) {
      setStopFocal(true);
      onFocalCancel();
    }
  }, [hasFocalIntent, stopFocal, onFocalCancel, onFocalFinish]);

  React.useEffect(() => {
    if (hasFocalIntent && isFocalImageReady) {
      onFocalStart();
    }
  }, [isFocalImageReady, hasFocalIntent, onFocalStart]);

  React.useEffect(() => {
    if (hasCropIntent && isCropImageReady) {
      crop(previewRef.current!);
      onCropStart();
    }
  }, [isCropImageReady, hasCropIntent, onCropStart, crop]);

  const handleCropping = async () => {
    const nextAsset = { ...asset, width, height, folder: asset.folder?.id };
    const file = (await produceFile(nextAsset.name, nextAsset.mime!, nextAsset.updatedAt!)) as File;

    // Making sure that when persisting the new asset, the URL changes with width and height
    // So that the browser makes a request and handle the image caching correctly at the good size
    let optimizedCachingImage;
    let optimizedCachingThumbnailImage;

    if (asset.isLocal) {
      optimizedCachingImage = URL.createObjectURL(file);
      optimizedCachingThumbnailImage = optimizedCachingImage;
      asset.url = optimizedCachingImage;
      asset.rawFile = file;

      trackUsage('didCropFile', { duplicatedFile: null, location: trackedLocation! });
    } else {
      const updatedAsset = await editAsset(nextAsset, file);

      optimizedCachingImage = createAssetUrl(updatedAsset, false);
      optimizedCachingThumbnailImage = createAssetUrl(updatedAsset, true);

      trackUsage('didCropFile', { duplicatedFile: false, location: trackedLocation! });
    }

    setAssetUrl(optimizedCachingImage);
    setThumbnailUrl(optimizedCachingThumbnailImage);
    setHasCropIntent(false);
  };

  const handleFocalPoint = async () => {
    asset.focalPoint = focalPoint;

    setHasFocalIntent(false);
  };

  const isInCroppingMode = isCropping && !isLoading;
  const isInFocalMode = hasFocalIntent && !isLoading;

  const handleDuplication = async () => {
    const nextAsset = { ...asset, width, height };
    const file = (await produceFile(
      nextAsset.name,
      nextAsset.mime!,
      nextAsset.updatedAt!
    )) as RawFile;

    await upload({ name: file.name, rawFile: file }, asset.folder?.id ? asset.folder.id : null);

    trackUsage('didCropFile', { duplicatedFile: true, location: trackedLocation! });

    setHasCropIntent(false);
    onCropFinish();
  };

  const handleCropCancel = () => {
    setHasCropIntent(false);
  };

  const handleCropStart = () => {
    setHasCropIntent(true);
  };

  const handleFocalStart = () => {
    setHasFocalIntent(true);
    setIsFocalImageReady(true);
  };

  const handleFocalCancel = () => {
    setStopFocal(true);
    setHasFocalIntent(false);
  };

  return (
    <>
      <CropperjsStyle />
      <RelativeBox hasRadius background="neutral150" borderColor="neutral200">
        {isCropperReady && isInCroppingMode && (
          <CroppingActions
            onValidate={handleCropping}
            onDuplicate={asset.isLocal ? undefined : handleDuplication}
            onCancel={handleCropCancel}
          />
        )}

        {isInFocalMode && (
          <FocalActions
            onValidate={handleFocalPoint}
            onDuplicate={asset.isLocal ? undefined : handleDuplication}
            onCancel={handleFocalCancel}
          />
        )}

        <ActionRow paddingLeft={3} paddingRight={3} justifyContent="flex-end">
          <Flex gap={1}>
            {canUpdate && !asset.isLocal && (
              <IconButton
                label={formatMessage({
                  id: 'global.delete',
                  defaultMessage: 'Delete',
                })}
                onClick={() => setShowConfirmDialog(true)}
              >
                <Trash />
              </IconButton>
            )}

            {canDownload && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.download'),
                  defaultMessage: 'Download',
                })}
                onClick={() => downloadFile(assetUrl!, asset.name)}
              >
                <DownloadIcon />
              </IconButton>
            )}

            {canCopyLink && <CopyLinkButton url={assetUrl!} />}

            {canUpdate && asset.mime?.includes(AssetType.Image) && (
              <IconButton
                label={formatMessage({ id: getTrad('control-card.crop'), defaultMessage: 'Crop' })}
                onClick={handleCropStart}
              >
                <Resize />
              </IconButton>
            )}
            {canUpdate && asset.mime?.includes(AssetType.Image) && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.focal'),
                  defaultMessage: 'Focal point',
                })}
                onClick={handleFocalStart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="currentColor"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h160v80H200Zm400 0v-80h160v-160h80v160q0 33-23.5 56.5T760-120H600ZM120-600v-160q0-33 23.5-56.5T200-840h160v80H200v160h-80Zm640 0v-160H600v-80h160q33 0 56.5 23.5T840-760v160h-80ZM480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280Zm0-80q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0-120Z" />
                </svg>
              </IconButton>
            )}
          </Flex>
        </ActionRow>

        <Wrapper>
          {/* This one is for editting an asset */}
          {isLoading && (
            <UploadProgressWrapper>
              <UploadProgress error={error} onCancel={cancel} progress={progress} />
            </UploadProgressWrapper>
          )}
          {/* This one is for duplicating an asset after cropping */}
          {isLoadingUpload && (
            <UploadProgressWrapper>
              <UploadProgress
                error={uploadError}
                onCancel={cancelUpload}
                progress={progressUpload}
              />
            </UploadProgressWrapper>
          )}

          {hasFocalIntent ? (
            <Flex gap={2} alignItems={'center'} justifyContent="center">
              <ImageFocalPoint
                src={assetUrl!}
                focalPoint={focalPoint}
                onChange={(focalPoint: FocalPoint) => setFocalPoint(focalPoint)}
              />
            </Flex>
          ) : (
            <AssetPreview
              ref={previewRef}
              focalPoint={asset.focalPoint}
              mime={asset.mime!}
              name={asset.name}
              url={hasCropIntent || hasFocalIntent ? assetUrl! : thumbnailUrl!}
              onLoad={() => {
                if (asset.isLocal || hasCropIntent) {
                  setIsCropImageReady(true);
                  setIsFocalImageReady(true);
                }
              }}
            />
          )}
        </Wrapper>

        <ActionRow
          paddingLeft={2}
          paddingRight={2}
          justifyContent="flex-end"
          $blurry={isInCroppingMode}
        >
          {isInCroppingMode && width && height && (
            <BadgeOverride background="neutral900" color="neutral0">
              {width && height ? `${height}✕${width}` : 'N/A'}
            </BadgeOverride>
          )}
        </ActionRow>
      </RelativeBox>

      <RemoveAssetDialog
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          onDelete(null);
        }}
        asset={asset}
      />
    </>
  );
};
