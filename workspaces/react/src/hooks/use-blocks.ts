import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type UserProperties, type Block, type TourStep } from "../types";
import { getApi } from "../api";
import { log } from "../lib/log";
import { useWebsocket } from "./use-websocket";

interface Props {
  apiUrl: string;
  environment: string;
  organizationId: string;
  userId: string;
  userProperties?: UserProperties;
}

interface BlockUpdatesPayload {
  exitedBlockIds: string[];
  updatedBlocks: Block[];
}

export const useBlocks = ({
  apiUrl,
  environment,
  organizationId,
  userId,
  userProperties,
}: Props): Block[] => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const params = useMemo(
    () => ({ environment, organizationId, userId }),
    [environment, organizationId, userId],
  );
  const userPropertiesRef = useRef(userProperties);
  useEffect(() => {
    userPropertiesRef.current = userProperties;
  }, [userProperties]);

  // TODO: call fetchBlocks on reconnect
  const fetchBlocks = useCallback(() => {
    void getApi(apiUrl)
      .getBlocks({ ...params, userProperties: userPropertiesRef.current })
      .then((res) => {
        setBlocks(res.blocks);
      })
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console -- This is a debug message
        console.log(err);
      });
  }, [apiUrl, params]);

  const url = useMemo(() => {
    const baseUrl = apiUrl.replace("https://", "wss://").replace("http://", "ws://");
    return `${baseUrl}/sdk/block-updates?${new URLSearchParams(params).toString()}`;
  }, [apiUrl, params]);

  const onMessage = useCallback((event: MessageEvent<unknown>) => {
    // TODO: add debug logging
    // console.log("Message from server", event.data);
    const data = JSON.parse(event.data as string) as BlockUpdatesPayload;
    const exitedOrUpdatedBlockIdsSet = new Set([
      ...data.exitedBlockIds,
      ...data.updatedBlocks.map((b) => b.id),
    ]);
    setBlocks((prevBlocks) => {
      const filteredBlocks = prevBlocks.filter(
        (block) => !exitedOrUpdatedBlockIdsSet.has(block.id),
      );
      return [...filteredBlocks, ...data.updatedBlocks];
    });
  }, []);
  useWebsocket({ url, onMessage, onOpen: fetchBlocks });

  // Log error about slottable blocks without slotId
  useEffect(() => {
    blocks.forEach((b) => {
      logSlottableError(b);

      b.tourBlocks?.forEach((tb) => {
        logSlottableError(tb);
      });
    });
  }, [blocks]);

  return blocks;
};

const logSlottableError = (b: Block | TourStep): void => {
  if (b.slottable && !b.slotId)
    log.error(
      `Encountered workflow block "${b.componentType}" that is slottable but has no slotId`,
    );
};
