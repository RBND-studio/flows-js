import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { type UserProperties, type Block } from "../types";
import { getApi } from "../api";

interface Props {
  apiUrl: string;
  environment: string;
  organizationId: string;
  userId?: string;
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
    () => ({
      environment,
      organizationId,
      userId: userId ?? "",
    }),
    [environment, organizationId, userId],
  );
  const url = useMemo(() => {
    const baseUrl = apiUrl.replace("https://", "wss://").replace("http://", "ws://");
    return `${baseUrl}/sdk/block-updates?${new URLSearchParams(params).toString()}`;
  }, [apiUrl, params]);

  const onMessage = useCallback((event: MessageEvent<unknown>) => {
    // eslint-disable-next-line no-console -- This is a debug message
    console.log("Message from server", event.data);
    const data = JSON.parse(event.data as string) as BlockUpdatesPayload;
    const exitedBlockIdsSet = new Set(data.exitedBlockIds);
    setBlocks((prevBlocks) => prevBlocks.filter((block) => !exitedBlockIdsSet.has(block.id)));
    data.updatedBlocks.forEach((updatedBlock) => {
      setBlocks((prevBlocks) => {
        const index = prevBlocks.findIndex((block) => block.id === updatedBlock.id);
        if (index === -1) return [...prevBlocks, updatedBlock];
        const newBlocks = [...prevBlocks];
        newBlocks[index] = updatedBlock;
        return newBlocks;
      });
    });
  }, []);
  useWebSocket(url, { onMessage });

  const userPropertiesRef = useRef(userProperties);
  useEffect(() => {
    userPropertiesRef.current = userProperties;
  }, [userProperties]);

  useEffect(() => {
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

  return blocks;
};
