import { useEffect, useRef, useState } from "react";
import { type UserProperties, type Block } from "./types";
import { getApi } from "./api";

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

  const userPropertiesRef = useRef(userProperties);
  useEffect(() => {
    userPropertiesRef.current = userProperties;
  }, [userProperties]);

  useEffect(() => {
    const webSocketUrl = apiUrl.replace("https://", "wss://").replace("http://", "ws://");
    const params = {
      environment,
      organizationId,
      userId: userId ?? "",
    };
    const socket = new WebSocket(
      `${webSocketUrl}/sdk/block-updates?${new URLSearchParams(params).toString()}`,
    );
    socket.addEventListener("message", (event) => {
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
    });

    void getApi(apiUrl)
      .getBlocks({ ...params, userProperties: userPropertiesRef.current })
      .then((res) => {
        setBlocks(res.blocks);
      })
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console -- This is a debug message
        console.log(err);
      });
  }, [apiUrl, environment, organizationId, userId]);

  return blocks;
};
